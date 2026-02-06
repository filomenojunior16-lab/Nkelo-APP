
import React, { useState, useMemo } from 'react';
import { Module, UserProgress, ModuleType, User, LearningMode } from '../types';
import { APP_MODULES } from '../data/mockData';
import Icon from '../components/Icon';
import { Haptics } from '../utils/haptics';

interface Props {
  onSelectModule: (module: Module, mode: LearningMode) => void;
  progress: UserProgress;
  user: User;
}

const LearnScreen: React.FC<Props> = ({ onSelectModule, progress, user }) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('soberania');
  const [activeMode, setActiveMode] = useState<LearningMode>(LearningMode.TACTICAL);

  const sectors = useMemo(() => [
    { id: 'soberania', title: 'Identidade', types: [ModuleType.CIVICS, ModuleType.HISTORY], icon: 'shield', color: 'text-indigo-400' },
    { id: 'engenharia', title: 'Tecnologia', types: [ModuleType.ROBOTICS, ModuleType.MATHEMATICS, ModuleType.CODING], icon: 'zap', color: 'text-cyan-400' },
    { id: 'biossistemas', title: 'Recursos', types: [ModuleType.AGRICULTURE, ModuleType.BIOLOGY], icon: 'globe', color: 'text-emerald-400' }
  ], []);

  const learningModes = [
    { 
      id: LearningMode.STORYTELLING, 
      label: 'Ancestral', 
      icon: 'bookOpen', 
      desc: 'Narrativa Épica',
      info: 'A IA transforma a lição numa jornada onde tu és o herói da história.'
    },
    { 
      id: LearningMode.PRACTICE, 
      label: 'Oficina', 
      icon: 'zap', 
      desc: 'Foco Prático',
      info: 'Simulações e passos "mão na massa" para aprender fazendo.'
    },
    { 
      id: LearningMode.TACTICAL, 
      label: 'Sincronia', 
      icon: 'grid', 
      desc: 'Dados Diretos',
      info: 'Informação pura e técnica para absorção rápida e eficiente.'
    }
  ];

  const activeSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];
  const filteredModules = APP_MODULES.filter(m => activeSector.types.includes(m.id));

  return (
    <div className="flex-1 flex flex-col bg-[#020617] h-full relative">
      <div className="scanline opacity-10"></div>
      
      {/* Header & Protocol Selection */}
      <div className="px-8 pt-12 pb-6 z-20 bg-gradient-to-b from-slate-900/50 to-transparent">
        <header className="flex justify-between items-start mb-10">
           <div>
              <span className="text-indigo-500 text-[8px] font-black uppercase tracking-[0.4em] mb-1 block">Protocolo de Especialização</span>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Nexus de<br/>Estudo</h1>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-2xl">
              <Icon name="grid" size={20} />
           </div>
        </header>

        {/* Cognitive Selector - O que faz e por que fazer */}
        <div className="space-y-4">
           <div className="flex gap-2 p-1.5 bg-slate-950/80 border border-slate-800 rounded-[2.2rem]">
              {learningModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => { Haptics.medium(); setActiveMode(mode.id); }}
                  className={`flex-1 py-4 rounded-[1.8rem] transition-all flex flex-col items-center gap-1.5 ${
                    activeMode === mode.id ? 'bg-slate-900 border border-slate-700 shadow-xl text-white' : 'text-slate-600 opacity-60'
                  }`}
                >
                  <Icon name={mode.icon} size={16} />
                  <span className="text-[7px] font-black uppercase tracking-widest">{mode.label}</span>
                </button>
              ))}
           </div>
           <div className="px-6 py-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-4 animate-reveal">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                 <Icon name="activity" size={14} />
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
                 <span className="text-indigo-400 block mb-0.5">{learningModes.find(m => m.id === activeMode)?.desc}</span>
                 {learningModes.find(m => m.id === activeMode)?.info}
              </p>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32">
        {/* Domain Selection */}
        <div className="px-8 mb-8">
           <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {sectors.map(s => (
                <button
                  key={s.id}
                  onClick={() => { Haptics.light(); setSelectedSectorId(s.id); }}
                  className={`flex-shrink-0 px-8 py-5 rounded-[2rem] border transition-all flex flex-col gap-3 min-w-[140px] ${
                    selectedSectorId === s.id ? 'bg-indigo-600 border-indigo-400 text-white shadow-2xl' : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <Icon name={s.icon} size={20} className={selectedSectorId === s.id ? 'text-white' : s.color} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{s.title}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Modules List */}
        <div className="px-8 space-y-4">
           <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2 ml-2">Vetores de Especialização</h3>
           {filteredModules.map((module, idx) => {
             const isCompleted = progress.completedLessons.some(id => id.startsWith(module.id.toLowerCase().slice(0,3)));
             return (
               <button
                 key={module.id}
                 onClick={() => { Haptics.medium(); onSelectModule(module, activeMode); }}
                 className="w-full group p-6 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] flex items-center gap-6 text-left active:scale-[0.98] transition-all hover:border-indigo-500/30"
               >
                 <div className={`w-14 h-14 rounded-2xl bg-slate-950 border-2 flex items-center justify-center transition-all ${
                   isCompleted ? 'border-emerald-500/30 text-emerald-500' : 'border-slate-800 text-slate-700'
                 }`}>
                   <Icon name={module.icon} size={24} />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h4 className="text-base font-black text-white uppercase tracking-tight truncate">{module.title}</h4>
                    <div className="flex items-center gap-2">
                       <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{module.description.split(' ')[0]} Hub</span>
                       <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                       <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest">IA: Activa</span>
                    </div>
                 </div>
                 <Icon name="chevronLeft" size={14} className="rotate-180 text-slate-800" />
               </button>
             );
           })}
        </div>
      </div>
    </div>
  );
};

export default LearnScreen;
