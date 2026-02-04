
import React, { useState } from 'react';
import Icon from '../components/Icon';

interface Props {
  onFinish: () => void;
}

const steps = [
  {
    title: "Vem ser um Herói!",
    description: "O Nkelo é o teu super computador para aprenderes tudo sobre Angola e o mundo. Estás pronto para a missão?",
    image: "https://images.unsplash.com/photo-1618365908648-e71bd5716cba?auto=format&fit=crop&q=80&w=800",
    icon: "rocket"
  },
  {
    title: "Aprende a Brincar",
    description: "Ganha pontos, coleciona troféus e desafia os teus amigos para ver quem sabe mais!",
    image: "https://images.unsplash.com/photo-1536337005238-94b997371b40?auto=format&fit=crop&q=80&w=800",
    icon: "award"
  },
  {
    title: "Tu és o Futuro",
    description: "Com o teu conhecimento, vais ajudar a construir uma Angola mais forte e inteligente. Joga, vença e repita!",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    icon: "zap"
  }
];

const OnboardingScreen: React.FC<Props> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish();
    }
  };

  const step = steps[currentStep];

  return (
    <div className="flex-1 flex flex-col bg-[#020617] h-full overflow-hidden">
      <div className="flex-[1.2] relative">
        <img 
          src={step.image} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-1000" 
          alt="Onboarding"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
        <div className="absolute top-16 left-0 right-0 flex justify-center">
           <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl animate-float">
             <Icon name={step.icon} size={40} className="text-white" />
           </div>
        </div>
      </div>
      
      <div className="flex-1 px-10 pb-12 flex flex-col justify-between text-center">
        <div className="animate-reveal">
          <h2 className="text-4xl font-black text-white leading-tight mb-4 tracking-tighter uppercase">
            {step.title}
          </h2>
          <p className="text-slate-400 text-base font-medium leading-relaxed">
            {step.description}
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex gap-2 justify-center">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-500 ${i === currentStep ? 'w-10 bg-indigo-500' : 'w-2 bg-slate-800'}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black text-lg shadow-2xl shadow-indigo-900/40 bouncy-btn tracking-widest uppercase"
          >
            {currentStep === steps.length - 1 ? 'Começar Agora!' : 'Continuar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
