
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
    if (user) {
      localStorage.setItem('nkelo_user', JSON.stringify(user));
      localStorage.setItem('nkelo_progress', JSON.stringify(progress));
    }
  }, [user, progress]);

  // Handler centralizado e robusto para evitar ecrãs pretos
  const navigateToHome = useCallback(() => {
    setView('home');
    setSelectedModule(null);
    setSelectedLesson(null);
    setActiveQuizzes([]);
    // Garante que o scroll volta ao topo e estados modais são limpos
  }, []);

  const handleLogout = () => {
    Haptics.error();
    localStorage.removeItem('nkelo_user');
    localStorage.removeItem('nkelo_progress');
    setUser(null);
    setView('home');
    setActiveTab('dashboard');
  };

  const handleSwitchAccount = () => {
    Haptics.medium();
    // Simplesmente desloga o utilizador atual mas mantém dados em cache para o AuthScreen sugerir
    setUser(null);
    setView('home');
    setActiveTab('dashboard');
  };

  if (loading) return <SplashScreen />;
  if (!onboarded) return <OnboardingScreen onFinish={() => { setOnboarded(true); localStorage.setItem('nkelo_onboarded', 'true'); }} />;
  
  if (!user) return (
    <AuthScreen onLogin={(name, email, fav, role) => {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name, email, role,
        level: role === UserRole.ADMIN ? 99 : (role === UserRole.ENTUSIASTA ? 5 : 1),
        rank: role === UserRole.ADMIN ? 'SUPER-USER' : (role === UserRole.ENTUSIASTA ? 'Explorador' : 'Aspirante'),
        credits: role === UserRole.ADMIN ? 999999 : (role === UserRole.ENTUSIASTA ? 500 : 100),
        favoriteModule: fav,
        achievements: []
      };
      setUser(newUser);
      setActiveTab(role === UserRole.ADMIN ? ('admin' as any) : 'dashboard');
      setView('home');
    }} />
  );

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

  const isAdmin = user.role === UserRole.ADMIN;

  const renderTabContent = () => {
    if (isAdmin && activeTab !== 'profile') {
      return <AdminDashboardScreen user={user} onSetBroadcast={setBroadcast} />;
    }

    switch (activeTab) {
      case 'dashboard': return <DashboardScreen user={user} progress={progress} broadcast={broadcast} onClearBroadcast={() => setBroadcast(null)} onOpenArchive={() => setView('archive')} onSelectModule={(m) => openModule(m)} />;
      case 'learn': return <LearnScreen onSelectModule={(m, mode) => openModule(m, mode)} progress={progress} user={user} />;
      case 'nexus': return <NexusScreen user={user} />;
      case 'worldcup': return <WorldcupScreen progress={progress} />;
      case 'profile': return <ProfileScreen user={user} progress={progress} onLogout={handleLogout} onSwitchAccount={handleSwitchAccount} />;
      default: return <DashboardScreen user={user} progress={progress} broadcast={broadcast} onClearBroadcast={() => setBroadcast(null)} onOpenArchive={() => setView('archive')} onSelectModule={(m) => openModule(m)} />;
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#020617] max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-slate-800">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {view === 'home' && renderTabContent()}
        
        {view === 'module' && selectedModule && (
          <ModuleScreen 
            module={selectedModule} 
            onBack={navigateToHome} 
            onSelectLesson={l => { setSelectedLesson(l); setView('lesson'); }} 
            completedLessons={progress.completedLessons} 
          />
        )}
        
        {view === 'lesson' && selectedLesson && selectedModule && (
          <LessonScreen 
            lesson={selectedLesson} 
            moduleColor={selectedModule.color} 
            learningMode={activeLearningMode}
            onBack={() => setView('module')} 
            onStartQuiz={() => { setActiveQuizzes(selectedLesson.quizzes || []); setView('quiz'); }} 
          />
        )}
        
        {view === 'quiz' && selectedModule && (
          <QuizScreen 
            quizzes={activeQuizzes.length > 0 ? activeQuizzes : (selectedLesson?.quizzes || [])} 
            moduleColor={selectedModule.color} 
            userPoints={progress.totalPoints} 
            onComplete={pts => { 
              const newPoints = progress.totalPoints + pts;
              const newCompleted = selectedLesson ? [...new Set([...progress.completedLessons, selectedLesson.id])] : progress.completedLessons;
              setProgress(prev => ({ ...prev, totalPoints: newPoints, completedLessons: newCompleted })); 
              setView('reward'); 
            }} 
            onBack={() => setView('lesson')} 
            onUpdateProgress={pts => setProgress(p => ({ ...p, totalPoints: pts }))} 
          />
        )}
        
        {view === 'reward' && <RewardScreen onContinue={navigateToHome} />}
        {view === 'ai-chat' && <AIChatScreen onBack={navigateToHome} />}
        {view === 'explore' && <ExplorationScreen onBack={navigateToHome} />}
        {view === 'archive' && <ArchiveScreen onBack={navigateToHome} />}

        {/* MECANISMO DE SEGURANÇA: Se o ecrã ficar preto por erro de estado, exibe o Fallback */}
        {view !== 'home' && !selectedModule && !selectedLesson && view !== 'reward' && view !== 'ai-chat' && view !== 'explore' && view !== 'archive' && (
           <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-950">
             <div className="w-16 h-16 bg-rose-600/20 rounded-3xl flex items-center justify-center text-rose-500 mb-6">
                <Icon name="shield" size={32} />
             </div>
             <h2 className="text-white font-black uppercase text-xs tracking-widest mb-2">Erro de Protocolo de Ecrã</h2>
             <p className="text-slate-500 text-[10px] uppercase font-bold mb-8">A Triangulação de Vista falhou. O sistema vai resetar para o Dashboard.</p>
             <button onClick={navigateToHome} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Sincronizar Manualmente</button>
           </div>
        )}
      </div>

      <nav className="h-[calc(4.5rem+env(safe-area-inset-bottom))] bg-slate-950/95 backdrop-blur-3xl border-t border-slate-800/50 flex items-center justify-around px-2 z-[70] pb-[env(safe-area-inset-bottom)]">
        {isAdmin ? (
          <>
            <button onClick={() => handleTabChange('admin' as any)} className={`flex-1 flex flex-col items-center gap-1 py-2 ${activeTab === 'admin' ? 'text-rose-400' : 'text-slate-600'}`}>
              <Icon name="shield" size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Painel Admin</span>
            </button>
            <button onClick={() => handleTabChange('profile')} className={`flex-1 flex flex-col items-center gap-1 py-2 ${activeTab === 'profile' ? 'text-rose-400' : 'text-slate-600'}`}>
              <Icon name="user" size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Perfil</span>
            </button>
          </>
        ) : (
          <>
            {[
              { id: 'dashboard', icon: 'home', label: 'Início' },
              { id: 'nexus', icon: 'zap', label: 'Nexus' },
              { id: 'learn', icon: 'grid', label: 'Missão', center: true },
              { id: 'worldcup', icon: 'award', label: 'Arena' },
              { id: 'profile', icon: 'user', label: 'Perfil' }
            ].map(tab => (
              tab.center ? (
                <button 
                  key={tab.id} 
                  onClick={() => handleTabChange('learn')} 
                  className={`w-14 h-14 -mt-10 rounded-[1.8rem] flex items-center justify-center transition-all shadow-2xl ${
                    activeTab === 'learn' 
                    ? 'bg-indigo-600 text-white scale-110 shadow-indigo-600/30 ring-4 ring-[#020617]' 
                    : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon name={tab.icon} size={24} />
                </button>
              ) : (
                <button 
                  key={tab.id} 
                  onClick={() => handleTabChange(tab.id as AppTab)} 
                  className={`flex-1 flex flex-col items-center gap-1 transition-all py-2 active:scale-95 ${
                    activeTab === tab.id ? 'text-indigo-400' : 'text-slate-600'
                  }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span className="text-[7px] font-black uppercase tracking-widest">{tab.label}</span>
                </button>
              )
            ))}
          </>
        )}
      </nav>
    </div>
  );
};

export default App;
