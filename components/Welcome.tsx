
import React from 'react';

interface WelcomeProps {
  onEnter: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 bg-agroCream z-50 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="mb-4 text-sm font-bold tracking-widest text-agroDark uppercase">
        AgroLearn
      </div>
      
      <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-agroGreen/10 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Circular White Container */}
        <div className="relative w-40 h-40 bg-white shadow-sm rounded-full flex items-center justify-center border border-agroGreen/10">
          <svg className="w-20 h-20 text-agroGreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c-1 5-1.5 7-2 11a7 7 0 0 1-8 7Z"/>
            <path d="M7 20h4"/>
          </svg>
        </div>
      </div>

      <div className="space-y-4 max-w-xs mx-auto mb-16">
        <h1 className="text-5xl font-extrabold text-agroDark leading-tight">
          ISTAH <span className="text-agroGreen font-black">Agroecología</span>
        </h1>
        <p className="text-agroMuted text-lg font-medium leading-relaxed">
          Tu biblioteca técnica estable y siempre disponible.
        </p>
      </div>

      <button
        onClick={onEnter}
        className="w-full max-w-sm bg-agroGreen text-agroDark font-bold py-6 px-8 rounded-32px text-xl flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(24,232,24,0.4)] active:scale-95 transition-all"
      >
        ENTRAR
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button>

      <div className="absolute bottom-8 text-agroMuted/50 text-[10px] font-black uppercase tracking-[0.2em]">
        Plataforma de Educación Agroecológica
      </div>
    </div>
  );
};

export default Welcome;
