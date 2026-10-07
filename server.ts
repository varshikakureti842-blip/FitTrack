import express, { Request, Response } from 'express';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { WebSocketServer, WebSocket as WsClient } from 'ws';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini AI client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: AI Fitness Assistant
app.post('/api/ai/fitness-assistant', async (req: Request, res: Response) => {
  try {
    const { query, userContext } = req.body;

    if (!query) {
      res.status(400).json({ error: 'Query is required.' });
      return;
    }

    const systemInstruction = `
You are FitTrack AI, a knowledgeable, encouraging, and highly personal fitness assistant.
Analyze the user's provided fitness data and answer their question clearly, practically, and empathetically.

User Profile & Fitness Context:
${JSON.stringify(userContext, null, 2)}

Guidelines:
- Give concise, actionable advice tailored to their goal, recent workouts, calories, and step levels.
- Format responses cleanly with markdown bullet points and short sections.
- MANDATORY SAFETY DISCLAIMER: Never provide medical diagnosis or replace a doctor, physical therapist, or registered dietitian.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: query,
      config: {
        systemInstruction,
      },
    });

    res.json({ response: response.text });
  } catch (error: any) {
    console.error('Error in fitness-assistant API:', error);
    res.status(500).json({
      error: 'Failed to generate AI response',
      details: error?.message || String(error),
    });
  }
});

// Endpoint: AI Workout Plan Generator
app.post('/api/ai/workout-plan', async (req: Request, res: Response) => {
  try {
    const {
      fitnessGoal,
      experienceLevel,
      daysPerWeek,
      durationMinutes,
      availableEquipment,
      targetMuscleGroups,
    } = req.body;

    const prompt = `
Generate a structured, progressive weekly workout plan based on these user preferences:
- Goal: ${fitnessGoal}
- Experience Level: ${experienceLevel}
- Training Days Per Week: ${daysPerWeek}
- Duration per Session: ${durationMinutes} minutes
- Equipment: ${availableEquipment}
- Target Muscles: ${targetMuscleGroups?.join(', ') || 'Full Body'}

Return JSON strictly adhering to this schema:
{
  "planTitle": "string",
  "summary": "string describing the plan focus",
  "weeklySchedule": [
    {
      "dayName": "e.g. Day 1: Upper Body Push",
      "focus": "string",
      "exercises": [
        {
          "name": "string",
          "targetMuscle": "string",
          "sets": number,
          "reps": "string e.g. 8-12",
          "restSeconds": number
        }
      ]
    }
  ],
  "generalTips": ["string tip 1", "string tip 2", "string tip 3"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsedPlan = JSON.parse(response.text || '{}');
    res.json({ plan: parsedPlan });
  } catch (error: any) {
    console.error('Error in workout-plan API:', error);
    res.status(500).json({
      error: 'Failed to generate workout plan',
      details: error?.message || String(error),
    });
  }
});

// Dev environment setup with Vite middlewares
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Static serving for production
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const httpServer = app.listen(port, () => {
  console.log(`FitTrack server listening on http://localhost:${port}`);
});

// Setup WebSocket Server for Live Voice API (gemini-3.8-live)
const wss = new WebSocketServer({ server: httpServer, path: '/api/live' });

wss.on('connection', async (clientWs: WsClient) => {
  console.log('Client connected to Live Voice Coach');

  try {
    const session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: `You are FitTrack Live Voice Coach. Give short, energetic, actionable audio responses to user questions about workout form, motivation, nutrition, and exercise routines. Keep answers brief (2-3 sentences max) for fast real-time conversations.`,
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (audio) {
            clientWs.send(JSON.stringify({ audio, text }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onerror: (err) => {
          console.error('Gemini Live session error:', err);
          clientWs.send(JSON.stringify({ error: err.message || String(err) }));
        },
        onclose: () => {
          console.log('Gemini Live session closed');
        }
      },
    });

    clientWs.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio) {
          session.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        }
      } catch (e) {
        console.error('Error handling WebSocket message:', e);
      }
    });

    clientWs.on('close', () => {
      session.close();
    });
  } catch (err: any) {
    console.error('Failed to establish Gemini Live session:', err);
    clientWs.send(JSON.stringify({ error: 'Could not connect to Gemini Live Voice session' }));
    clientWs.close();
  }
});
