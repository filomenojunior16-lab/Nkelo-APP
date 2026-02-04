
import React, { useState } from 'react';
import { User, UserProgress, Achievement } from '../types';
import Icon from '../components/Icon';
import { Haptics } from '../utils/haptics';

interface Props {
  user: User;
  progress: UserProgress;
  onLogout: () => void;
  onSwitchAccount: () => void;
}

const ProfileScreen: React.FC<Props> = ({ user, progress, onLogout, onSwitchAccount }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'settings'>('stats');
  const [config, setConfig] = useState({
    haptics: true,
    notifications: true,
    sound: false,
    darkMode: true
  });

  const allAchievements: Achievement[] = [
    { id: '1', title: 'Primeiro Passo', icon: 'zap', unlocked: true, date: '12/10/2023' },
    { id: '2', title: 'Mestre da Lógica', icon: 'grid', unlocked: progress.totalPoints > 1000, date: '15/10/2023' },
    { id: '3', title: 'Explorador Nato', icon: 'globe', unlocked: progress.completedLessons.length > 2 },
    { id: '4', title: 'Agente de Elite', icon: 'shield', unlocked: user.level > 10 },
    { id: '5', title: 'Cérebro de Ouro', icon: 'award', unlocked: progress.totalPoints > 5000 },
    { id: '6', title: 'Sincronizador', icon: 'rocket', unlocked: progress.completedLessons.length > 5 }
  ];

  const stats = [
    { label: 'Soberania', val: Math.min(100, (progress.completedLessons.length * 15)), color: 'text-cyan-500' },
    { label: 'Logística', val: Math.min(100, (user.level * 8)), color: 'text-indigo-500' },
    { label: 'Energia', val: Math.min(100, (progress.totalPoints / 100)), color: 'text-amber-500' },
    { label: 'Cultura', val: user.role === 'ADMIN' ? 100 : 45, color: 'text-emerald-500' }
  ];

  const toggleConfig = (key: keyof typeof config) => {
    Haptics.light();
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-12 bg-[#020617] relative pb-40 scrollbar-hide">
      <div className="scanline opacity-10"></div>
      
      <header className="mb-12 flex flex-col items-center animate-reveal">
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
          <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] border-2 border-slate-800 flex items-center justify-center mb-6 relative z-10 shadow-2xl">
            <Icon name="user" size={40} className="text-indigo-400" />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-8 h-8 rounded-xl border-4 border-[#020617] flex items-center justify-center text-slate-900 shadow-lg">
              <Icon name="check" size={14} />
            </div>
          </div>
        </div>
        <h1 className="text-xl font-black text-white tracking-tighter uppercase mb-1">{user.name}</h1>
        <div className="flex items-center gap-2">
           <span className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[7px] font-black uppercase tracking-widest">Nível {user.level}</span>
           <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-500 text-[7px] font-black uppercase tracking-widest">{user.rank}</span>
        </div>
      </header>

      <div className="flex gap-2 p-1 bg-slate-900/50 rounded-2xl border border-slate-800 mb-8 animate-reveal delay-1">
         {[
           { id: 'stats', label: 'Estatísticas', icon: 'activity' },
           { id: 'achievements', label: 'Conquistas', icon: 'award' },
           { id: 'settings', label: 'Definições', icon: 'zap' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => { Haptics.light(); setActiveTab(tab.id as any); }}
             className={`flex-1 py-3 px-1 rounded-xl transition-all flex flex-col items-center gap-1.5 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
           >
             <Icon name={tab.icon} size={14} />
             <span className="text-[7px] font-black uppercase tracking-widest">{tab.label}</span>
           </button>
         ))}
      </div>

      <div className="space-y-6 animate-reveal delay-2">
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl text-center">
                  <span className="block text-xl font-black text-white tracking-tighter mb-1 tabular-nums">{progress.totalPoints}</span>
                  <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">XP Total</span>
               </div>
               <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-3xl text-center">
                  <span className="block text-xl font-black text-white tracking-tighter mb-1 tabular-nums">{progress.completedLessons.length}</span>
                  <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Dossiers</span>
               </div>
            </div>

            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-5">
               <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Capacidades Operacionais</h4>
               {stats.map((s, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[7px] font-black uppercase tracking-widest">
                       <span className="text-slate-400">{s.label}</span>
                       <span className={s.color}>{s.val}%</span>
                    </div>
                    <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                       <div className={`h-full ${s.color.replace('text-', 'bg-')} transition-all duration-1000 shadow-[0_0_8px_currentColor]`} style={{width: `${s.val}%`}}></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
             <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Conta & Identidade</h4>
                <button 
                  onClick={() => { Haptics.medium(); onSwitchAccount(); }}
                  className="w-full py-4 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] active:scale-95 transition-transform"
                >
                  Entrar com outra conta
                </button>
                <button 
                  onClick={() => { Haptics.error(); onLogout(); }}
                  className="w-full py-4 bg-rose-600/10 border border-rose-500/20 text-rose-500 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] active:scale-95 transition-transform"
                >
                  Eliminar Cache & Sair
                </button>
             </div>

             <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Interface</h4>
                {[
                  { id: 'haptics', label: 'Vibração Háptica', icon: 'activity' },
                  { id: 'notifications', label: 'Notificações', icon: 'zap' }
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-white uppercase tracking-tight">{item.label}</span>
                     <button 
                        onClick={() => toggleConfig(item.id as any)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${config[item.id as keyof typeof config] ? 'bg-indigo-500' : 'bg-slate-800'}`}
                     >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config[item.id as keyof typeof config] ? 'right-1' : 'left-1'}`}></div>
                     </button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;
