
import React, { useState, useMemo, useEffect } from 'react';
import { Module, UserProgress, ModuleType, User, UserRole, LearningMode } from '../types';
import { APP_MODULES } from '../data/mockData';
import Icon from '../components/Icon';
import { Haptics } from '../utils/haptics';
import { AIService } from '../services/aiService';

interface Props {
  onSelectModule: (module: Module, mode: LearningMode) => void;
  progress: UserProgress;
  user: User;
}

const LearnScreen: React.FC<Props> = ({ onSelectModule, progress, user }) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('stem');
  const [activeMode, setActiveMode] = useState<LearningMode>(LearningMode.TACTICAL);
  const [searchQuery, setSearchQuery] = useState('');

  const learningModes = [
    { id: LearningMode.STORYTELLING, label: 'História', icon: 'bookOpen', desc: 'Narrativa épica', color: 'text-amber-500', activeBg: 'bg-amber-500/10' },
    { id: LearningMode.PRACTICE, label: 'Prática', icon: 'zap', desc: 'Simulador Ativo', color: 'text-emerald-500', activeBg: 'bg-emerald-500/10' },
    { id: LearningMode.TACTICAL, label: 'Tático', icon: 'grid', desc: 'Direto ao Ponto', color: 'text-indigo-500', activeBg: 'bg-indigo-500/10' }
  ];

  const sectors = useMemo(() => [
    { id: 'stem', title: 'Ciência & Lógica', types: [ModuleType.MATHEMATICS, ModuleType.PHYSICS, ModuleType.ROBOTICS, ModuleType.CODING, ModuleType.LOGIC], icon: 'zap', color: 'text-rose-400' },
    { id: 'society', title: 'Identidade', types: [ModuleType.CIVICS, ModuleType.HISTORY, ModuleType.GEOGRAPHY, ModuleType.GEOPOLITICS, ModuleType.ECONOMY], icon: 'globe', color: 'text-indigo-400' },
    { id: 'terra', title: 'Recursos', types: [ModuleType.AGRICULTURE, ModuleType.BIOLOGY, ModuleType.ECOLOGY], icon: 'activity', color: 'text-emerald-400' }
  ], []);

  const activeSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];
  const filteredModules = useMemo(() => {
    return APP_MODULES.filter(m => activeSector.types.includes(m.id) && m.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeSector, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#020617] relative overflow-hidden">
      <div className="scanline opacity-10"></div>
      
      <div className="px-8 pt-12 pb-6 bg-gradient-to-b from-[#0f172a] to-transparent z-30">
        <header className="mb-8">
          <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.4em]">Protocolos Pedagógicos</span>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mt-1">Biblioteca Core</h1>
        </header>

        {/* Seletor de Modo de Aprendizagem Premium */}
        <div className="flex gap-2 mb-8 bg-slate-950/80 p-1.5 rounded-[2rem] border border-slate-800">
          {learningModes.map(mode => (
            <button
              key={mode.id}
              onClick={() => { Haptics.medium(); setActiveMode(mode.id); }}
              className={`flex-1 py-4 rounded-2xl transition-all flex flex-col items-center gap-2 ${activeMode === mode.id ? 'bg-slate-900 border border-slate-700 shadow-xl' : 'opacity-40 hover:opacity-60'}`}
            >
              <Icon name={mode.icon} size={18} className={activeMode === mode.id ? mode.color : 'text-slate-600'} />
              <span className={`text-[7px] font-black uppercase tracking-widest ${activeMode === mode.id ? 'text-white' : 'text-slate-700'}`}>{mode.label}</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <input 
            type="text" 
            placeholder="PESQUISAR MÓDULO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
          />
        </div>
      </div>

      {/* Categorias */}
      <div className="flex gap-4 overflow-x-auto px-8 pb-8 scrollbar-hide">
        {sectors.map((s) => (
          <button
            key={s.id}
            onClick={() => { Haptics.light(); setSelectedSectorId(s.id); }}
            className={`flex-shrink-0 px-6 py-5 rounded-[2rem] border transition-all flex flex-col gap-3 min-w-[140px] ${selectedSectorId === s.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
          >
            <Icon name={s.icon} size={20} className={selectedSectorId === s.id ? 'text-white' : s.color} />
            <span className="text-[9px] font-black uppercase tracking-widest text-left">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Lista de Módulos */}
      <div className="flex-1 overflow-y-auto px-8 scrollbar-hide pb-40">
        <div className="grid grid-cols-1 gap-4">
          {filteredModules.map((module) => (
            <button
              key={module.id}
              onClick={() => { Haptics.medium(); onSelectModule(module, activeMode); }}
              className="group p-6 rounded-[2.5rem] bg-slate-900/30 border border-slate-800/50 transition-all flex flex-col gap-4 text-left hover:border-indigo-500/50 relative overflow-hidden"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                  <Icon name={module.icon} size={24} />
                </div>
                <div className="flex-1">
                   <h4 className="text-lg font-black text-white uppercase tracking-tight mb-1">{module.title}</h4>
                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest line-clamp-1">{module.description}</p>
                </div>
                <Icon name="chevronLeft" size={14} className="rotate-180 text-slate-700" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/30">
                 <div className="flex gap-2">
                    {module.lessons.map((_, i) => (
                      <div key={i} className="w-6 h-1 rounded-full bg-slate-800"></div>
                    ))}
                 </div>
                 <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest">Modo {activeMode} Ativo</span>
              </div>
            </button>
          ))}
          
          {filteredModules.length === 0 && (
            <div className="py-20 text-center opacity-20">
              <Icon name="rocket" size={48} className="mx-auto mb-4" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em]">Nenhum ficheiro encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnScreen;
