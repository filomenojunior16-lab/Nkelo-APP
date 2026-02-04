
import React, { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import Icon from '../components/Icon';
import { Haptics } from '../utils/haptics';

interface Props {
  progress: UserProgress;
}

const WorldcupScreen: React.FC<Props> = ({ progress }) => {
  const [timeLeft, setTimeLeft] = useState('23:54:12');
  const [isJoined, setIsJoined] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [blitzStep, setBlitzStep] = useState(0);
  const [blitzScore, setBlitzScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeLeft(`${23 - now.getHours()}:${59 - now.getMinutes()}:${59 - now.getSeconds()}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleJoin = () => {
    Haptics.reward();
    setIsJoined(true);
  };

  const startBlitz = () => {
    Haptics.medium();
    setBlitzStep(1);
    setShowGame(true);
    setBlitzScore(0);
  };

  const blitzQuestions = [
    { q: "O AngoSat-2 é um satélite de que tipo?", options: ["Meteorológico", "Comunicações", "Espionagem"], correct: 1 },
    { q: "Qual a capital da província da Huíla?", options: ["Lubango", "Menongue", "Kuito"], correct: 0 },
    { q: "Quantos artigos tem a CRA?", options: ["150", "244", "312"], correct: 1 }
  ];

  const handleBlitzAnswer = (idx: number) => {
    if (idx === blitzQuestions[blitzStep - 1].correct) {
      Haptics.success();
      setBlitzScore(s => s + 50);
    } else {
      Haptics.error();
    }
    
    if (blitzStep < blitzQuestions.length) {
      setBlitzStep(s => s + 1);
    } else {
      setBlitzStep(99); // Finalizado
    }
  };

  const topPlayers = [
    { name: 'Dr. Agostinho', score: 9850, province: 'Luanda', active: true },
    { name: 'Eng. Manuel', score: 9420, province: 'Benguela', active: true },
    { name: 'Isabel N.', score: 8900, province: 'Huambo', active: false },
    { name: 'Afonso L.', score: 7200, province: 'Namibe', active: true },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 bg-[#020617] relative flex flex-col min-h-full pb-32 scrollbar-hide">
      <div className="scanline opacity-10"></div>
      
      <header className="mb-8 animate-reveal">
        <h2 className="text-rose-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
           <Icon name="award" size={12} /> Competição Nacional
        </h2>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">Grande Arena<br/>de Heróis</h1>
      </header>

      {!showGame ? (
        <>
          <div className="mb-8 p-6 bg-gradient-to-br from-rose-600/20 to-indigo-600/10 border border-rose-500/20 rounded-[2.5rem] flex items-start gap-5 animate-reveal delay-1 relative overflow-hidden">
             <div className="absolute top-[-20%] right-[-10%] opacity-10"><Icon name="zap" size={120} /></div>
             <div className="w-12 h-12 bg-rose-600 rounded-2xl flex flex-shrink-0 items-center justify-center text-white shadow-lg relative z-10">
                <Icon name="zap" size={24} />
             </div>
             <div className="relative z-10">
                <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1">Blitz Semanal</h4>
                <p className="text-[9px] text-rose-100/60 font-bold uppercase tracking-widest leading-relaxed">
                   Província em destaque: <span className="text-white">MALANJE</span>. Responde rápido para subir no ranking nacional.
                </p>
             </div>
          </div>

          <div className="mb-10 p-10 bg-slate-900/40 border border-slate-800 rounded-[3rem] text-center animate-reveal delay-2 relative">
             <div className="absolute inset-0 bg-rose-500/5 blur-3xl rounded-full"></div>
             <div className="relative z-10">
                <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4">A Próxima Época Termina em:</h4>
                <div className="text-4xl font-mono font-black text-white tracking-[0.2em] mb-10 tabular-nums">{timeLeft}</div>
                
                {!isJoined ? (
                  <button onClick={handleJoin} className="w-full py-6 bg-rose-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl shadow-rose-900/30 border-t border-white/20 bouncy-btn">Garantir Inscrição</button>
                ) : (
                  <div className="space-y-4">
                     <div className="py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2">
                           <Icon name="check" size={14} /> Atleta Sincronizado
                        </span>
                     </div>
                     <button onClick={startBlitz} className="w-full py-6 bg-rose-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] bouncy-btn shadow-xl shadow-rose-900/40">Entrar na Partida</button>
                  </div>
                )}
             </div>
          </div>

          <div className="animate-reveal delay-3">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Elite de Operadores</h3>
                <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest px-2 py-0.5 bg-rose-500/10 rounded-lg">LIVE</span>
             </div>

             <div className="space-y-3">
                {topPlayers.map((p, i) => (
                  <div key={i} className={`flex items-center p-5 bg-slate-900/20 border border-slate-800 rounded-[2rem] transition-all hover:border-rose-500/40 ${p.active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm mr-5 ${i === 0 ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-950 text-slate-500'}`}>
                        {i === 0 ? <Icon name="award" size={24} /> : i + 1}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <h5 className="text-[11px] font-black text-white uppercase tracking-widest">{p.name}</h5>
                           {p.active && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>}
                        </div>
                        <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-1">{p.province} • Nível {9-i}</p>
                     </div>
                     <div className="text-right">
                        <span className="block text-sm font-black text-rose-500 tracking-tighter tabular-nums">{p.score}</span>
                        <span className="text-[7px] font-black text-slate-700 uppercase tracking-tighter">Ranking Points</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-12 animate-reveal">
           {blitzStep === 99 ? (
             <div className="text-center animate-scale">
               <div className="w-24 h-24 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center text-slate-950 shadow-xl mb-6">
                  <Icon name="award" size={48} />
               </div>
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Missão Concluída</h3>
               <p className="text-emerald-500 font-black text-xl mb-8">+{blitzScore} XP PARA A ARENA</p>
               <button onClick={() => setShowGame(false)} className="px-10 py-5 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10">Voltar ao Hall</button>
             </div>
           ) : (
             <div className="w-full space-y-8">
               <div className="text-center">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.5em]">Questão {blitzStep}/3</span>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter mt-2">{blitzQuestions[blitzStep-1].q}</h3>
               </div>
               
               <div className="grid gap-3 w-full">
                  {blitzQuestions[blitzStep-1].options.map((opt, i) => (
                    <button 
                      key={i}
                      onClick={() => handleBlitzAnswer(i)}
                      className="w-full p-6 bg-slate-900 border border-slate-800 rounded-[2rem] text-white font-black uppercase text-[10px] tracking-widest hover:border-rose-500 transition-all active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default WorldcupScreen;
