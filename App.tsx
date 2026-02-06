
import React, { useState, useEffect, useCallback } from 'react';
import { Module, Lesson, UserProgress, Quiz, User, AppTab, LearningMode, UserRole, Broadcast } from './types';
import { APP_MODULES } from './data/mockData';
import DashboardScreen from './screens/DashboardScreen';
import LearnScreen from './screens/LearnScreen';
import ProfileScreen from './screens/ProfileScreen';
import ArchiveScreen from './screens/ArchiveScreen';
import NexusScreen from './screens/NexusScreen';
import WorldcupScreen from './screens/WorldcupScreen';
import ModuleScreen from './screens/ModuleScreen';
import LessonScreen from './screens/LessonScreen';
import QuizScreen from './screens/QuizScreen';
import RewardScreen from './screens/RewardScreen';
import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AIChatScreen from './screens/AIChatScreen';
import ExplorationScreen from './screens/ExplorationScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import Icon from './components/Icon';
import { Haptics } from './utils/haptics';
import { DataService } from './services/supabaseClient';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState<boolean>(() => localStorage.getItem('nkelo_onboarded') === 'true');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nkelo_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [view, setView] = useState<'home' | 'module' | 'lesson' | 'quiz' | 'reward' | 'ai-chat' | 'explore' | 'archive' | 'admin'>('home');
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeLearningMode, setActiveLearningMode] = useState<LearningMode>(LearningMode.TACTICAL);
  const [activeQuizzes, setActiveQuizzes] = useState<Quiz[]>([]);
  const [broadcast, setBroadcast] = useState<Broadcast | null>(() => {
    const saved = localStorage.getItem('nkelo_broadcast');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('nkelo_progress');
    return saved ? JSON.parse(saved) : { totalPoints: 0, completedLessons: [], timeSpent: 0 };
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user && progress) {
      localStorage.setItem('nkelo_progress', JSON.stringify(progress));
      DataService.saveProgress(user.id, progress);
    }
  }, [progress, user]);

  const navigateToHome = useCallback(() => {
    setView('home');
    setSelectedModule(null);
    setSelectedLesson(null);
    setActiveQuizzes([]);
  }, []);

  const handleTabChange = (tab: AppTab) => {
    Haptics.light();
    setActiveTab(tab);
    navigateToHome();
  };

  const openModule = (m: Module, mode?: LearningMode) => {
    Haptics.medium();
    if (mode) setActiveLearningMode(mode);
    setSelectedModule(m);
    setView('module');
  };

  if (loading) return <SplashScreen />;
  if (!onboarded) return <OnboardingScreen onFinish={() => { setOnboarded(true); localStorage.setItem('nkelo_onboarded', 'true'); }} />;
  
  if (!user) return <AuthScreen onLogin={(name, email, fav, role) => {
    // Gerador de UUID v4 simples para compatibilidade com o tipo UUID do Supabase RPC
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

    const newUser: User = { 
      id: uuid, 
      name, 
      email, 
      role, 
      level: 1, 
      rank: role === UserRole.ADMIN ? 'Supervisor' : 'Aspirante', 
      credits: 100, 
      achievements: [], 
      favoriteModule: fav 
    };
    setUser(newUser);
    localStorage.setItem('nkelo_user', JSON.stringify(newUser));
    setView('home');
  }} />;

  const isAdmin = user.role === UserRole.ADMIN;

  const renderTabContent = () => {
    if (isAdmin && activeTab === 'admin') {
      return <AdminDashboardScreen user={user} onSetBroadcast={(b) => {
        setBroadcast(b);
        if (b) localStorage.setItem('nkelo_broadcast', JSON.stringify(b));
        else localStorage.removeItem('nkelo_broadcast');
      }} />;
    }

    switch (activeTab) {
      case 'dashboard': 
        return (
          <DashboardScreen 
            user={user} 
            progress={progress} 
            broadcast={broadcast} 
            onClearBroadcast={() => setBroadcast(null)} 
            onOpenArchive={() => setView('archive')} 
            onSelectModule={openModule} 
          />
        );
      case 'learn': return <LearnScreen onSelectModule={openModule} progress={progress} user={user} />;
      case 'nexus': return <NexusScreen user={user} />;
      case 'worldcup': return <WorldcupScreen progress={progress} />;
      case 'profile': 
        return (
          <ProfileScreen 
            user={user} 
            progress={progress} 
            onLogout={() => { setUser(null); localStorage.removeItem('nkelo_user'); }} 
            onSwitchAccount={() => { setUser(null); }} 
          />
        );
      default: return null;
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#020617] max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-slate-800">
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {view === 'home' && renderTabContent()}
        {view === 'module' && selectedModule && (
          <ModuleScreen 
            module={selectedModule} 
            completedLessons={progress.completedLessons} 
            onBack={navigateToHome} 
            onSelectLesson={l => { setSelectedLesson(l); setView('lesson'); }} 
          />
        )}
        {view === 'lesson' && selectedLesson && selectedModule && (
          <LessonScreen 
            lesson={selectedLesson} 
            moduleColor={selectedModule.color} 
            learningMode={activeLearningMode} 
            onBack={() => setView('module')} 
            onStartQuiz={() => { setActiveQuizzes(selectedLesson.quizzes); setView('quiz'); }} 
          />
        )}
        {view === 'quiz' && selectedModule && (
          <QuizScreen 
            quizzes={activeQuizzes} 
            moduleColor={selectedModule.color} 
            userPoints={progress.totalPoints} 
            onUpdateProgress={pts => setProgress(prev => ({ ...prev, totalPoints: pts }))}
            onComplete={earnedPoints => { 
              setProgress(prev => ({ 
                ...prev, 
                totalPoints: prev.totalPoints + earnedPoints, 
                completedLessons: [...new Set([...prev.completedLessons, selectedLesson!.id])] 
              })); 
              setView('reward'); 
            }} 
            onBack={() => setView('lesson')} 
          />
        )}
        {view === 'reward' && <RewardScreen onContinue={navigateToHome} />}
        {view === 'archive' && <ArchiveScreen onBack={navigateToHome} />}
        {view === 'ai-chat' && <AIChatScreen onBack={navigateToHome} />}
        {view === 'explore' && <ExplorationScreen user={user} onBack={navigateToHome} />}
      </main>

      {/* Navigation Bar */}
      {view === 'home' && (
        <nav className="h-[calc(4.5rem+env(safe-area-inset-bottom))] bg-slate-950/95 backdrop-blur-3xl border-t border-slate-800/50 flex items-center justify-around px-2 z-[999] pb-[env(safe-area-inset-bottom)]">
          {[
            { id: 'dashboard', icon: 'home', label: 'Início' },
            { id: 'nexus', icon: 'zap', label: 'Nexus' },
            { id: 'learn', icon: 'grid', label: 'Estudar', center: true },
            { id: 'worldcup', icon: 'award', label: 'Arena' },
            { id: isAdmin ? 'admin' : 'profile', icon: isAdmin ? 'shield' : 'user', label: isAdmin ? 'Kernel' : 'Perfil' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as AppTab)}
              className={`flex-1 flex flex-col items-center gap-1 transition-all py-2 ${tab.center ? '-mt-10' : ''} ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-600'}`}
            >
              {tab.center ? (
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl ${activeTab === 'learn' ? 'bg-indigo-600 text-white shadow-indigo-600/40 ring-4 ring-[#020617]' : 'bg-slate-800 text-slate-500 shadow-xl'}`}>
                  <Icon name={tab.icon} size={24} />
                </div>
              ) : (
                <>
                  <Icon name={tab.icon} size={18} />
                  <span className="text-[7px] font-black uppercase tracking-widest">{tab.label}</span>
                </>
              )}
            </button>
          ))}
        </nav>
      )}

      {/* Quick AI Action Bubbles */}
      {view === 'home' && activeTab === 'dashboard' && (
        <div className="absolute bottom-24 right-6 flex flex-col gap-4 z-[50]">
          <button 
            onClick={() => { Haptics.medium(); setView('explore'); }}
            className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center shadow-lg border border-white/20 bouncy-btn"
          >
            <Icon name="globe" size={20} />
          </button>
          <button 
            onClick={() => { Haptics.medium(); setView('ai-chat'); }}
            className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl border border-white/20 bouncy-btn"
          >
            <Icon name="rocket" size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
