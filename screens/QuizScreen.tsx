
import React, { useState, useEffect } from 'react';
import { Quiz, InteractionType, User } from '../types';
import Icon from '../components/Icon';
import { Haptics } from '../utils/haptics';

interface Props {
  quizzes: Quiz[];
  moduleColor: string;
  onComplete: (points: number) => void;
  onBack: () => void;
  onUpdateProgress: (points: number) => void;
  userPoints: number;
}

const QuizScreen: React.FC<Props> = ({ quizzes, onComplete, onBack, onUpdateProgress, userPoints }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintError, setHintError] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scrambleInput, setScrambleInput] = useState('');
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({});
  const [activeMatchingSide, setActiveMatchingSide] = useState<{ side: 'left' | 'right', value: string } | null>(null);

  const quiz = quizzes[currentIndex];
  if (!quiz) return null;

  const progressPercent = ((currentIndex) / quizzes.length) * 100;

  const handleRequestHint = () => {
    if (userPoints >= 10) {
      Haptics.medium();
      onUpdateProgress(userPoints - 10);
      setShowHint(true);
    } else {
      Haptics.error();
      setHintError(true);
      setTimeout(() => setHintError(false), 2000);
    }
  };

  const handleSubmit = () => {
    let correct = false;

    switch (quiz.interactionType) {
      case InteractionType.MULTIPLE_CHOICE:
        correct = quiz.options?.find(o => o.id === selectedId)?.isCorrect || false;
        break;
      case InteractionType.WORD_SCRAMBLE:
        correct = scrambleInput.toUpperCase().trim() === (quiz.correctAnswer as string).toUpperCase();
        break;
      case InteractionType.MATCHING:
        correct = quiz.matchingPairs?.every(p => matchingSelections[p.left] === p.right) || false;
        break;
    }

    setIsCorrect(correct);
    if (correct) {
      Haptics.success();
      setTotalScore(prev => prev + 25);
    } else {
      Haptics.error();
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    Haptics.medium();
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetStates();
    } else {
      onComplete(totalScore);
    }
  };

  const resetStates = () => {
    setSelectedId(null);
    setScrambleInput('');
    setMatchingSelections({});
    setActiveMatchingSide(null);
    setIsSubmitted(false);
    setShowHint(false);
    setIsCorrect(null);
  };

  const renderGameMechanic = () => {
    switch (quiz.interactionType) {
      case InteractionType.MULTIPLE_CHOICE:
        return (
          <div className="grid grid-cols-1 gap-4 animate-reveal">
            {quiz.options?.map((option, idx) => {
              const isSelected = selectedId === option.id;
              let cardStyle = "bg-slate-900/60 border-slate-800 text-slate-500";
              
              if (isSelected) {
                if (isSubmitted) {
                  cardStyle = option.isCorrect 
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
                    : "bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]";
                } else {
                  cardStyle = "bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/20 scale-[1.02]";
                }
              } else if (isSubmitted && option.isCorrect) {
                cardStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-500";
              }

              return (
                <button
                  key={option.id}
                  disabled={isSubmitted}
                  onClick={() => { Haptics.light(); setSelectedId(option.id); }}
                  className={`w-full p-5 rounded-[2.5rem] border transition-all flex items-center gap-5 text-left bouncy-btn ${cardStyle}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black font-mono text-sm shrink-0 transition-colors ${
                    isSelected ? (isSubmitted ? (option.isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white') : 'bg-white text-indigo-600') : 'bg-slate-950 text-slate-600 border border-slate-800'
                  }`}>
                     {String.fromCharCode(65+idx)}
                  </div>
                  <span className="text-[12px] font-black uppercase tracking-tight leading-tight flex-1">{option.text}</span>
                  {isSubmitted && option.isCorrect && <Icon name="check" size={16} className="text-emerald-500" />}
                </button>
              );
            })}
          </div>
        );

      case InteractionType.MATCHING:
        const pairs = quiz.matchingPairs || [];
        const leftItems = pairs.map(p => p.left);
        const rightItems = [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5);
        
        return (
          <div className="grid grid-cols-2 gap-4 animate-reveal">
            <div className="space-y-3">
              <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest block mb-2 px-2 text-center">Conceito</span>
              {leftItems.map(item => {
                const isSelected = activeMatchingSide?.value === item;
                const isMatched = !!matchingSelections[item];
                return (
                  <button
                    key={item}
                    disabled={isSubmitted || isMatched}
                    onClick={() => { Haptics.light(); setActiveMatchingSide({ side: 'left', value: item }); }}
                    className={`w-full p-5 rounded-3xl border text-[10px] font-black text-center transition-all min-h-[70px] flex items-center justify-center px-4 leading-tight ${
                      isSelected ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/20' : 
                      isMatched ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 
                      'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <div className="space-y-3">
              <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest block mb-2 px-2 text-center">Definição</span>
              {rightItems.map(item => {
                const isMatched = Object.values(matchingSelections).includes(item);
                return (
                  <button
                    key={item}
                    disabled={isSubmitted || !activeMatchingSide || activeMatchingSide.side !== 'left' || isMatched}
                    onClick={() => {
                      if (activeMatchingSide?.side === 'left') {
                        Haptics.medium();
                        setMatchingSelections(prev => ({ ...prev, [activeMatchingSide.value]: item }));
                        setActiveMatchingSide(null);
                      }
                    }}
                    className={`w-full p-5 rounded-3xl border text-[9px] font-black text-center transition-all min-h-[70px] flex items-center justify-center px-4 leading-tight ${
                      isMatched ? 'bg-indigo-600/10 border-indigo-600/10 text-indigo-400' : 
                      (!activeMatchingSide ? 'opacity-30 bg-slate-950 border-slate-900' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-indigo-500/40')
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case InteractionType.WORD_SCRAMBLE:
        return (
          <div className="space-y-6 animate-reveal">
             <div className="p-10 bg-slate-900/40 border border-slate-800 rounded-[3rem] text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em] mb-4">Descifrar Sequência:</p>
                <h3 className="text-4xl font-mono font-black text-white tracking-[0.3em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                   {quiz.correctAnswer?.toString().split('').sort(() => Math.random() - 0.5).join('')}
                </h3>
             </div>
             <input 
               type="text"
               autoFocus
               value={scrambleInput}
               disabled={isSubmitted}
               onChange={e => setScrambleInput(e.target.value.toUpperCase())}
               placeholder="INTRODUZIR CÓDIGO..."
               className={`w-full bg-slate-950 border rounded-[2rem] p-6 text-center text-xl font-black text-white tracking-[0.3em] outline-none transition-all shadow-2xl ${
                 isSubmitted ? (isCorrect ? 'border-emerald-500 shadow-emerald-500/10' : 'border-rose-500 shadow-rose-500/10') : 'border-slate-800 focus:border-indigo-600 focus:shadow-indigo-600/10'
               }`}
             />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden transition-colors duration-700 ${
      isSubmitted ? (isCorrect ? 'bg-emerald-950/20' : 'bg-rose-950/20') : 'bg-[#020617]'
    }`}>
      <div className="px-8 pt-10 pb-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 z-[80] relative">
        <div className="flex items-center justify-between mb-4">
           <button onClick={onBack} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 active:scale-90 transition-transform"><Icon name="chevronLeft" size={20} /></button>
           <div className="text-center">
              <span className="text-[7px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-1 block">{quiz.discipline}</span>
              <h1 className="text-[10px] font-black text-white uppercase tracking-[0.3em] opacity-80">Validação Operacional</h1>
           </div>
           <div className="bg-slate-950 px-3 py-2 rounded-2xl border border-slate-800 flex items-center gap-2 shadow-inner">
              <Icon name="award" size={14} className="text-amber-500" />
              <span className={`font-mono text-[11px] font-black ${hintError ? 'text-rose-500 animate-shake' : 'text-white'}`}>{userPoints}</span>
           </div>
        </div>
        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-indigo-500 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) shadow-[0_0_15px_rgba(99,102,241,0.6)]" style={{width: `${progressPercent}%`}}></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-10 scrollbar-hide pb-[300px]">
        <div className="mb-10 animate-reveal">
          <h2 className="text-2xl font-black text-white leading-[1.1] uppercase tracking-tighter mb-5">
            {quiz.question}
          </h2>
          <div className="p-5 bg-slate-900/30 border-l-4 border-indigo-600 rounded-r-3xl">
             <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic uppercase tracking-tight">
                {quiz.contextIntro}
             </p>
          </div>
        </div>

        {showHint && quiz.hint && (
           <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] animate-reveal flex gap-5 items-center shadow-xl">
              <div className="w-10 h-10 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                <Icon name="zap" size={20} />
              </div>
              <p className="text-[10px] text-amber-100 font-black uppercase tracking-widest leading-relaxed italic">{quiz.hint}</p>
           </div>
        )}

        {renderGameMechanic()}

        {isSubmitted && (
           <div className={`mt-10 p-8 rounded-[3rem] animate-reveal shadow-2xl border ${isCorrect ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-rose-900/20 border-rose-500/30'}`}>
              <div className="flex items-center gap-3 mb-4">
                 <Icon name={isCorrect ? "check" : "shield"} size={16} className={isCorrect ? "text-emerald-400" : "text-rose-400"} />
                 <h4 className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Nota do Mentor Nkelo</h4>
              </div>
              <p className="text-sm font-bold text-slate-300 leading-relaxed italic border-l-2 border-white/10 pl-5">
                 {quiz.explanation}
              </p>
           </div>
        )}
      </div>

      <div className="absolute bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-0 right-0 p-8 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent z-[90] flex flex-col gap-3">
        {!isSubmitted ? (
          <>
            <button 
              onClick={handleRequestHint} 
              disabled={showHint}
              className={`flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] py-4 rounded-2xl transition-all border ${
                showHint ? 'opacity-30 bg-slate-900 text-slate-600 border-transparent' : 'bg-slate-950 text-amber-500 border-slate-800 hover:border-amber-500/30'
              }`}
            >
              <Icon name="zap" size={14} />
              {showHint ? 'Dica Ativada' : 'Solicitar Apoio (-10 XP)'}
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={(!selectedId && !scrambleInput && Object.keys(matchingSelections).length === 0)}
              className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-2xl shadow-indigo-600/40 border-t border-white/20 bouncy-btn disabled:opacity-50 disabled:grayscale transition-all"
            >
              Sincronizar Resposta
            </button>
          </>
        ) : (
          <button 
            onClick={handleNext} 
            className={`w-full py-6 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] bouncy-btn shadow-2xl transition-all ${
              isCorrect ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-rose-600 shadow-rose-600/30'
            }`}
          >
             {currentIndex < quizzes.length - 1 ? 'Próxima Questão' : 'Finalizar Validação'}
          </button>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default QuizScreen;
