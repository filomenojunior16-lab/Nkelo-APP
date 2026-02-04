
import React from 'react';
import { UserProgress } from '../types';
import Icon from '../components/Icon';

interface Props {
  progress: UserProgress;
}

const StatsScreen: React.FC<Props> = ({ progress }) => {
  const leaderBoard = [
    { name: 'Eng. Manuel Castro', points: 4250, rank: 1, tag: 'Luanda' },
    { name: 'Dra. Isabel Neto', points: 3800, rank: 2, tag: 'Huambo' },
    { name: 'Eng. Afonso Lopes', points: 2980, rank: 3, tag: 'Benguela' },
    { name: 'Tu (Aspirante)', points: progress.totalPoints, rank: 4, isUser: true, tag: 'AO-Unit' },
    { name: 'Dr. Paulo Jorge', points: 2520, rank: 5, tag: 'Cabinda' },
  ];

  const categories = [
    { label: 'CRA (Lei)', value: 85, color: 'bg-emerald-500' },
    { label: 'Matemática', value: 64, color: 'bg-cyan-500' },
    { label: 'Infraestrutura', value: 42, color: 'bg-indigo-500' },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-10 bg-[#020617] text-slate-300">
      <header className="mb-12 animate-reveal">
        <h2 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
           <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_indigo]"></div> Relatório de Impacto Estratégico
        </h2>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">Métricas de<br/>Excelência</h1>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] relative overflow-hidden group hover:border-cyan-900/50 transition-colors animate-reveal delay-1">
          <div className="absolute -right-4 -top-4 opacity-[0.05] group-hover:scale-125 transition-transform">
             <Icon name="award" size={80} />
          </div>
          <span className="block text-3xl font-black text-white mb-1 tracking-tighter tabular-nums">{progress.totalPoints}</span>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Score de Soberania</span>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-[2rem] relative overflow-hidden group hover:border-emerald-900/50 transition-colors animate-reveal delay-2">
          <div className="absolute -right-4 -top-4 opacity-[0.05] group-hover:scale-125 transition-transform">
             <Icon name="check" size={80} />
          </div>
          <span className="block text-3xl font-black text-white mb-1 tracking-tighter tabular-nums">{progress.completedLessons.length}</span>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Dossiers Dominados</span>
        </div>
      </div>

      <div className="mb-12 space-y-6 animate-reveal delay-3">
         <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">Aptidões Técnicas</h3>
         <div className="space-y-4">
            {categories.map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.label}</span>
                  <span className="text-[10px] font-mono text-white">{cat.value}%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                  <div className={`h-full ${cat.color} transition-all duration-1000 delay-500`} style={{width: `${cat.value}%`}}></div>
                </div>
              </div>
            ))}
         </div>
      </div>

      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 animate-reveal delay-4">
        Quadro de Meritocracia Nacional
        <div className="h-px flex-1 bg-slate-800"></div>
      </h3>

      <div className="space-y-3 pb-32 animate-reveal delay-5">
        {leaderBoard.map((item, i) => (
          <div 
            key={i} 
            className={`flex items-center p-5 rounded-[2rem] border transition-all ${item.isUser ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900/20 border-slate-800'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs mr-5 ${item.rank <= 3 ? 'bg-indigo-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
              0{item.rank}
            </div>
            <div className="flex-1">
              <h4 className={`font-black text-sm uppercase tracking-tight ${item.isUser ? 'text-indigo-400' : 'text-slate-200'}`}>{item.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Sector: {item.tag}</span>
                 <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                 <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">Nível {6 - item.rank}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-black text-white text-sm tabular-nums tracking-tighter">{item.points}</span>
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">PTS</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsScreen;
