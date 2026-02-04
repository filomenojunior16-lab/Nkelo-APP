
import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [displayContent, setDisplayContent] = useState(lesson.content);
  const [isTransmuting, setIsTransmuting] = useState(true);
  const [simStep, setSimStep] = useState(0);
  const [simComplete, setSimComplete] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Simulação baseada no título (Funcionalidade de Demonstração Interativa)
  const simulation = useMemo(() => {
    if (lesson.title.includes('AngoSat')) return {
      title: 'Simulação de Órbita',
      steps: ['Calibrar Propulsão', 'Alinhar Transponder', 'Sincronizar Sinal'],
      desc: 'Precisas de posicionar o satélite sobre Luanda.'
    };
    if (lesson.title.includes('Njinga')) return {
      title: 'Protocolo Diplomático',
      steps: ['Analisar Postura', 'Definir Aliado', 'Negociar Tratado'],
      desc: 'Decide como abordar o Governador sem ceder soberania.'
    };
    return {
      title: 'Laboratório de Análise',
      steps: ['Observar Fenómeno', 'Formular Hipótese', 'Validar Dados'],
      desc: 'Aplica o método científico para extrair a verdade.'
    };
  }, [lesson]);

  useEffect(() => {
    const loadAdaptiveContent = async () => {
      setIsTransmuting(true);
      const content = await AIService.transmuteContent(lesson.content, learningMode, lesson.title);
      setDisplayContent(content);
      setIsTransmuting(false);
    };
    loadAdaptiveContent();
  }, [lesson, learningMode]);
  
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const totalScrollable = scrollHeight - clientHeight;
    const progress = totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 100;
    setReadProgress(progress);
  };

  const handleNextSimStep = () => {
    Haptics.medium();
    if (simStep < simulation.steps.length - 1) {
      setSimStep(s => s + 1);
    } else {
      setSimComplete(true);
      setReadProgress(100);
      Haptics.success();
    }
  };

  const isStory = learningMode === LearningMode.STORYTELLING;
  const isPractice = learningMode === LearningMode.PRACTICE;

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-700 ${isStory ? 'bg-[#1a140a]' : isPractice ? 'bg-[#061a14]' : 'bg-[#020617]'} text-slate-300`}>
      {/* Header com Barra de Sincronia */}
      <div className={`h-[28vh] min-h-[180px] relative border-b ${isStory ? 'border-amber-900/30' : isPractice ? 'border-emerald-900/30' : 'border-slate-800'}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-black/40 z-50">
           <div className={`h-full transition-all duration-300 ${isStory ? 'bg-amber-500' : isPractice ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${readProgress}%` }}></div>
        </div>

        <button onClick={onBack} className="absolute top-8 left-6 z-50 p-3 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-xl">
          <Icon name="chevronLeft" size={20} className="text-white" />
        </button>

        <div className="h-full flex flex-col items-center justify-center p-8">
           <div className="animate-reveal flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isStory ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : isPractice ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500'}`}>
                <Icon name={isStory ? 'bookOpen' : isPractice ? 'zap' : 'grid'} size={28} />
              </div>
              <span className={`text-[7px] font-black uppercase tracking-[0.5em] ${isStory ? 'text-amber-500' : isPractice ? 'text-emerald-500' : 'text-slate-500'}`}>{learningMode} CORE ACTIVE</span>
           </div>
        </div>
        
        <div className="absolute bottom-6 left-8 right-8">
          <h1 className={`text-2xl font-black tracking-tighter uppercase leading-tight ${isStory ? 'text-amber-50' : isPractice ? 'text-emerald-50' : 'text-white'}`}>{lesson.title}</h1>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-8 py-10 space-y-10 scrollbar-hide pb-40"
      >
        {isTransmuting ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-30">
             <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
             <p className="text-[8px] font-black uppercase tracking-widest">A Sincronizar Ficheiros...</p>
          </div>
        ) : (
          <div className="animate-reveal space-y-12">
            <div className={`text-lg leading-[1.8] font-medium border-l-2 transition-all duration-700 ${isStory ? 'font-serif italic text-amber-100/80 border-amber-900/50 pl-8' : isPractice ? 'font-mono text-emerald-100/80 border-emerald-900/50 pl-8' : 'text-slate-300 border-indigo-900/50 pl-8'}`}>
              {displayContent}
            </div>

            {isPractice && (
              <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[3rem] animate-reveal delay-1 relative overflow-hidden">
                 <div className="absolute -top-10 -right-10 opacity-5"><Icon name="zap" size={120} /></div>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950">
                       <Icon name="zap" size={16} />
                    </div>
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{simulation.title}</h4>
                 </div>
                 
                 <div className="space-y-6">
                    <p className="text-sm font-bold text-emerald-100/70 leading-relaxed uppercase tracking-tight">{simulation.desc}</p>
                    
                    <div className="bg-slate-950/80 border border-emerald-500/10 rounded-2xl p-6 space-y-4">
                       {simulation.steps.map((step, i) => (
                         <div key={i} className={`flex items-center gap-4 transition-all ${i > simStep ? 'opacity-20' : 'opacity-100'}`}>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${i < simStep ? 'bg-emerald-500 text-slate-950' : i === simStep ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-900 text-slate-600'}`}>
                               {i < simStep ? <Icon name="check" size={12} /> : i + 1}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{step}</span>
                         </div>
                       ))}
                    </div>

                    {!simComplete ? (
                      <button 
                        onClick={handleNextSimStep}
                        className="w-full py-5 bg-emerald-600 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-emerald-900/20 active:scale-95 transition-transform"
                      >
                         Executar Comando {simStep + 1}
                      </button>
                    ) : (
                      <div className="py-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center">
                         <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Simulação Validada ✓</span>
                      </div>
                    )}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="absolute bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 right-0 p-8 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent z-[80]">
        <button 
          onClick={onStartQuiz} 
          disabled={readProgress < 90 && !isTransmuting}
          className={`w-full py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-2xl transition-all bouncy-btn ${
            readProgress < 90
            ? 'bg-slate-800 text-slate-600 opacity-50 grayscale' 
            : 'bg-indigo-600 text-white shadow-indigo-600/30'
          }`}
        >
          {readProgress < 90 ? 'Analise o Dossier' : 'Iniciar Validação'}
        </button>
      </div>
    </div>
  );
};

export default LessonScreen;
