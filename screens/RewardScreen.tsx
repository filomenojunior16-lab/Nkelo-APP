
import React, { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { Haptics } from '../utils/haptics';

interface Props {
  onContinue: () => void;
}

const RewardScreen: React.FC<Props> = ({ onContinue }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    Haptics.reward();
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFinish = () => {
    Haptics.medium();
    // Garante que o callback de continuação reseta o view para 'home'
    onContinue();
  };

  return (
    <div className="fixed inset-0 h-full w-full bg-[#020617] flex flex-col items-center justify-center px-10 z-[200] overflow-hidden">
      <div className="scanline"></div>
      
      {/* Background Glows */}
      <div className="absolute top-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full animate-pulse delay-700"></div>

      <div className={`transform transition-all duration-1000 ease-out text-center max-w-sm relative z-10 ${showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        <div className="w-48 h-48 bg-slate-900 rounded-[3rem] border border-indigo-500/30 flex items-center justify-center mx-auto mb-10 shadow-2xl relative">
          <div className="absolute inset-0 border border-indigo-500/20 rounded-[3rem] animate-ping opacity-20"></div>
          <Icon name="award" size={80} className="text-indigo-500" />
          <div className="absolute -top-4 -right-4 bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-xl text-[10px] font-black border-2 border-[#020617] shadow-xl">
            SINCRO +100
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Dossier<br/>Validado</h1>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-12 leading-relaxed">Os teus dados foram integrados com sucesso no Kernel Central da NKELO.OS.</p>

        <div className="space-y-4">
          <button
            onClick={handleFinish}
            className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] bouncy-btn shadow-2xl shadow-indigo-900/40 border-t border-white/10"
          >
            Regressar ao Comando
          </button>
          <div className="flex items-center justify-center gap-2 opacity-30">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.5em]">Protocolo de Retenção Ativo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardScreen;
