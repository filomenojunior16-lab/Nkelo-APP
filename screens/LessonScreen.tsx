
import React, { useState, useEffect, useRef } from 'react';
import { Lesson, LearningMode } from '../types';
import Icon from '../components/Icon';
import { AIService } from '../services/aiService';
import { Haptics } from '../utils/haptics';

interface Props {
  lesson: Lesson;
  moduleColor: string;
  learningMode: LearningMode;
  onBack: () => void;
  onStartQuiz: () => void;
}

const LessonScreen: React.FC<Props> = ({ lesson, moduleColor, learningMode, onBack, onStartQuiz }) => {
  const [content, setContent] = useState(lesson.content);
  const [isTransmuting, setIsTransmuting] = useState(true);
  const [error, setError] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadContent = async () => {
    setIsTransmuting(true);
    setError(false);
    try {
      const text = await AIService.transmuteContent(lesson.content, learningMode, lesson.title, lesson.id);
      setContent(text);
      Haptics.success();
    } catch (e) {
      setError(true);
    } finally {
      setIsTransmuting(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [lesson, learningMode]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] h-full overflow-hidden relative">
      <div className="scanline opacity-10"></div>
      
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900 z-[100]">
         <div className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_10px_#6366f1]" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <header className="px-8 pt-16 pb-8 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 flex-shrink-0">
        <div className="flex justify-between items-center mb-6">
           <button onClick={onBack} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 active:scale-90 transition-transform">
              <Icon name="chevronLeft" size={20} />
           </button>
           <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">IA: {learningMode}</span>
           </div>
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{lesson.title}</h1>
      </header>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-8 py-10 scrollbar-hide pb-48"
      >
        {isTransmuting ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6 opacity-30">
             <div className="w-14 h-14 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center">Sincronizando Heurística...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 space-y-6">
            <Icon name="shield" size={48} className="mx-auto text-rose-500 opacity-50" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Falha na Sincronia de IA</p>
            <button onClick={loadContent} className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-xl text-[8px] font-black text-white uppercase tracking-widest">Tentar Novamente</button>
          </div>
        ) : (
          <div className="animate-reveal space-y-10">
             <div className={`text-xl font-bold leading-relaxed border-l-4 pl-8 py-6 bg-indigo-500/5 rounded-r-[2.5rem] transition-all duration-700 ${
                learningMode === LearningMode.STORYTELLING ? 'font-serif italic text-amber-100/90 border-amber-600/30' :
                learningMode === LearningMode.PRACTICE ? 'font-mono text-emerald-100/90 border-emerald-600/30' :
                'text-slate-300 border-indigo-600/30'
             }`}>
                {content}
             </div>

             <div className="p-8 bg-slate-950 border border-slate-800 rounded-[3rem] space-y-4">
                <div className="flex items-center gap-3">
                   <Icon name="shield" size={14} className="text-indigo-500" />
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Briefing de Aprendizado</h4>
                </div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight leading-relaxed italic border-l border-slate-800 pl-4">
                   Este dossier foi processado via IA para optimizar a tua retenção cognitiva.
                </p>
             </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-8 right-8 z-[110]">
        <button 
          onClick={() => { Haptics.reward(); onStartQuiz(); }}
          className={`w-full py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl transition-all bouncy-btn border-t border-white/20 ${
            scrollProgress > 85 || learningMode === LearningMode.TACTICAL ? 'bg-indigo-600 text-white shadow-indigo-900/40' : 'bg-slate-800 text-slate-600 opacity-50 grayscale'
          }`}
          disabled={scrollProgress <= 85 && learningMode !== LearningMode.TACTICAL}
        >
          {scrollProgress > 85 || learningMode === LearningMode.TACTICAL ? 'Iniciar Validação' : 'Analisar Dossier...'}
        </button>
      </div>
    </div>
  );
};

export default LessonScreen;
