
import React, { useState, useEffect } from 'react';
import { User, UserProgress, Module, Broadcast } from '../types';
import { APP_MODULES } from '../data/mockData';
import Icon from '../components/Icon';
import { Haptics } from '../utils/haptics';
import { AIService } from '../services/aiService';

interface Props {
  user: User;
  progress: UserProgress;
  broadcast: Broadcast | null;
  onClearBroadcast: () => void;
  onOpenArchive: () => void;
  onSelectModule: (module: Module) => void;
}

const DashboardScreen: React.FC<Props> = ({ user, progress, broadcast, onClearBroadcast, onOpenArchive, onSelectModule }) => {
  const [recommendation, setRecommendation] = useState<{module: string, text: string} | null>(null);

  useEffect(() => {
    const fetchRec = async () => {
      // ML: Preditivamente sugere o próximo passo baseado no histórico
      const rec = await AIService.getAdaptiveRecommendation(progress.completedLessons, 85);
      setRecommendation({
        module: rec.recommendedModule,
        text: rec.justification
      });
    };
    fetchRec();
  }, [progress.completedLessons]);

  const recommendedModule = APP_MODULES.find(m => m.id === user.favoriteModule) || APP_MODULES[0];
  const aiModule = APP_MODULES.find(m => m.id === recommendation?.module) || recommendedModule;

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 bg-[#020617] relative pb-32 scrollbar-hide">
      <div className="scanline opacity-10"></div>
      
      <header className="mb-10 flex items-center justify-between animate-reveal">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
             <Icon name="user" size={28} />
           </div>
           <div>
             <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">Agente {user.name.split(' ')[0]}</h1>
             <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">Status: Conectado • Nível {user.level}</p>
           </div>
        </div>
        <button 
          onClick={() => { Haptics.light(); onOpenArchive(); }} 
          className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 bouncy-btn active:bg-slate-800"
        >
           <Icon name="bookOpen" size={20} />
        </button>
      </header>

      {/* Card de Recomendação Neural Link */}
      {recommendation && (
        <button 
          onClick={() => onSelectModule(aiModule)}
          className="w-full mb-6 p-6 bg-indigo-900/20 border border-indigo-500/30 rounded-[2.5rem] animate-reveal relative overflow-hidden group flex items-center gap-5 transition-transform active:scale-95"
        >
           <div className="absolute top-0 right-0 p-2 text-indigo-500/10"><Icon name="activity" size={60} /></div>
           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/40">
              <Icon name="zap" size={20} />
           </div>
           <div className="text-left">
              <span className="text-[7px] font-black text-indigo-400 uppercase tracking-[0.4em] block mb-1">Neural Recommendation</span>
              <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">{recommendation.text}</h4>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Aceder: {aiModule.title}</p>
           </div>
        </button>
      )}

      {broadcast && (
        <div className="mb-8 p-6 bg-rose-600/10 border border-rose-500/30 rounded-3xl animate-reveal relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-2 text-rose-500/20"><Icon name="zap" size={40} /></div>
           <div className="flex justify-between items-start mb-2">
              <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                 <Icon name="shield" size={10} /> Mensagem do Comando
              </span>
              <button onClick={onClearBroadcast} className="text-slate-500 hover:text-white"><Icon name="plus" size={14} className="rotate-45" /></button>
           </div>
           <p className="text-[11px] font-bold text-white leading-relaxed uppercase tracking-tight italic">"{broadcast.message}"</p>
        </div>
      )}

      <button 
        onClick={() => { Haptics.medium(); onSelectModule(recommendedModule); }}
        className="w-full mb-10 p-8 bg-indigo-600 rounded-[2.5rem] relative overflow-hidden border-t border-white/20 shadow-xl text-left group transition-transform active:scale-[0.98] animate-reveal delay-1"
      >
        <div className="absolute right-[-10%] top-[-10%] p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Icon name="rocket" size={140} />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Missão Principal</h3>
          <p className="text-indigo-100 text-[11px] font-bold leading-relaxed mb-6 opacity-80">Continue a progressão em <span className="text-white underline">{recommendedModule.title}</span>.</p>
          <div className="inline-flex bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10 items-center gap-4">
             <Icon name={recommendedModule.icon} size={20} className="text-white" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Iniciar</span>
          </div>
        </div>
      </button>

      <div className="grid grid-cols-2 gap-4 animate-reveal delay-2">
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] flex flex-col items-center gap-2">
           <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-1">
              <Icon name="zap" size={20} className="text-amber-500" />
           </div>
           <span className="text-2xl font-black text-white tabular-nums">{progress.totalPoints}</span>
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">XP</span>
        </div>
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] flex flex-col items-center gap-2">
           <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mb-1">
              <Icon name="award" size={20} className="text-rose-500" />
           </div>
           <span className="text-2xl font-black text-white tabular-nums">{progress.completedLessons.length}</span>
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Dossiers</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
