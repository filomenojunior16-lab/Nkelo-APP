
import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { AIService } from '../services/aiService';
import { Haptics } from '../utils/haptics';
import { DIGITAL_LIBRARY, DigitalBook } from '../data/mockData';

interface Props {
  onBack: () => void;
}

const DAILY_TIPS = [
  { 
    title: "Direito à Educação", 
    text: "Pelo Artigo 79.º da CRA, o Estado garante que todos possam estudar. Estudar não é só um dever, é o teu superpoder para mudar Angola.", 
    icon: "award",
    legalRef: "Artigo 79.º (Educação)"
  },
  { 
    title: "Preservação da Nação", 
    text: "Cuidar dos monumentos e da nossa história é proteger a memória dos nossos antepassados. O futuro começa no respeito ao passado.", 
    icon: "shield",
    legalRef: "Artigo 81.º (Património)"
  },
  { 
    title: "Soberania Digital", 
    text: "Ao usares o Nkelo, estás a treinar a tua mente para a independência tecnológica. Um país inteligente é um país livre.", 
    icon: "zap",
    legalRef: "Protocolo SSS"
  }
];

const ArchiveScreen: React.FC<Props> = ({ onBack }) => {
  const [selectedBook, setSelectedBook] = useState<DigitalBook | null>(null);
  const [readMode, setReadMode] = useState<'summary' | 'full'>('summary');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [ghostStatus, setGhostStatus] = useState<'visible' | 'fading'>('visible');

  // Ghost Transition Logic: Transição suave entre dicas do dia
  useEffect(() => {
    const interval = setInterval(() => {
      setGhostStatus('fading');
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % DAILY_TIPS.length);
        setGhostStatus('visible');
      }, 800);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAskAI = async (text: string) => {
    setIsAnalyzing(true);
    setAiExplanation(null);
    Haptics.medium();
    const prompt = `Atua como Mentor Nkelo, o cientista pedagogo. Analisa este trecho ${selectedBook?.isLegal ? 'da Constituição (CRA)' : 'técnico'} e explica como ele impacta o dia-a-dia de uma criança angolana, usando exemplos práticos e inspiradores: ${text}`;
    const result = await AIService.askComplexQuestion(prompt);
    setAiExplanation(result);
    setIsAnalyzing(false);
    Haptics.success();
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-12 bg-[#020617] relative pb-40 scrollbar-hide">
      <div className="scanline opacity-10"></div>
      
      <header className="mb-10 flex items-center justify-between animate-reveal">
        <div>
          <span className="text-indigo-500 text-[8px] font-black uppercase tracking-[0.4em] mb-1 block">Data Center SSS / Arquivos</span>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">Biblioteca</h1>
        </div>
        <button onClick={onBack} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all bouncy-btn">
           <Icon name="chevronLeft" size={20} />
        </button>
      </header>

      {/* Ghost Tip Section - UI Premium com Transição Fantasma */}
      <section className="mb-12 animate-reveal delay-1">
         <div className="flex items-center gap-4 mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] whitespace-nowrap">Casos Reais & Dicas do Dia</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
         </div>
         
         <div className={`p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] relative overflow-hidden min-h-[160px] flex flex-col justify-center transition-all duration-700 ease-in-out ${
           ghostStatus === 'fading' ? 'opacity-0 scale-95 blur-xl' : 'opacity-100 scale-100 blur-0'
         }`}>
            <div className="absolute top-2 right-6 p-4 opacity-5"><Icon name={DAILY_TIPS[tipIndex].icon} size={80} /></div>
            <div className="flex items-center gap-3 mb-3">
               <div className="w-1 h-1 bg-indigo-500 rounded-full animate-ping"></div>
               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">{DAILY_TIPS[tipIndex].title}</h4>
            </div>
            <p className="text-sm font-bold text-slate-300 leading-relaxed italic uppercase tracking-tight mb-4 pr-10">
               "{DAILY_TIPS[tipIndex].text}"
            </p>
            <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest">{DAILY_TIPS[tipIndex].legalRef}</span>
         </div>
      </section>

      {/* Book Grid - Experiência de Prateleira Premium */}
      <div className="grid grid-cols-1 gap-4 animate-reveal delay-2">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Acervo Digital Core</h3>
        {DIGITAL_LIBRARY.map(book => (
          <button 
            key={book.id}
            onClick={() => { Haptics.light(); setSelectedBook(book); setReadMode('summary'); setAiExplanation(null); }}
            className="w-full p-6 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] flex items-center gap-6 text-left hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all group relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center text-slate-600 group-hover:text-indigo-400 group-hover:scale-110 transition-all border border-slate-800">
                <Icon name={book.icon} size={28} />
             </div>
             <div className="flex-1 relative z-10">
                <h4 className="text-base font-black text-white uppercase tracking-tight leading-none mb-2">{book.title}</h4>
                <div className="flex gap-3">
                  <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest">{book.category}</span>
                  <div className="w-1 h-1 bg-slate-800 rounded-full self-center"></div>
                  <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest truncate max-w-[100px]">{book.author}</span>
                </div>
             </div>
             <Icon name="chevronLeft" size={16} className="rotate-180 text-slate-800 relative z-10" />
          </button>
        ))}
      </div>

      {/* Reader Modal Multinível com IA */}
      {selectedBook && (
        <div className="fixed inset-0 z-[250] bg-black/98 backdrop-blur-3xl flex items-end animate-reveal">
           <div className="w-full max-w-lg mx-auto bg-slate-950 border-t border-x border-slate-800 rounded-t-[3.5rem] h-[94vh] flex flex-col overflow-hidden shadow-[0_-40px_80px_rgba(0,0,0,0.8)]">
              
              <header className="p-10 border-b border-white/5 bg-slate-900/20 relative">
                 <div className="flex justify-between items-start mb-8">
                    <div className="flex gap-2">
                       <div className="px-3 py-1 bg-indigo-500 text-slate-950 rounded-lg text-[8px] font-black uppercase tracking-widest">
                         LVL {selectedBook.levelRequired}
                       </div>
                       <div className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest">
                         {selectedBook.category}
                       </div>
                    </div>
                    <button onClick={() => setSelectedBook(null)} className="p-3 bg-slate-900 rounded-2xl text-slate-400 hover:text-white transition-colors bouncy-btn">
                       <Icon name="plus" size={24} className="rotate-45" />
                    </button>
                 </div>
                 
                 <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-8">{selectedBook.title}</h3>
                 
                 {/* Mode Toggle: Resumo Tático vs Caminho Completo */}
                 <div className="flex gap-2 p-1.5 bg-black/40 rounded-[2rem] border border-slate-800">
                    <button 
                      onClick={() => { Haptics.light(); setReadMode('summary'); }}
                      className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${readMode === 'summary' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600'}`}
                    >
                      <Icon name="zap" size={12} /> Sínopse Tática
                    </button>
                    <button 
                      onClick={() => { Haptics.light(); setReadMode('full'); }}
                      className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${readMode === 'full' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600'}`}
                    >
                      <Icon name="bookOpen" size={12} /> Caminho Completo
                    </button>
                 </div>
              </header>

              <div className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide pb-32">
                 <div className={`transition-all duration-700 ${
                   readMode === 'summary' 
                   ? 'text-xl font-bold italic text-slate-300 leading-[1.8] border-l-4 border-indigo-600/30 pl-8' 
                   : 'text-base font-medium text-slate-400 leading-[2] text-justify font-serif'
                 }`}>
                    {readMode === 'summary' ? selectedBook.summary : selectedBook.fullText}
                 </div>

                 {/* Seção de IA: O Mentor Nkelo explica o Caso Real */}
                 <div className="pt-12 border-t border-white/5 space-y-8">
                    <div className="text-center space-y-4">
                       <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Interpretação SSS</h5>
                       <button 
                         onClick={() => handleAskAI(readMode === 'summary' ? selectedBook.summary : selectedBook.fullText)}
                         disabled={isAnalyzing}
                         className="w-full py-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl shadow-indigo-900/40 border-t border-white/20 bouncy-btn disabled:opacity-50"
                       >
                          <Icon name="zap" size={20} className={isAnalyzing ? 'animate-spin' : ''} />
                          {isAnalyzing ? 'Analisando Grounding...' : 'Consultar Mentor Nkelo'}
                       </button>
                    </div>

                    {aiExplanation && (
                       <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[3rem] animate-reveal relative">
                          <div className="absolute -top-4 left-8 px-4 py-1.5 bg-emerald-500 text-slate-950 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                             Parecer Pedagógico
                          </div>
                          <div className="flex items-center gap-4 mb-6 pt-2">
                             <div className="w-10 h-10 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                <Icon name="check" size={18} />
                             </div>
                             <h6 className="text-[10px] font-black text-white uppercase tracking-widest italic">"Entendimento para o Dia-a-Dia"</h6>
                          </div>
                          <p className="text-base font-bold text-slate-300 leading-relaxed italic border-l-2 border-emerald-500/20 pl-6">
                             {aiExplanation}
                          </p>
                       </div>
                    )}
                 </div>
              </div>
              
              <footer className="p-10 bg-slate-900/40 flex flex-col gap-4">
                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest text-center">Copyright © 2025 NKELO.OS Data Center</p>
                 <button onClick={() => setSelectedBook(null)} className="w-full py-5 bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">Fechar Dossier</button>
              </footer>
           </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveScreen;
