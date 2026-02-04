
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Icon from '../components/Icon';
import { Haptics } from '../utils/haptics';

interface Props {
  user: User;
}

const NexusScreen: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'duels' | 'clans'>('friends');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const friends = [
    { id: 'u2', name: 'Agente Manuel', level: 12, status: 'online', mission: 'Lógica' },
    { id: 'u3', name: 'Dra. Isabel', level: 9, status: 'away', mission: 'CRA' },
    { id: 'u4', name: 'Paulo J.', level: 5, status: 'offline', mission: '---' },
    { id: 'u5', name: 'Teresa B.', level: 15, status: 'online', mission: 'Energia' },
  ];

  useEffect(() => {
    if (showInviteModal) {
      setInviteCode('NK-' + Math.random().toString(36).substring(2, 8).toUpperCase());
    }
  }, [showInviteModal]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-10 bg-[#020617] relative flex flex-col min-h-full pb-32 scrollbar-hide">
      <div className="scanline opacity-10"></div>
      
      <header className="mb-10 animate-reveal">
        <h2 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
           <Icon name="globe" size={12} /> Rede de Inteligência
        </h2>
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">O Teu<br/>Esquadrão</h1>
      </header>

      <div className="flex gap-2 mb-8 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800 animate-reveal delay-1">
         {[
           { id: 'friends', label: 'Aliados', icon: 'user' },
           { id: 'duels', label: 'Duelos', icon: 'zap' },
           { id: 'clans', label: 'Clãs', icon: 'award' }
         ].map((tab) => (
           <button
             key={tab.id}
             onClick={() => { Haptics.light(); setActiveTab(tab.id as any); }}
             className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             <Icon name={tab.icon} size={14} />
             <span className="text-[7px] font-black uppercase tracking-widest">{tab.label}</span>
           </button>
         ))}
      </div>

      <div className="flex-1">
        {activeTab === 'friends' && (
          <div className="space-y-6 animate-reveal">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Frequências Ativas</h3>
               <button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 bouncy-btn">
                  <Icon name="plus" size={12} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Recrutar</span>
               </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
               {friends.map((agent, i) => (
                 <div key={agent.id} className="p-5 bg-slate-900/30 border border-slate-800 rounded-[2rem] flex items-center gap-5 animate-reveal active:scale-[0.98] transition-transform" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="relative">
                       <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-slate-600 border border-slate-800 shadow-inner">
                          <Icon name="user" size={20} />
                       </div>
                       <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#020617] ${agent.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-white uppercase tracking-tight">{agent.name}</h4>
                          <span className="text-[7px] font-black bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded uppercase">LVL {agent.level}</span>
                       </div>
                       <p className="text-[7px] font-bold text-slate-600 uppercase tracking-widest mt-1">
                         Operação: <span className="text-amber-500/80">{agent.mission}</span>
                       </p>
                    </div>
                    <div className="flex gap-2">
                       <button className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:text-amber-500 transition-colors bouncy-btn">
                          <Icon name="zap" size={16} />
                       </button>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'duels' && (
          <div className="space-y-6 animate-reveal">
             <div className="p-10 bg-gradient-to-br from-amber-600/20 to-rose-600/10 border border-amber-500/20 rounded-[3rem] text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-rose-500 animate-pulse"></div>
                <Icon name="zap" size={64} className="text-amber-500 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">Confronto de Sabedoria</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-8">
                  Desafia um aliado para uma validação de conhecimentos. O vencedor ganha prestígio e 100 XP extras.
                </p>
                <div className="space-y-3">
                   <button className="w-full py-5 bg-amber-500 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] bouncy-btn shadow-xl shadow-amber-900/20">Lançar Desafio Global</button>
                   <button className="w-full py-4 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] bouncy-btn">Treinar com o Sistema</button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'clans' && (
           <div className="space-y-6 animate-reveal">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Clãs da Nação</h3>
                 <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Sincronizado</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {[
                   { name: 'Engenheiros do Kwanza', members: 124, power: '98%', color: 'text-indigo-400' },
                   { name: 'Guardiões do Ndongo', members: 89, power: '92%', color: 'text-rose-400' },
                   { name: 'Pioneiros do Namibe', members: 56, power: '85%', color: 'text-amber-400' }
                 ].map((clan, i) => (
                   <div key={i} className="p-6 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center gap-5">
                         <div className={`w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center ${clan.color} border border-slate-800 shadow-inner group-hover:scale-105 transition-transform`}>
                            <Icon name="award" size={24} />
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-tight">{clan.name}</h4>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{clan.members} Agentes</span>
                               <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                               <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Power: {clan.power}</span>
                            </div>
                         </div>
                      </div>
                      <Icon name="chevronLeft" size={16} className="rotate-180 text-slate-700" />
                   </div>
                 ))}
              </div>
              <button className="w-full py-5 border border-dashed border-slate-800 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-slate-600 hover:text-slate-300 transition-all">Criar Novo Clã</button>
           </div>
        )}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/95 backdrop-blur-xl">
           <div className="cyber-panel w-full max-w-sm rounded-[3rem] p-10 text-center animate-scale relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-slate-800"><Icon name="rocket" size={120} /></div>
              <div className="relative z-10">
                 <div className="w-16 h-16 bg-amber-500 rounded-[1.8rem] flex items-center justify-center text-slate-950 mx-auto mb-6 shadow-xl shadow-amber-500/20">
                    <Icon name="plus" size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Código de Aliado</h3>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-8">Partilha esta frequência para adicionar novos agentes ao teu esquadrão.</p>
                 <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-8 relative group cursor-pointer" onClick={() => { navigator.clipboard.writeText(inviteCode); Haptics.success(); }}>
                    <span className="text-2xl font-mono font-black text-amber-500 tracking-[0.2em]">{inviteCode}</span>
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"><Icon name="check" size={10} className="text-emerald-500" /></div>
                 </div>
                 <button onClick={() => setShowInviteModal(false)} className="w-full py-5 bg-amber-500 text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] bouncy-btn">Fechar Comunicação</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default NexusScreen;
