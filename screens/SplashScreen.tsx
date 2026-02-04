
import React, { useEffect } from 'react';
import Icon from '../components/Icon';

interface Props {
  onFinish?: () => void;
}

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    if (onFinish) {
      const timer = setTimeout(onFinish, 2500);
      return () => clearTimeout(timer);
    }
  }, [onFinish]);

  return (
    <div className="h-full w-full bg-[#4F46E5] flex flex-col items-center justify-center text-white px-6">
      <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mb-8 animate-pulse border border-white/20">
        <Icon name="rocket" size={60} className="text-white" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight mb-2">Nkelo</h1>
      <p className="text-indigo-100/70 text-lg font-medium">Excelência Educacional</p>
      
      <div className="absolute bottom-16 w-12 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white animate-[loading_2.5s_ease-in-out]"></div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
