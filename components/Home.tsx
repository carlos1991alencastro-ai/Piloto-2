
import React from 'react';
import { UNITS } from '../constants';
import { ViewState } from '../types';

interface HomeProps {
  onModuleSelect: () => void;
}

const Home: React.FC<HomeProps> = ({ onModuleSelect }) => {
  const [stats, setStats] = React.useState({ progress: 0 });

  React.useEffect(() => {
    const savedProgress = localStorage.getItem('agro_reading_progress');
    if (savedProgress) {
        const p = JSON.parse(savedProgress);
        setStats({ progress: Math.min(100, p.length * 5) }); // Simulation
    }
  }, []);

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-black text-agroDark tracking-tight">AGROLEARN ISTAH</h2>
        <div className="w-10 h-10 bg-agroGreen/10 flex items-center justify-center rounded-full text-agroGreen font-bold">
            99
        </div>
      </header>

      {/* Hero Profile */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-agroGreen rounded-full border-4 border-white shadow-card flex items-center justify-center text-3xl">
           👨‍🌾
        </div>
        <div>
           <p className="text-xs font-bold text-agroMuted uppercase tracking-widest">Estudiante ISTAH</p>
           <h3 className="text-2xl font-black text-agroDark">Hola de nuevo! 🌱</h3>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-8 rounded-32px shadow-card border border-agroGreen/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-agroGreen/5 rounded-full -mr-16 -mt-16"></div>
        <div className="flex justify-between items-end mb-4">
            <h4 className="text-lg font-black text-agroDark">Progreso</h4>
            <span className="text-4xl font-black text-agroGreen">{stats.progress}</span>
        </div>
        <div className="w-full h-3 bg-agroCream rounded-full overflow-hidden">
            <div 
                className="h-full bg-agroGreen transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${stats.progress}%` }}
            ></div>
        </div>
      </div>

      {/* Syllabus Units */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18E818" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
            <h4 className="text-xl font-black text-agroDark">Unidades del Sílabo</h4>
        </div>

        <div className="grid gap-4">
            {UNITS.map((unit) => (
                <button 
                  key={unit.id}
                  onClick={onModuleSelect}
                  className="bg-white p-6 rounded-32px shadow-card border border-transparent hover:border-agroGreen/20 active:scale-[0.98] transition-all flex items-center gap-4 text-left group"
                >
                    <div className="w-14 h-14 bg-agroDark rounded-2xl flex items-center justify-center text-agroGreen shrink-0 group-hover:bg-agroGreen group-hover:text-white transition-colors">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.13,20C11,20 14.28,17.22 18,17C19.5,17 20,18 20,18V18L21,11.85C21,11.85 21,8 17,8" />
                        </svg>
                    </div>
                    <div>
                        <h5 className="font-extrabold text-agroDark text-sm line-clamp-1 uppercase leading-snug">
                            {unit.title}
                        </h5>
                        <p className="text-xs text-agroMuted mt-1 line-clamp-1 italic">
                            {unit.description}
                        </p>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
