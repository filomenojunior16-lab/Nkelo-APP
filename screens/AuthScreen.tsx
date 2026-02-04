
import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { ModuleType, UserRole } from '../types';
import { Haptics } from '../utils/haptics';

interface Props {
  onLogin: (name: string, email: string, favorite: ModuleType, role: UserRole) => void;
}

const AuthScreen: React.FC<Props> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [favorite, setFavorite] = useState<ModuleType>(ModuleType.MATHEMATICS);
  const [role, setRole] = useState<UserRole>(UserRole.ASPIRANTE);
  const [step, setStep] = useState<'identity' | 'info' | 'favorite'>('identity');
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedUser, setSavedUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nkelo_user');
    if (saved) setSavedUser(JSON.parse(saved));
  }, []);

  const specialties = [
    { id: ModuleType.MATHEMATICS, label: 'Lógica & Números', icon: 'zap', color: 'text-rose-400' },
    { id: ModuleType.HISTORY, label: 'Identidade & Povo', icon: 'award', color: 'text-amber-400' },
    { id: ModuleType.GEOGRAPHY, label: 'Terras & Mapas', icon: 'globe', color: 'text-indigo-400' },
    { id: ModuleType.PORTUGUESE, label: 'Língua & Arte', icon: 'bookOpen', color: 'text-emerald-400' },
  ];

  const canProceed = name.trim().length >= 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    Haptics.medium();
    
    if (role === UserRole.ENTUSIASTA) {
      handleFinalLogin();
      return;
    }

    if (canProceed || role === UserRole.ADMIN) {
      if (role === UserRole.ADMIN) {
        handleFinalLogin();
      } else {
        setStep('favorite');
      }
    }
  };

  const handleQuickEntry = () => {
    if (!savedUser) return;
    setIsProcessing(true);
    Haptics.success();
    setTimeout(() => onLogin(savedUser.name, savedUser.email, savedUser.favoriteModule, savedUser.role), 1000);
  };

  const handleFinalLogin = () => {
    setIsProcessing(true);
    Haptics.success();
    const finalName = role === UserRole.ENTUSIASTA && !name ? "Explorador" : (name || "Admin");
    const finalEmail = role === UserRole.ENTUSIASTA && !email ? "guest@nkelo.ao" : (email || "admin@nkelo.ao");
    setTimeout(() => onLogin(finalName, finalEmail, favorite, role), 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#020617] relative overflow-hidden h-full">
      <div className="absolute inset-0 scanline opacity-20"></div>

      <div className="flex-1 flex flex-col px-8 py-12 relative z-10 max-w-md mx-auto w-full overflow-y-auto pb-20">
        <header className="mb-10 text-center animate-reveal">
          <div className="inline-flex items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-3xl mb-6 shadow-2xl">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Icon name="rocket" size={28} className="text-white" />
             </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">NKELO<span className="text-indigo-500">.OS</span></h1>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Protocolos de Identidade</p>
        </header>

        {isProcessing ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-reveal">
             <div className="w-16 h-16 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-white font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Sincronizando Kernel...</p>
          </div>
        ) : step === 'identity' ? (
          <div className="space-y-8 animate-reveal">
             {savedUser && (
               <div className="p-8 bg-indigo-500/10 border border-indigo-500/30 rounded-[3rem] text-center relative overflow-hidden mb-6">
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-500 text-white text-[6px] font-black uppercase tracking-widest rounded">Último Acesso</div>
                  <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mx-auto mb-4">
                     <Icon name="user" size={24} className="text-indigo-400" />
                  </div>
                  <h3 className="text-white font-black text-sm uppercase tracking-tight mb-1">{savedUser.name}</h3>
                  <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest mb-6">{savedUser.role} • Nível {savedUser.level}</p>
                  <button onClick={handleQuickEntry} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] bouncy-btn shadow-lg">Retomar Missão</button>
               </div>
             )}

             <div className="grid grid-cols-1 gap-3">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] text-center mb-2">Entrar com Nova Identidade</p>
                {[
                  { id: UserRole.ASPIRANTE, label: 'Aspirante', icon: 'user', desc: 'Conta de estudante nominal' },
                  { id: UserRole.ENTUSIASTA, label: 'Entusiasta', icon: 'zap', desc: 'Acesso rápido sem registo' },
                  { id: UserRole.ADMIN, label: 'Admin', icon: 'shield', desc: 'Consola de Supervisão' }
                ].map(r => (
                  <button 
                    key={r.id}
                    onClick={() => { Haptics.light(); setRole(r.id); setStep('info'); }}
                    className="p-6 rounded-[2rem] border border-slate-800 bg-slate-900/40 text-left transition-all hover:border-indigo-500/50 flex items-center gap-5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-indigo-400">
                       <Icon name={r.icon} size={18} />
                    </div>
                    <div>
                       <h4 className="text-[11px] font-black text-white uppercase tracking-tight">{r.label}</h4>
                       <p className="text-[7px] font-bold text-slate-600 uppercase tracking-widest">{r.desc}</p>
                    </div>
                  </button>
                ))}
             </div>
          </div>
        ) : step === 'info' ? (
          <div className="space-y-8 animate-reveal">
             {role !== UserRole.ENTUSIASTA ? (
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Codinome do Agente</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold text-sm focus:border-indigo-500/50 outline-none"
                      placeholder="Introduz o teu nome..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail de Operações</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-white font-bold text-sm focus:border-indigo-500/50 outline-none"
                      placeholder="agente@nkelo.ao"
                    />
                  </div>
               </div>
             ) : (
                <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] text-center">
                   <Icon name="zap" size={40} className="text-emerald-500 mx-auto mb-4" />
                   <h3 className="text-white font-black text-sm uppercase tracking-tight mb-2">Login de Explorador</h3>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                      Este modo permite a entrada rápida. O progresso será guardado localmente mas não sincronizado com a rede de elite.
                   </p>
                </div>
             )}
             
             <div className="flex flex-col gap-3">
               <button
                 onClick={handleNextStep}
                 disabled={role !== UserRole.ENTUSIASTA && !canProceed}
                 className={`w-full py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] bouncy-btn shadow-xl ${
                   (role === UserRole.ENTUSIASTA || canProceed) ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 'bg-slate-900 text-slate-700'
                 }`}
               >
                 {role === UserRole.ENTUSIASTA ? 'Iniciar Exploração' : 'Validar Identidade'}
               </button>
               <button onClick={() => setStep('identity')} className="text-[8px] font-black text-slate-600 uppercase tracking-widest py-2">Voltar à Seleção</button>
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-reveal">
            <div className="grid grid-cols-2 gap-4">
              {specialties.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => { Haptics.light(); setFavorite(spec.id); }}
                  className={`p-6 rounded-[2.5rem] border flex flex-col items-center gap-4 transition-all bouncy-btn ${
                    favorite === spec.id ? 'bg-indigo-500 border-indigo-400 text-slate-950 scale-105 shadow-xl' : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <Icon name={spec.icon} size={24} className={favorite === spec.id ? 'text-indigo-900' : spec.color} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-center">{spec.label}</span>
                </button>
              ))}
            </div>
            <button onClick={handleFinalLogin} className="w-full py-6 bg-emerald-600 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] bouncy-btn shadow-xl shadow-emerald-900/20">
              Confirmar & Iniciar Missão
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
