
import React, { useState, useEffect } from 'react';
import { User, UserProgress } from '../types';
import Icon from '../components/Icon';

interface Props {
  user: User;
  progress: UserProgress;
}

const ParentalScreen: React.FC<Props> = ({ user, progress }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [securityScore, setSecurityScore] = useState(0);
  const [showLogic, setShowLogic] = useState(false);
  const [focusMode, setFocusMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      setSecurityScore(94);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-10 bg-[#020617] text-slate-300">
      <header className="mb-10 animate-reveal">
        <div className="flex justify-between items-start mb-2">
           <h2 className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Icon name="check" size={12} /> Guardião NKELO • Compliance
           </h2>
           <button onClick={() => setShowLogic(!showLogic)} className="text-slate-600 hover:text-emerald-500">
              <Icon name="activity" size={16} />
           </button>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">Firewall de<br/>Governança</h1>

        {showLogic && (
          <div className="mt-6 p-5 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl animate-reveal">
             <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Como funciona a Governança?</h4>
             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
               Este painel permite que o administrador (Pai/Tutor) configure os limites operacionais da IA, ative o Modo de Foco para exames e monitore a integridade dos dados aprendidos.
             </p>
          </div>
        )}
      </header>

      <div className="space-y-6 pb-32">
        <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] relative overflow-hidden group">
            {isScanning && <div className="scanline"></div>}
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Integridade de Dados</p>
                    <h3 className="text-4xl font-black text-white">{isScanning ? '---' : `${securityScore}%`}</h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isScanning ? 'bg-slate-800 animate-pulse' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-lg'}`}>
                    <Icon name={isScanning ? 'activity' : 'shield'} size={24} />
                </div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden relative z-10">
                <div className={`h-full transition-all duration-1000 ${isScanning ? 'w-0' : 'bg-emerald-500'}`} style={{width: isScanning ? '30%' : `${securityScore}%`}}></div>
            </div>
        </div>

        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
            Políticas de Sistema
            <div className="h-px flex-1 bg-slate-800"></div>
        </h3>

        <div className="space-y-3 animate-reveal">
           <button 
             onClick={() => setFocusMode(!focusMode)}
             className={`w-full p-6 rounded-3xl border transition-all flex items-center justify-between ${focusMode ? 'bg-indigo-600/10 border-indigo-500/40' : 'bg-slate-900/40 border-slate-800 opacity-60'}`}
           >
              <div className="flex items-center gap-4 text-left">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${focusMode ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-600'}`}>
                    <Icon name="zap" size={18} />
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-tight">Modo de Foco Ativo</h4>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Restringe acesso social durante missões</p>
                 </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${focusMode ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                 <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${focusMode ? 'right-1' : 'left-1'}`}></div>
              </div>
           </button>
        </div>
      </div>
    </div>
  );
};

export default ParentalScreen;
