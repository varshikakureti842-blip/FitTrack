import React, { useState } from 'react';
import { FitnessProvider } from './context/FitnessContext';
import { Navigation, NavTab } from './components/Navigation';

import { DashboardPage } from './pages/DashboardPage';
import { WorkoutTrackerPage } from './pages/WorkoutTrackerPage';
import { NutritionTrackerPage } from './pages/NutritionTrackerPage';
import { ActivityPage } from './pages/ActivityPage';
import { ProgressAnalyticsPage } from './pages/ProgressAnalyticsPage';
import { GoalsPage } from './pages/GoalsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { CalendarPage } from './pages/CalendarPage';
import { WaterTrackerPage } from './pages/WaterTrackerPage';
import { WeightTrackerPage } from './pages/WeightTrackerPage';
import { MeasurementsPage } from './pages/MeasurementsPage';
import { ExerciseLibraryPage } from './pages/ExerciseLibraryPage';
import { BadgesPage } from './pages/BadgesPage';

export function FitTrackApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentTab} />;
      case 'workouts':
        return <WorkoutTrackerPage />;
      case 'nutrition':
        return <NutritionTrackerPage />;
      case 'activity':
        return <ActivityPage />;
      case 'progress':
        return <ProgressAnalyticsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'ai_assistant':
        return <AiAssistantPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'water':
        return <WaterTrackerPage />;
      case 'weight':
        return <WeightTrackerPage />;
      case 'measurements':
        return <MeasurementsPage />;
      case 'exercise_library':
        return <ExerciseLibraryPage />;
      case 'badges':
        return <BadgesPage />;
      default:
        return <DashboardPage onNavigate={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main View Area */}
      <main className="flex-1 md:pl-64 pt-4 px-4 md:px-8 max-w-7xl w-full mx-auto pb-20 md:pb-12">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <FitnessProvider>
      <FitTrackApp />
    </FitnessProvider>
  );
}
