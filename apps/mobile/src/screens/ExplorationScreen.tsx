
import React, { useState, useEffect } from 'react';
import { Icon, Haptics } from '@nkelo/ui';
import { AIService } from '../services/aiService';
import { User } from '../types';

const ExplorationScreen: React.FC<{ user: User, onBack: () => void }> = ({ user, onBack }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; links: any[]; rewarded: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, (err) => console.log("Geo bloqueada"), { enableHighAccuracy: true });
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setResult(null);
    Haptics.medium();
    
    try {
      const data = await AIService.exploreLocation(query, user.id, userLoc?.lat, userLoc?.lng);
      setResult(data);
      if (data.rewarded) {
        Haptics.reward(); // Feedback de sucesso e XP ganho
      } else {
        Haptics.success();
      }
    } catch (e) {
      console.error(e);
      alert("Falha na sincronização com a rede AngoSat.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] h-full overflow-hidden">
      <div className="px-8 pt-16 pb-8 bg-slate-900/50 backdrop-blur-xl border-b border-white/5">
        <header className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-slate-800 rounded-xl text-slate-400 bouncy-btn"><Icon name="chevronLeft" size={20}/></button>
          <div className="text-center">
             <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.3em]">Radar de Reconhecimento</span>
             <h1 className="text-xs font-black text-white uppercase tracking-widest mt-1">Explorador de Angola</h1>
          </div>
          <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400 border border-cyan-500/20">
             <Icon name="globe" size={20} className={loading ? "animate-spin" : "animate-pulse"} />
          </div>
        </header>

        <div className="relative group">
          <input 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
            placeholder="Ex: Fortaleza de São Miguel, Luanda"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-6 pr-16 py-5 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-cyan-500/50 transition-all shadow-inner"
          />
          <button 
            onClick={handleSearch}
            className="absolute right-2 top-2 bottom-2 px-4 bg-cyan-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest bouncy-btn shadow-lg"
          >
            Sinal
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8 pb-32 scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-40">
             <div className="w-16 h-16 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]"></div>
             <p className="text-[8px] font-black uppercase tracking-widest animate-pulse">Triangulando AngoSat-2...</p>
          </div>
        ) : result ? (
          <div className="animate-reveal space-y-6">
             {result.rewarded && (
               <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between animate-bounce">
                  <div className="flex items-center gap-3">
                    <Icon name="award" size={16} className="text-emerald-400" />
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Descoberta Premiada!</span>
                  </div>
                  <span className="text-[10px] font-black text-white">+10 XP</span>
               </div>
             )}
             
             <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                <p className="text-slate-200 text-base leading-[1.8] font-medium mb-8">
                   {result.text}
                </p>
                
                {result.links.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h4 className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                       <Icon name="activity" size={10} /> Coordenadas e Fontes Factuais
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {result.links.map((link, i) => (
                        <a key={i} href={link.uri} target="_blank" rel="noopener noreferrer" 
                          className="flex items-center justify-between p-5 bg-slate-950/50 rounded-2xl border border-cyan-500/20 text-cyan-400 group active:scale-95 transition-all hover:bg-cyan-500/5"
                        >
                           <div className="flex items-center gap-3 truncate">
                              <Icon name={link.type === 'map' ? 'globe' : 'rocket'} size={14} className="opacity-60" />
                              <span className="text-[10px] font-black uppercase tracking-widest truncate pr-4">{link.title}</span>
                           </div>
                           <Icon name="chevronLeft" size={12} className="shrink-0 rotate-180" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-20 opacity-10">
             <div className="w-32 h-32 border-4 border-dashed border-cyan-500 rounded-full flex items-center justify-center mb-8 animate-[spin_40s_linear_infinite]">
                <Icon name="globe" size={60} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center leading-relaxed">Aguardando coordenadas<br/>de busca operacional.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorationScreen;
