
import React, { useState } from 'react';
import { User, UserRole, ModuleType, Broadcast } from '../types';
import Icon from '../components/Icon';
import { Haptics } from '../utils/haptics';

interface AdminProps {
  user: User;
  onSetBroadcast: (b: Broadcast | null) => void;
}

const AdminDashboardScreen: React.FC<AdminProps> = ({ user, onSetBroadcast }) => {
  const [activeMenu, setActiveMenu] = useState<'overview' | 'users' | 'system' | 'broadcast'>('overview');
  const [maintenance, setMaintenance] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const handleSendBroadcast = () => {
    if (!broadcastMsg) return;
    Haptics.success();
    const newBroadcast: Broadcast = {
      id: Math.random().toString(36).substr(2, 9),
      message: broadcastMsg,
      sender: user.name,
      timestamp: Date.now()
    };
    onSetBroadcast(newBroadcast);
    alert("Comunicado transmitido para a rede!");
    setBroadcastMsg('');
  };

  const handleClearBroadcast = () => {
    Haptics.medium();
    onSetBroadcast(null);
    alert("Comunicados anteriores revogados.");
  };

  return (
    <div className="flex-1 overflow-y-auto px-8 py-10 bg-[#020617] text-slate-300 pb-32 scrollbar-hide">
      <header className="mb-10 animate-reveal">
        <div className="flex justify-between items-center mb-8">
           <div>
             <span className="text-rose-500 text-[8px] font-black uppercase tracking-[0.5em] mb-1 block">Privilégios Administrativos SSS</span>
             <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Kernel Control</h1>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-xl shadow-rose-900/10">
             <Icon name="shield" size={28} />
           </div>
        </div>

        <nav className="grid grid-cols-4 gap-2 p-2 bg-slate-900/80 backdrop-blur-md rounded-[2rem] border border-slate-800">
           {[
             { id: 'overview', label: 'Monitor', icon: 'activity' },
             { id: 'users', label: 'Operadores', icon: 'user' },
             { id: 'broadcast', label: 'Avisos', icon: 'zap' },
             { id: 'system', label: 'Kernel', icon: 'grid' }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => { Haptics.light(); setActiveMenu(tab.id as any); }}
               className={`py-3 rounded-xl flex flex-col items-center gap-1.5 transition-all ${activeMenu === tab.id ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500'}`}
             >
                <Icon name={tab.icon} size={14} />
                <span className="text-[6px] font-black uppercase tracking-widest">{tab.label}</span>
             </button>
           ))}
        </nav>
      </header>

      {activeMenu === 'overview' && (
        <div className="space-y-6 animate-reveal">
           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-2 opacity-5"><Icon name="user" size={40} /></div>
                 <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Células Ativas</span>
                 <h3 className="text-3xl font-black text-white tabular-nums">1,240</h3>
              </div>
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-2 opacity-5"><Icon name="award" size={40} /></div>
                 <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-2 block">XP Sincronizado</span>
                 <h3 className="text-3xl font-black text-rose-500 tabular-nums">12.4M</h3>
              </div>
           </div>
           
           <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem]">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Status dos Satélites</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-emerald-500/20">
                    <span className="text-[9px] font-black text-slate-400 uppercase">AngoSat-2</span>
                    <span className="text-emerald-500 font-mono text-[10px]">99.8% STABLE</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-indigo-500/20">
                    <span className="text-[9px] font-black text-slate-400 uppercase">Kernel Central</span>
                    <span className="text-indigo-500 font-mono text-[10px]">94.2% LOAD</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeMenu === 'broadcast' && (
        <div className="space-y-6 animate-reveal">
           <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[3rem]">
              <h4 className="text-sm font-black text-white uppercase tracking-tight mb-4 text-center">Comunicado Central</h4>
              <textarea 
                value={broadcastMsg}
                onChange={e => setBroadcastMsg(e.target.value)}
                placeholder="Escreva a mensagem de impacto para todos os Agentes..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-white focus:border-rose-500 outline-none h-32 mb-6"
              />
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleSendBroadcast}
                  className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-rose-900/20 bouncy-btn"
                >
                  Transmitir Mensagem
                </button>
                <button 
                  onClick={handleClearBroadcast}
                  className="w-full py-4 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl font-black text-[8px] uppercase tracking-widest bouncy-btn"
                >
                  Limpar Comunicados Ativos
                </button>
              </div>
           </div>
        </div>
      )}

      {activeMenu === 'system' && (
        <div className="space-y-6 animate-reveal">
           <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[3rem]">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight mb-1">Manutenção</h4>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Cessa missões em progresso.</p>
                 </div>
                 <button 
                  onClick={() => setMaintenance(!maintenance)}
                  className={`w-14 h-8 rounded-full relative transition-colors ${maintenance ? 'bg-rose-600' : 'bg-slate-800'}`}
                 >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${maintenance ? 'right-1' : 'left-1'}`}></div>
                 </button>
              </div>
              <button className="w-full py-5 bg-rose-600/10 border border-rose-600/20 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] bouncy-btn">FORÇAR ATUALIZAÇÃO DO KERNEL</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardScreen;
