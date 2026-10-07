import React, { useState } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Footprints,
  TrendingUp,
  Target,
  User,
  Bot,
  Calendar as CalendarIcon,
  Droplet,
  Scale,
  Ruler,
  BookOpen,
  Award,
  Sun,
  Moon,
  Flame,
  LogIn,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export type NavTab = 
  | 'dashboard'
  | 'workouts'
  | 'nutrition'
  | 'activity'
  | 'progress'
  | 'goals'
  | 'profile'
  | 'ai_assistant'
  | 'calendar'
  | 'water'
  | 'weight'
  | 'measurements'
  | 'exercise_library'
  | 'badges';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const { profile, theme, toggleTheme, currentUser, signInWithGoogle, signOutUser } = useFitness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const primaryNavItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'activity', label: 'Activity', icon: Footprints },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const secondaryNavItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'ai_assistant', label: 'AI Assistant', icon: Bot },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'exercise_library', label: 'Exercises', icon: BookOpen },
    { id: 'water', label: 'Water Tracker', icon: Droplet },
    { id: 'weight', label: 'Weight Log', icon: Scale },
    { id: 'measurements', label: 'Body Stats', icon: Ruler },
    { id: 'badges', label: 'Badges & Streak', icon: Award },
  ];

  const handleMobileSelect = (id: NavTab) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                FitTrack
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Streak Indicator */}
          <div
            onClick={() => onTabChange('badges')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 cursor-pointer hover:bg-orange-500/20 transition text-xs sm:text-sm font-bold"
            title="Current Workout Streak"
          >
            <Flame className="w-4 h-4 fill-orange-500 stroke-orange-400 animate-pulse" />
            <span>{profile.streak} Days</span>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition border border-slate-700/50"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-200" />}
          </button>

          {/* Auth Button */}
          {currentUser ? (
            <button
              onClick={signOutUser}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title={`Signed in as ${currentUser.email}`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold transition shadow-md shadow-emerald-500/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md md:hidden flex flex-col pt-16 px-4 pb-6 overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Core Pages</div>
          <div className="space-y-1 mb-6">
            {primaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMobileSelect(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Features & AI</div>
          <div className="space-y-1">
            {secondaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMobileSelect(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-[61px] bottom-0 bg-slate-900/50 dark:bg-slate-950/50 border-r border-slate-800 p-4 overflow-y-auto space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-3">Main Navigation</div>
          <nav className="space-y-1">
            {primaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-3">Smart Tools & Logs</div>
          <nav className="space-y-1">
            {secondaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="mt-auto pt-4 border-t border-slate-800/80">
          <div
            onClick={() => onTabChange('profile')}
            className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-slate-950 text-sm">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'FT'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-100 truncate">{profile.name}</p>
              <p className="text-xs text-slate-400 truncate">{profile.fitnessGoal.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 flex items-center justify-around px-2 py-2">
        {primaryNavItems.slice(0, 5).map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => onTabChange('ai_assistant')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
            currentTab === 'ai_assistant' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">AI</span>
        </button>
      </nav>
    </>
  );
};
