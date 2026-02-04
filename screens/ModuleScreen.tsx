
import React from 'react';
import { Module, Lesson } from '../types';
import Icon from '../components/Icon';
import { Haptics } from '../utils/haptics';

interface Props {
  module: Module;
  completedLessons: string[];
  onBack: () => void;
  onSelectLesson: (lesson: Lesson) => void;
}

const ModuleScreen: React.FC<Props> = ({ module, completedLessons, onBack, onSelectLesson }) => {
  const getDifficultyLabel = (idx: number) => {
    if (idx === 0) return { label: 'ASPIRANTE', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    if (idx === 1) return { label: 'TÉCNICO', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    return { label: 'ENGENHEIRO', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' };
  };

  const handleBack = () => {
    Haptics.light();
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] h-[100dvh] overflow-hidden">
      <div className="scanline opacity-10"></div>
      
      <div className={`relative pt-16 pb-12 px-8 border-b border-slate-800 overflow-hidden flex-shrink-0`}>
        <div className={`absolute -top-10 -right-10 w-64 h-64 opacity-20 blur-[100px] rounded-full ${module.color.replace('border-', 'bg-')}`}></div>
        
        <button onClick={handleBack} className="mb-8 p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500 transition-all bouncy-btn relative z-10 shadow-xl">
          <Icon name="chevronLeft" className="text-slate-400" size={20} />
        </button>

        <div className="relative z-10 flex items-center justify-between">
          <div className="max-w-[70%]">
            <div className="flex items-center gap-3 mb-2">
              <span className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor] ${module.color.replace('border-', 'bg-')}`}></span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Caminho Operacional</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-[0.9] break-words">{module.title}</h1>
          </div>
          <div className="w-20 h-20 rounded-[2.5rem] bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 shadow-2xl backdrop-blur-md">
            <Icon name={module.icon} size={36} />
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 py-10 overflow-y-auto scrollbar-hide pb-40">
        {module.lessons.length > 0 ? (
          <div className="relative">
            {/* Linha de Conexão Vertical */}
            <div className="absolute left-[30px] top-6 bottom-6 w-1 bg-slate-900 rounded-full z-0">
               <div 
                 className="absolute top-0 left-0 w-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                 style={{ height: `${(completedLessons.length / module.lessons.length) * 100}%` }}
               ></div>
            </div>

            <div className="space-y-10 relative z-10">
              {module.lessons.map((lesson, idx) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isNext = idx === completedLessons.length;
                const isLocked = idx > completedLessons.length;
                const diff = getDifficultyLabel(idx);
                
                return (
                  <button
                    key={lesson.id}
                    disabled={isLocked}
                    onClick={() => { Haptics.medium(); onSelectLesson(lesson); }}
                    className={`w-full group flex items-start gap-6 transition-all duration-500 text-left ${isLocked ? 'opacity-30' : 'opacity-100 active:scale-[0.98]'}`}
                  >
                    {/* Indicador de Status Circular */}
                    <div className="relative flex-shrink-0 mt-2">
                       <div className={`w-14 h-14 rounded-3xl border-2 flex items-center justify-center transition-all duration-500 shadow-lg ${
                         isCompleted ? 'bg-emerald-500 border-emerald-400 text-slate-950 scale-100' : 
                         isNext ? 'bg-indigo-600 border-indigo-400 text-white animate-pulse scale-110 shadow-indigo-500/30' : 
                         'bg-slate-950 border-slate-800 text-slate-700'
                       }`}>
                         {isCompleted ? <Icon name="check" size={24} /> : <span className="font-black font-mono text-lg">{idx + 1}</span>}
                       </div>
                       {isNext && (
                         <div className="absolute -inset-2 border border-indigo-500/20 rounded-[2rem] animate-ping-slow"></div>
                       )}
                    </div>

                    <div className={`flex-1 p-6 rounded-[2.5rem] border transition-all duration-300 ${
                      isCompleted ? 'bg-emerald-500/5 border-emerald-500/10' : 
                      isNext ? 'bg-slate-900 border-slate-800 shadow-xl' : 
                      'bg-slate-950 border-slate-800'
                    }`}>
                      <div className="flex justify-between items-center mb-3">
                         <div className={`px-2 py-0.5 rounded-lg border text-[7px] font-black tracking-widest ${diff.color}`}>
                            {diff.label}
                         </div>
                         {isLocked && <Icon name="shield" size={12} className="text-slate-700" />}
                      </div>
                      <h3 className={`font-black text-lg uppercase tracking-tight leading-tight mb-2 ${isLocked ? 'text-slate-600' : 'text-white'}`}>
                        {lesson.title}
                      </h3>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
                        {isLocked ? 'ACESSO RESTRITO - COMPLETE NÍVEIS ANTERIORES' : (lesson.description || 'Dossier disponível para análise.')}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-32 opacity-20">
            <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-800">
               <Icon name="rocket" size={48} className="animate-float" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">Protocolos em Sincronia<br/>Aguarde o Comando.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleScreen;
