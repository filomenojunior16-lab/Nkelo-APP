
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
  const getDifficulty = (idx: number) => {
    if (idx === 0) return { label: 'ASPIRANTE', color: 'text-emerald-500', desc: 'Fundamentos de Base' };
    if (idx === 1) return { label: 'TÉCNICO', color: 'text-amber-500', desc: 'Sistemas Complexos' };
    return { label: 'ENGENHEIRO', color: 'text-rose-500', desc: 'Maestria do Kernel' };
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] h-full overflow-hidden">
      <div className="scanline opacity-10"></div>
      
      {/* Dossier Header */}
      <div className="px-8 pt-16 pb-12 bg-slate-900/40 border-b border-white/5 relative flex-shrink-0">
        <div className={`absolute -top-20 -right-20 w-64 h-64 opacity-20 blur-[120px] rounded-full ${module.color.replace('border-', 'bg-')}`}></div>
        
        <button onClick={onBack} className="mb-10 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-400 active:scale-90 transition-all relative z-10">
          <Icon name="chevronLeft" size={24} />
        </button>

        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 block">Dossier de Especialidade</span>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{module.title}</h1>
          </div>
          <div className="w-20 h-20 rounded-[2.5rem] bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 shadow-2xl">
            <Icon name={module.icon} size={32} />
          </div>
        </div>
      </div>

      {/* Lesson Roadmap */}
      <div className="flex-1 overflow-y-auto px-8 py-10 scrollbar-hide pb-40">
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Progressão de Competências</h3>
             <div className="h-px flex-1 bg-slate-800"></div>
          </div>

          {module.lessons.map((lesson, idx) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isLocked = idx > completedLessons.length;
            const diff = getDifficulty(idx);

            return (
              <button
                key={lesson.id}
                disabled={isLocked}
                onClick={() => { Haptics.medium(); onSelectLesson(lesson); }}
                className={`w-full group p-6 rounded-[2.8rem] border transition-all flex items-center gap-6 text-left relative overflow-hidden ${
                  isLocked ? 'bg-slate-950 border-slate-900 opacity-30' : 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/30'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-black text-sm shrink-0 ${
                  isCompleted ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20' : 
                  isLocked ? 'bg-slate-900 border-slate-800 text-slate-700' : 'bg-slate-950 border-slate-700 text-indigo-400'
                }`}>
                  {isCompleted ? <Icon name="check" size={20} /> : idx + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-black text-white uppercase tracking-tight truncate mb-1">{lesson.title}</h4>
                  <div className="flex items-center gap-3">
                     <span className={`text-[7px] font-black uppercase tracking-widest ${diff.color}`}>{diff.label}</span>
                     <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                     <span className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">{diff.desc}</span>
                  </div>
                </div>

                {!isLocked && <Icon name="chevronLeft" size={14} className="rotate-180 text-slate-800" />}
                {isLocked && <Icon name="shield" size={14} className="text-slate-800" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModuleScreen;
