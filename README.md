# FitTrack - Modern Fitness & Health Tracking Dashboard

FitTrack is a modern, full-stack Fitness Tracker web application designed for users who want to record daily fitness activities, monitor nutrition, track weight and body measurements, and receive personalized AI insights and workout plans over time.

---

## 🚀 Application Features

### 1. Dashboard Overview
- **Daily Progress Rings**: Visual completion rings tracking overall daily target percentage.
- **Core Metrics Cards**: Real-time stats for calories consumed, calories burned, active workout duration, step count, water intake, weight, and BMI.
- **Quick Logger Actions**: One-click modals to log water, steps, meals, or weigh-ins instantly.

### 2. User Profile & Health Metrics
- **Profile Parameters**: Name, Age, Gender, Height, Weight, Starting & Target Weight, Primary Goal, Activity Level.
- **Automated Health Calculations**:
  - **BMI (Body Mass Index)** with health category classification (*Underweight, Normal, Overweight, Obese*).
  - **BMR (Basal Metabolic Rate)** calculated via the Mifflin-St Jeor equation.
  - **TDEE (Total Daily Energy Expenditure)** based on physical activity multipliers.
  - **Recommended Caloric Target** based on primary goals (*Weight Loss, Muscle Gain, Maintain Weight, Improve Fitness*).

### 3. Workout Tracker & Progressive Overload
- **Live Workout Timer**: Interactive workout recorder with start, pause, stop, and reset timer capabilities.
- **Exercise Logging**: Track exercise names, sets, repetitions, weights used, and estimated calories burned.
- **Progressive Overload History**: Automatically looks up and displays past personal best records for exercises to help users track strength progression.

### 4. Exercise Library
- **Categorized Exercises**: Exercises grouped by *Chest, Back, Shoulders, Arms, Legs, Core, Full Body,* and *Cardio*.
- **Detailed Guides**: Target muscle groups, equipment required, difficulty rating, and step-by-step instructions.
- **Search & Filter**: Search by exercise name, target muscle, or equipment.

### 5. Steps & Daily Activity Tracker
- **Activity Metrics**: Steps walked, distance in kilometers, active minutes, and burned energy.
- **Weekly Bar Chart**: Visual 7-day step volume trend chart.
- **Wearable Device Sync**: Simulated sync feature prepared for Apple Health, Google Fit, or Fitbit API extensions.

### 6. Water Hydration Tracker
- **Custom Hydration Goal**: Set daily water targets in milliliters.
- **Visual Vessel Progress**: Animated liquid glass filling animation showing current hydration level.
- **Quick Containers**: Instant buttons for 250ml, 500ml, 750ml, and 1000ml logs.

### 7. Nutrition & Macro Tracker
- **Meal Logs**: Categorize meals into *Breakfast, Lunch, Dinner,* and *Snacks*.
- **Macronutrients**: Track Calories, Protein (g), Carbohydrates (g), Fats (g), and Fiber (g).
- **Macro Distribution Charts**: Pie chart breakdown and macronutrient progress bars comparing intake against daily targets.

### 8. Weight & Body Measurements Tracker
- **Weight Progression**: Log weigh-ins with date and optional notes.
- **Interactive Line Chart**: Progress chart comparing starting, current, and target weights over time.
- **Body Circumferences**: Track Waist, Chest, Arms, Hips, Thighs, and Body Fat Percentage.

### 9. Progress & Analytics
- **Multi-Period Analytics**: Toggle between 7-Day Weekly and 30-Day Monthly views.
- **Trend Charts**: Workout duration, energy expenditure, and step volume trends.
- **Calculated Insights**: Non-medical insights summarizing weekly workout consistency and weight changes.

### 10. Goals & Streak Badges
- **Custom Goals**: Create targets for weight, running distance, workout frequency, daily steps, water intake, or strength lifts.
- **Streak & Milestone Badges**: Track current streak, longest streak, and unlock milestone badges (*First Workout, 5-Day Streak, 10k Steps Hero, Hydration Master, Iron Lifter*).

### 11. AI Fitness Assistant & Workout Plan Generator
- **AI Assistant Chat**: Powered by Google Gemini AI (`gemini-3.8-flash`) via server-side API endpoints (`/api/ai/fitness-assistant`). Answers user fitness queries using stored profile and workout logs.
- **Workout Plan Generator**: Generates customized weekly workout split plans based on goal, experience level, days per week, session duration, available equipment, and target muscle groups (`/api/ai/workout-plan`).
- **Safety Messaging**: Includes appropriate safety disclaimers for health questions.

### 12. Fitness Calendar
- **Color-Coded Calendar**: Visual calendar displaying workouts, meals, weigh-ins, and rest days per selected date.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool & Dev Server**: Vite 8 + Express (SSR/API middleware)
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Data Visualization**: Recharts (Line charts, Bar charts, Pie charts) & Custom SVG Progress Rings
- **Backend Runtime**: Node.js with Express (`server.ts`)
- **AI SDK**: `@google/genai` TypeScript SDK (Model: `gemini-3.8-flash`)
- **Authentication & Database**: Firebase Authentication (Google Sign-In) & Cloud Firestore

---

## ⚡ Setup Instructions for Firebase

FitTrack uses **Firebase Firestore** for database storage and **Firebase Authentication** for user accounts.

### 1. Configuration File
The application reads Firebase credentials from `firebase-applet-config.json` in the root directory:
```json
{
  "projectId": "<YOUR_PROJECT_ID>",
  "appId": "<YOUR_APP_ID>",
  "apiKey": "<YOUR_API_KEY>",
  "authDomain": "<YOUR_PROJECT_ID>.firebaseapp.com",
  "firestoreDatabaseId": "<YOUR_DATABASE_ID>",
  "storageBucket": "<YOUR_PROJECT_ID>.firebasestorage.app",
  "messagingSenderId": "<YOUR_SENDER_ID>"
}
```

### 2. Firestore Blueprint Schema (`firebase-blueprint.json`)
Data is structured around user-owned subcollections for privacy and security:
- `/users/{userId}`: User profile document
- `/users/{userId}/workouts/{workoutId}`: Workout logs
- `/users/{userId}/meals/{mealId}`: Nutrition logs
- `/users/{userId}/water/{waterId}`: Hydration logs
- `/users/{userId}/weight/{weightId}`: Weight logs
- `/users/{userId}/measurements/{measurementId}`: Body circumference logs
- `/users/{userId}/goals/{goalId}`: Fitness goal items
- `/users/{userId}/activity/{activityId}`: Daily activity logs

### 3. Firestore Security Rules (`firestore.rules`)
The app uses rule isolation so users can only access their own profile and subcollections:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      match /{allSubcollections=**} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}
```

---

## 💻 Guidelines for Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Environment Variables (`.env`)
Create or update `.env` in the root folder:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
```

### Local Development Commands

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   This launches the Express server with Vite middleware on `http://localhost:3000`.

3. **Lint & Type Check**:
   ```bash
   npm run lint
   ```

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

5. **Start Production Preview**:
   ```bash
   npm run preview
   ```

---

## 📂 Project Structure

```
├── server.ts                    # Express server with Gemini AI endpoints
├── firebase-applet-config.json  # Firebase app client configuration
├── firebase-blueprint.json       # Blueprint describing entities and Firestore paths
├── firestore.rules              # Cloud Firestore security rules
├── README.md                    # Project documentation
├── src/
│   ├── App.tsx                  # Main app container and tab navigation
│   ├── components/              # Navigation, ProgressRing, AuthModal
│   ├── context/                 # FitnessContext state management & Firebase sync
│   ├── data/                    # Exercise library & initial sample data
│   ├── firebase/                # Firebase config & Firestore service functions
│   ├── pages/                   # Application pages (Dashboard, Workouts, Nutrition, etc.)
│   ├── types/                   # TypeScript interface definitions
│   └── utils/                   # Health & fitness calculations (BMI, BMR, TDEE, Macros)
```
