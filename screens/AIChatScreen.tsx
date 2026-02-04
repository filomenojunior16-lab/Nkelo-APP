
import React, { useState, useRef, useEffect } from 'react';
import Icon from '../components/Icon';
import { AIService } from '../services/aiService';
import { Haptics } from '../utils/haptics';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIChatScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Saudações, Agente. Estou pronto para processar qualquer dúvida complexa sobre o nosso Dossier de Conhecimento. O que desejas analisar?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);
    Haptics.medium();

    try {
      const result = await AIService.askComplexQuestion(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: result || "Conexão instável. Repetir sincronia." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Erro nos sistemas centrais." }]);
    } finally {
      setIsThinking(false);
      Haptics.success();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] h-full overflow-hidden">
      <div className="px-8 pt-16 pb-6 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-xl flex items-center justify-between">
         <button onClick={onBack} className="p-3 bg-slate-900 rounded-xl text-slate-400"><Icon name="chevronLeft" size={20}/></button>
         <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Nexus Intelligence</span>
            <h1 className="text-xs font-black text-white uppercase tracking-[0.2em]">Mentor Nkelo Pro</h1>
         </div>
         <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500">
            <Icon name="rocket" size={20} />
         </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-reveal`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm font-medium leading-relaxed ${
              m.role === 'user' 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-slate-900/50 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-900/50 border border-indigo-500/30 p-5 rounded-[2rem] rounded-tl-none">
               <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Processando em Thinking Mode...</span>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-950/80 backdrop-blur-xl border-t border-white/5">
        <div className="flex gap-3 bg-slate-900 rounded-[2rem] p-2 border border-slate-800">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte ao Mentor..."
            className="flex-1 bg-transparent px-6 py-3 text-sm text-white outline-none placeholder:text-slate-700"
          />
          <button 
            onClick={handleSend}
            disabled={isThinking}
            className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white bouncy-btn shadow-lg"
          >
            <Icon name="zap" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatScreen;
