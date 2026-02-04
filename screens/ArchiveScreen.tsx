
import React, { useState } from 'react';
import { UserProgress } from '../types';
import Icon from '../components/Icon';
import { Haptics } from '../utils/haptics';

interface Props {
  onBack: () => void;
}

interface Dossier {
  id: string;
  title: string;
  category: string;
  locked: boolean;
  icon: string;
  summary: string;
  fullContent: string;
}

const ArchiveScreen: React.FC<Props> = ({ onBack }) => {
  const [isReading, setIsReading] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);

  const dossiers: Dossier[] = [
    { 
      id: 'd1', 
      title: 'A Lei de Angola (CRA)', 
      category: 'Cidadania', 
      locked: false, 
      icon: 'shield', 
      summary: 'Descobre os teus direitos e como funciona o nosso país.',
      fullContent: `CONSTITUIÇÃO DA REPÚBLICA DE ANGOLA\n\nEste documento explica que Angola é uma República livre e que todos os angolanos têm o direito de aprender, crescer e viver em paz.`
    },
    { 
      id: 'd2', 
      title: 'Dr. Agostinho Neto', 
      category: 'Heróis', 
      locked: false, 
      icon: 'award', 
      summary: 'A história do homem que fundou a nossa nação.',
      fullContent: `BIOGRAFIA DO FUNDADOR\n\nAntónio Agostinho Neto foi médico, poeta e o primeiro Presidente de Angola. Ele ensinou-nos que "o mais importante é resolver os problemas do povo".`
    },
    { 
      id: 'd3', 
      title: 'O Nosso Satélite', 
      category: 'Tecnologia', 
      locked: false, 
      icon: 'rocket', 
      summary: 'Como o AngoSat-2 leva internet a todo o país.',
      fullContent: `ANGOSAT-2: TECNOLOGIA NO ESPAÇO\n\nO nosso satélite está a milhas de distância da Terra e ajuda-nos a ter sinal de TV e Internet mesmo nas vilas mais distantes.`
    },
  ];

  const handleStartReading = (doc: Dossier) => {
    Haptics.medium();
    setSelectedDossier(doc);
    setIsReading(true);
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-10 bg-[#020617] text-slate-300 relative flex flex-col min-h-full pb-32">
      <header className="mb-8 animate-reveal flex items-start justify-between">
        <div>
          <h2 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
             <Icon name="bookOpen" size={12} /> Biblioteca Digital
          </h2>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">Dossiers</h1>
        </div>
        <button onClick={() => { Haptics.light(); onBack(); }} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-500">
           <Icon name="chevronLeft" size={20} />
        </button>
      </header>

      <div className="space-y-4">
        {dossiers.map((doc, idx) => (
          <button 
            key={doc.id} 
            onClick={() => handleStartReading(doc)}
            className="w-full p-6 rounded-[2.5rem] bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 transition-all flex flex-col gap-4 text-left animate-reveal active:scale-[0.97]"
            style={{ animationDelay: `${0.2 + (idx * 0.1)}s` }}
          >
              <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                      <Icon name={doc.icon} size={20} />
                  </div>
                  <div className="flex-1">
                      <h4 className="font-black text-xs text-white uppercase tracking-tight mb-0.5">{doc.title}</h4>
                      <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{doc.category}</span>
                  </div>
                  <Icon name="chevronLeft" size={14} className="rotate-180 text-slate-700" />
              </div>
          </button>
        ))}
      </div>

      {isReading && selectedDossier && (
        <div className="fixed inset-0 z-[100] flex items-end p-4 bg-black/95 backdrop-blur-xl">
           <div className="w-full bg-slate-950 rounded-[3rem] border border-slate-800 animate-reveal max-h-[85dvh] flex flex-col max-w-lg mx-auto overflow-hidden">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                 <h4 className="font-black text-white text-[11px] uppercase tracking-widest">{selectedDossier.title}</h4>
                 <button onClick={() => setIsReading(false)} className="text-slate-500 p-2"><Icon name="plus" size={24} className="rotate-45" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-6">
                 <p className="text-slate-300 text-lg leading-relaxed font-medium">
                    {selectedDossier.fullContent}
                 </p>
                 <button onClick={() => setIsReading(false)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] bouncy-btn shadow-lg">Finalizar Leitura</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveScreen;
