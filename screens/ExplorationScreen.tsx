
import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { AIService } from '../services/aiService';
import { Haptics } from '../utils/haptics';

const ExplorationScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; links: any[] } | null>(null);
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
    Haptics.medium();
    
    try {
      const data = await AIService.exploreLocation(query, userLoc?.lat, userLoc?.lng);
      setResult(data);
      Haptics.success();
    } catch (e) {
      alert("Erro na triangulação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] h-full overflow-hidden">
      <div className="px-8 pt-16 pb-8 bg-slate-900/50 backdrop-blur-xl border-b border-white/5">
        <header className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-3 bg-slate-800 rounded-xl text-slate-400"><Icon name="chevronLeft" size={20}/></button>
          <div className="text-center">
             <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.3em]">Radar de Reconhecimento</span>
             <h1 className="text-xs font-black text-white uppercase tracking-widest mt-1">Explorador Angola</h1>
          </div>
          <Icon name="globe" size={20} className="text-cyan-400 animate-pulse" />
        </header>

        <div className="relative group">
          <input 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
            placeholder="Ex: Serra da Leba ou Deserto do Namibe"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-6 pr-16 py-5 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-cyan-500/50 transition-all"
          />
          <button 
            onClick={handleSearch}
            className="absolute right-2 top-2 bottom-2 px-4 bg-cyan-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest bouncy-btn"
          >
            Sinal
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8 pb-32 scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-40">
             <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6"></div>
             <p className="text-[8px] font-black uppercase tracking-widest animate-pulse">Triangulando Satélites AngoSat...</p>
          </div>
        ) : result ? (
          <div className="animate-reveal space-y-6">
             <div className="p-8 bg-slate-900/30 border border-slate-800 rounded-[3rem] shadow-2xl">
                <p className="text-slate-200 text-base leading-[1.8] font-medium mb-8">
                   {result.text}
                </p>
                
                {result.links.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h4 className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                       <Icon name="globe" size={10} /> Fontes de Grounding Ativas
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {result.links.map((link, i) => (
                        <a key={i} href={link.uri} target="_blank" rel="noopener noreferrer" 
                          className="flex items-center justify-between p-5 bg-slate-950/50 rounded-2xl border border-cyan-500/20 text-cyan-400 group active:scale-95 transition-all"
                        >
                           <span className="text-[10px] font-black uppercase tracking-widest truncate pr-4">{link.title}</span>
                           <Icon name="globe" size={16} className="shrink-0 group-hover:scale-110" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
             </div>
             
             <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-3xl flex items-center gap-4">
                <Icon name="shield" size={20} className="text-cyan-500 opacity-50" />
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                  Dados validados via Google Maps Grounding. A precisão pode variar conforme a sincronização dos satélites.
                </p>
             </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-20 opacity-10">
             <div className="w-32 h-32 border-4 border-dashed border-cyan-500 rounded-full flex items-center justify-center mb-8 animate-[spin_20s_linear_infinite]">
                <Icon name="globe" size={60} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-center">Aguardando coordenadas<br/>de busca operacional.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorationScreen;
