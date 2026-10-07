import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, RefreshCw, Radio, AlertCircle } from 'lucide-react';
import { float32ToInt16Base64, base64ToFloat32Array } from '../utils/audioUtils';

export const LiveVoiceCoach: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Tap Microphone to Start Real-Time Voice Conversation');
  const [errorMessage, setErrorMessage] = useState('');
  const [transcripts, setTranscripts] = useState<{ role: 'user' | 'coach'; text: string }[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextInputRef = useRef<AudioContext | null>(null);
  const audioContextOutputRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const nextStartTimeRef = useRef<number>(0);

  const stopVoiceSession = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextInputRef.current) {
      audioContextInputRef.current.close();
      audioContextInputRef.current = null;
    }

    if (audioContextOutputRef.current) {
      audioContextOutputRef.current.close();
      audioContextOutputRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsSpeaking(false);
    setStatusMessage('Voice Coach session ended. Tap microphone to restart.');
  };

  const startVoiceSession = async () => {
    setErrorMessage('');
    setStatusMessage('Requesting microphone permission...');

    try {
      // 1. Request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // 2. Initialize WebSockets
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // 3. Audio Contexts
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      audioContextInputRef.current = inputCtx;
      audioContextOutputRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      ws.onopen = () => {
        setIsConnected(true);
        setStatusMessage('Connected to Gemini 3.8 Live Voice Coach! Speak now...');

        // Set up mic processing
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN && !isMuted) {
            const inputData = e.inputBuffer.getChannelData(0);
            const base64Pcm = float32ToInt16Base64(inputData);
            ws.send(JSON.stringify({ audio: base64Pcm }));
          }
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.error) {
            setErrorMessage(msg.error);
            stopVoiceSession();
            return;
          }

          if (msg.interrupted) {
            setIsSpeaking(false);
            nextStartTimeRef.current = outputCtx.currentTime;
            return;
          }

          if (msg.audio) {
            setIsSpeaking(true);
            const float32Pcm = base64ToFloat32Array(msg.audio);
            const buffer = outputCtx.createBuffer(1, float32Pcm.length, 24000);
            buffer.getChannelData(0).set(float32Pcm);

            const source = outputCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(outputCtx.destination);

            const playTime = Math.max(outputCtx.currentTime, nextStartTimeRef.current);
            source.start(playTime);
            nextStartTimeRef.current = playTime + buffer.duration;

            source.onended = () => {
              if (outputCtx.currentTime >= nextStartTimeRef.current - 0.1) {
                setIsSpeaking(false);
              }
            };
          }

          if (msg.text) {
            setTranscripts(prev => [...prev, { role: 'coach', text: msg.text }]);
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setErrorMessage('Voice connection error. Check server logs.');
        stopVoiceSession();
      };

      ws.onclose = () => {
        stopVoiceSession();
      };

    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMessage(err.message || 'Microphone access denied or unsupported.');
      stopVoiceSession();
    }
  };

  useEffect(() => {
    return () => {
      stopVoiceSession();
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background Pulse Effect */}
      {isConnected && (
        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="space-y-1 relative z-10">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 3.8 Live Voice Coach</span>
        </span>
        <h3 className="text-xl font-black text-white">Real-Time Voice Conversations</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">{statusMessage}</p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-400 flex items-center justify-center space-x-2 max-w-md mx-auto">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Visual Microphone Center Button */}
      <div className="relative z-10 flex flex-col items-center justify-center py-4">
        <div className="relative">
          {/* Animated Wave Rings when Connected */}
          {isConnected && (
            <>
              <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping opacity-75"></div>
              <div className="absolute -inset-8 rounded-full bg-emerald-500/10 animate-pulse"></div>
            </>
          )}

          <button
            onClick={isConnected ? stopVoiceSession : startVoiceSession}
            className={`relative z-20 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isConnected
                ? isMuted
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                  : 'bg-emerald-500 text-slate-950 shadow-emerald-500/40 scale-105'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-2 border-slate-700 hover:border-emerald-400'
            }`}
          >
            {isConnected ? (
              isMuted ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10 animate-pulse" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>
        </div>

        {/* Audio Output Wave Animation when AI is Speaking */}
        {isSpeaking && (
          <div className="flex items-center space-x-1 mt-4">
            <div className="w-1.5 h-6 bg-emerald-400 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-10 bg-teal-300 rounded-full animate-bounce [animation-delay:0.1s]"></div>
            <div className="w-1.5 h-8 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-12 bg-cyan-300 rounded-full animate-bounce [animation-delay:0.3s]"></div>
            <div className="w-1.5 h-6 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>

      {/* Control Actions Bar */}
      {isConnected && (
        <div className="flex items-center justify-center space-x-4 relative z-10 pt-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 border ${
              isMuted
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isMuted ? 'Muted' : 'Mute Mic'}</span>
          </button>

          <button
            onClick={stopVoiceSession}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-bold transition"
          >
            End Live Session
          </button>
        </div>
      )}
    </div>
  );
};
