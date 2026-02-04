
import React from 'react';
import { Module, UserProgress, User, ModuleType } from '../types';
import { APP_MODULES } from '../data/mockData';
import Icon from '../components/Icon';

interface Props {
  onSelectModule: (module: Module) => void;
  progress: UserProgress;
  user: User;
}

const HomeScreen: React.FC<Props> = ({ onSelectModule, progress, user }) => {
  const globalProgress = Math.round((progress.completedLessons.length / (APP_MODULES.length * 2)) * 100);

  // Categorização para um visual mais profissional
  const sectors = [
    { id: 'logic', title: 'Sistemas & Lógica', types: [ModuleType.LOGIC, ModuleType.MATHEMATICS, ModuleType.MAKER], icon: 'zap', color: 'text-cyan-500' },
    { id: 'society', title: 'Sociedade & Civismo', types: [ModuleType.CIVICS, ModuleType.GEOPOLITICS, ModuleType.ECONOMY], icon: 'globe', color: 'text-indigo-500' },
    { id: 'matter', title: 'Matéria & Natureza', types: [ModuleType.PHYSICS], icon: 'rocket', color: 'text-rose-500' },
    { id: 'comms', title: 'Linguagem & Comunicação', types: [ModuleType.PORTUGUESE], icon: 'book', color: 'text-emerald-500' }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 bg-[#020617] relative">
      <div className="scanline"></div>
      
      {/* Header Premium */}
      <header className="flex justify-between items-start mb-12 animate-reveal">
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[8px] font-black uppercase tracking-widest">Acesso Nível {user.level}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">Comando de<br/>Aprendizado</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Agente: {user.name.split(' ')[0]}</p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-800 flex flex-col items-center gap-1 shadow-2xl">
          <Icon name="award" className="text-cyan-500" size={20} />
          <span className="font-mono font-bold text-white text-sm">{progress.totalPoints}</span>
        </div>
      </header>

      {/* Radar de Aptidão / Progresso Global */}
      <div className="mb-12 p-6 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] animate-reveal delay-1 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon name="zap" size={100} />
        </div>
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacidade Operacional</h3>
            <p className="text-2xl font-black text-white">{globalProgress}%</p>
          </div>
          <div className="text-right">
             <p className="text-[8px] font-black text-cyan-500 uppercase tracking-widest">Sincronização Ativa</p>
          </div>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative z-10">
          <div className="h-full bg-gradient-to-r from-cyan-600 to-indigo-600 glow-cyan" style={{width: `${globalProgress}%`}}></div>
        </div>
      </div>

      {/* Setores de Missão */}
      <div className="space-y-10 pb-24">
        {sectors.map((sector, sIdx) => {
          const modulesInSector = APP_MODULES.filter(m => sector.types.includes(m.id));
          if (modulesInSector.length === 0) return null;

          return (
            <div key={sector.id} className={`animate-reveal delay-${sIdx + 2}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${sector.color}`}>
                  <Icon name={sector.icon} size={16} />
                </div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{sector.title}</h3>
                <div className="h-px flex-1 bg-slate-800/50"></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {modulesInSector.map((module) => {
                  const isDone = progress.completedLessons.some(id => id.startsWith(module.id.toLowerCase().slice(0,3)));
                  return (
                    <button
                      key={module.id}
                      onClick={() => onSelectModule(module)}
                      className={`group relative p-6 rounded-[2rem] bg-slate-900/30 border border-slate-800/60 transition-all duration-300 bouncy-btn flex items-center gap-6 text-left hover:bg-slate-900/60 hover:border-slate-700`}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center transition-all group-hover:scale-110 ${isDone ? 'text-emerald-500 border-emerald-500/30' : 'text-slate-500'}`}>
                        <Icon name={module.icon} size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-black text-white uppercase tracking-tight">{module.title}</h4>
                          {isDone && <Icon name="check" size={12} className="text-emerald-500" />}
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{module.description}</p>
                      </div>
                      <div className="text-right">
                        <Icon name="chevronLeft" size={16} className="text-slate-700 rotate-180" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeScreen;
