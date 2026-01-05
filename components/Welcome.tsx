
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
        <div className="absolute inset-0 bg-agroGreen/10 rounded-32px blur-2xl animate-pulse"></div>
        <div className="relative w-40 h-40 bg-white shadow-card rounded-32px flex items-center justify-center overflow-hidden">
          <svg className="w-24 h-24 text-agroGreen" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.13,20C11,20 14.28,17.22 18,17C19.5,17 20,18 20,18V18L21,11.85C21,11.85 21,8 17,8M14,11C13.2,11 12.5,10.3 12.5,9.5C12.5,8.7 13.2,8 14,8C14.8,8 15.5,8.7 15.5,9.5C15.5,10.3 14.8,11 14,11Z" />
          </svg>
        </div>
      </div>

      <div className="space-y-4 max-w-xs mx-auto mb-16">
        <h1 className="text-5xl font-extrabold text-agroDark leading-tight">
          ISTAH <span className="text-agroGreen">Agroecología</span>
        </h1>
        <p className="text-agroMuted text-lg leading-relaxed">
          Tu biblioteca técnica estable y siempre disponible.
        </p>
      </div>

      <button
        onClick={onEnter}
        className="w-full max-w-sm bg-agroGreen text-agroDark font-bold py-6 px-8 rounded-32px text-xl flex items-center justify-center gap-3 shadow-[0_20px_40px_-15px_rgba(24,232,24,0.4)] active:scale-95 transition-all"
      >
        ENTRAR
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button>

      <div className="absolute bottom-8 text-agroMuted/50 text-xs font-medium uppercase tracking-widest">
        Plataforma de Educación Agroecológica
      </div>
    </div>
  );
};

export default Welcome;
