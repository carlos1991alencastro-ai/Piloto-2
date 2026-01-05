
import React, { useState } from 'react';
import { UNITS } from '../constants';
import { Unit, Lesson } from '../types';

interface ModulesProps {
  onLessonSelect: (lesson: Lesson) => void;
}

const Modules: React.FC<ModulesProps> = ({ onLessonSelect }) => {
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);

  if (activeUnit) {
    return (
      <div className="p-6 space-y-6 animate-slide-in">
        <button 
            onClick={() => setActiveUnit(null)}
            className="flex items-center gap-3 text-agroDark font-black group"
        >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-card group-hover:bg-agroGreen transition-colors group-hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            VOLVER
        </button>

        <div className="bg-white p-8 rounded-32px shadow-card border border-agroGreen/5">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-agroDark rounded-2xl flex items-center justify-center text-agroGreen">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.13,20C11,20 14.28,17.22 18,17C19.5,17 20,18 20,18V18L21,11.85C21,11.85 21,8 17,8"/></svg>
                </div>
                <div>
                    <h2 className="text-xl font-black text-agroDark leading-tight">{activeUnit.title}</h2>
                    <span className="text-[10px] font-bold text-agroGreen uppercase tracking-widest">{activeUnit.lessons.length} TEMAS DISPONIBLES</span>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            {activeUnit.lessons.map((lesson) => (
                <div 
                    key={lesson.id} 
                    className="bg-white p-6 rounded-32px shadow-card border border-transparent hover:border-agroGreen/10 transition-all"
                >
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="font-extrabold text-agroDark text-lg max-w-[80%]">{lesson.title}</h4>
                        <div className="w-6 h-6 rounded-full border-2 border-agroGreen/20 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-agroGreen/20"></div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => onLessonSelect(lesson)}
                        className="w-full bg-agroCream/50 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-transform"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-agroGreen">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12h4"/><path d="M10 16h4"/></svg>
                            </div>
                            <div className="text-left">
                                <span className="block text-[10px] font-bold text-agroMuted uppercase tracking-widest">PDF</span>
                                <span className="block text-xs font-black text-agroDark truncate max-w-[150px]">{lesson.title.toUpperCase()}</span>
                            </div>
                        </div>
                        <svg className="text-agroGreen/30 group-hover:text-agroGreen transition-colors" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
            <div>
                <h2 className="text-3xl font-black text-agroDark">Módulos</h2>
                <p className="text-agroMuted font-medium italic">Selecciona una unidad de estudio</p>
            </div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-card text-agroGreen">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10v6"/><path d="M9 13h6"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
            </div>
        </div>

        <div className="grid gap-6">
            {UNITS.map((unit, idx) => (
                <button 
                  key={unit.id}
                  onClick={() => setActiveUnit(unit)}
                  className="bg-white p-6 rounded-32px shadow-card group active:scale-[0.98] transition-all text-left relative overflow-hidden border border-transparent hover:border-agroGreen/10"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="text-8xl font-black">{idx + 1}</span>
                    </div>
                    
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="w-12 h-12 bg-agroGreen/10 rounded-xl flex items-center justify-center text-agroGreen">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-agroDark leading-snug">{unit.title}</h3>
                            <p className="text-sm text-agroMuted mt-1 line-clamp-2 italic">{unit.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-agroGreen tracking-widest uppercase">
                            Explorar Contenidos
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );
};

export default Modules;
