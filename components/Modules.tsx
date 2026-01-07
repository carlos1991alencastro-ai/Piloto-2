
import React, { useState, useEffect } from 'react';
import { UNITS } from '../constants';
import { Unit, Lesson } from '../types';

interface ModulesProps {
  onLessonSelect: (lesson: Lesson) => void;
  initialUnitId?: string;
}

// Formateador especial para unidades: 'Unidad I. Bases y principios...'
const formatUnitTitle = (str: string) => {
  if (!str) return '';
  const match = str.match(/^(Unidad\s+[IVXLC]+)(\.\s+)?(.*)$/i);
  if (match) {
    const unitPart = match[1].split(' ')[0] + ' ' + match[1].split(' ')[1].toUpperCase();
    const rest = match[3].toLowerCase();
    const capitalizedRest = rest.charAt(0).toUpperCase() + rest.slice(1);
    return `${unitPart}. ${capitalizedRest}`;
  }
  const lowercase = str.toLowerCase();
  return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
};

// Formateador a Sentence Case para lecciones: '1.1 Introducción a la agroecología'
const toSentenceCase = (str: string) => {
  if (!str) return '';
  const parts = str.split(' ');
  // Si empieza con un número de sección (ej: 1.1), se mantiene
  if (parts.length > 1 && /^\d/.test(parts[0])) {
    const index = parts[0];
    const restOfText = parts.slice(1).join(' ').toLowerCase();
    const capitalizedText = restOfText.charAt(0).toUpperCase() + restOfText.slice(1);
    return `${index} ${capitalizedText}`;
  }
  const text = str.toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const getUnitIcon = (iconName: string) => {
  const iconProps = "w-7 h-7 text-agroGreen drop-shadow-[0_0_2px_rgba(24,232,24,0.3)]";
  const containerStyle = "w-14 h-14 bg-agroGreen/5 rounded-full flex items-center justify-center border-2 border-agroGreen shadow-sm shrink-0 transition-all";
  
  const icon = (() => {
    switch (iconName) {
      case 'menu_book':
        return <svg className={iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
      case 'psychology':
        return <svg className={iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c-1 5-1.5 7-2 11a7 7 0 0 1-8 7Z"/><path d="M7 20h4"/></svg>;
      case 'construction':
        return <svg className={iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
      case 'biotech':
        return <svg className={iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v8"/><path d="M14 2v8"/><path d="M8 8h8"/><path d="M19 22H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2Z"/><path d="M12 12v6"/><path d="M9 15h6"/></svg>;
      case 'perm_media':
        return <svg className={iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
      case 'science':
        return <svg className={iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15"/><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"/><path d="M6 14h12"/></svg>;
      default:
        return <svg className={iconProps} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>;
    }
  })();

  return <div className={containerStyle}>{icon}</div>;
};

const Modules: React.FC<ModulesProps> = ({ onLessonSelect, initialUnitId }) => {
  const [activeUnit, setActiveUnit] = useState<Unit | null>(null);

  useEffect(() => {
    if (initialUnitId) {
      const unit = UNITS.find(u => u.id === initialUnitId);
      if (unit) setActiveUnit(unit);
    }
  }, [initialUnitId]);

  const getFileSize = (id: string) => {
    const weights = ['1.2 MB', '2.4 MB', '0.8 MB', '3.1 MB', '1.5 MB'];
    const charCodeSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return weights[charCodeSum % weights.length];
  };

  if (activeUnit) {
    return (
      <div className="p-6 space-y-6 animate-slide-in bg-agroCream min-h-full pb-32">
        <button 
            onClick={() => setActiveUnit(null)}
            className="flex items-center gap-3 text-agroDark font-black group"
        >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-card group-hover:bg-agroGreen transition-colors group-hover:text-white border border-agroGreen/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            VOLVER
        </button>

        <div className="bg-white p-8 rounded-32px shadow-card border border-agroGreen/5">
            <div className="flex items-center gap-4">
                {getUnitIcon(activeUnit.icon)}
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-agroDark leading-tight whitespace-normal break-words">
                        {formatUnitTitle(activeUnit.title)}
                    </h2>
                    <span className="text-[10px] font-bold text-agroGreen uppercase tracking-widest block mt-2">
                      {activeUnit.isMultimediaLibrary ? 'CONTENIDOS AUDIOVISUALES' : 'CONTENIDOS DE LECTURA'}
                    </span>
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-2 px-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#18E818" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  {activeUnit.isMultimediaLibrary ? (
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  ) : (
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                  )}
                  {activeUnit.isMultimediaLibrary ? <circle cx="9" cy="9" r="2"/> : <path d="M8 7h6"/>}
                </svg>
                <h4 className="text-lg font-black text-agroDark uppercase tracking-tight">
                  {activeUnit.isMultimediaLibrary ? 'Recursos en video' : 'Lecciones del Sílabo'}
                </h4>
            </div>

            {activeUnit.lessons.map((lesson) => (
                <div key={lesson.id} className="bg-white p-6 rounded-32px shadow-card border border-transparent hover:border-agroGreen/10 transition-all flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col flex-1 pr-4">
                            <h4 className="font-bold text-agroDark text-lg leading-snug whitespace-normal break-words">
                              {toSentenceCase(lesson.title)}
                            </h4>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-agroGreen/10 flex items-center justify-center shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-agroGreen/20"></div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => onLessonSelect(lesson)}
                        className="w-full bg-agroCream/40 p-5 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all border border-transparent hover:border-agroGreen/5"
                    >
                        <div className="flex items-center gap-4 flex-1 overflow-hidden">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#18E818] shrink-0 border border-agroGreen/5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12h4"/><path d="M10 16h4"/></svg>
                            </div>
                            <div className="text-left flex-1">
                                <span className="block text-[11px] font-medium text-agroDark whitespace-normal break-words leading-tight tracking-wide">
                                    {toSentenceCase(lesson.title)}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{getFileSize(lesson.id)}</span>
                                </div>
                            </div>
                        </div>
                        <svg className="text-agroGreen/40 group-hover:text-agroGreen transition-colors shrink-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>
            ))}

            {activeUnit.isMultimediaLibrary && activeUnit.videos?.map((video) => (
                <div key={video.id} className="bg-white p-6 rounded-32px shadow-card border border-transparent hover:border-agroGreen/10 transition-all flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col flex-1 pr-4">
                            <h4 className="font-bold text-agroDark text-lg leading-snug whitespace-normal break-words">
                              {toSentenceCase(video.title)}
                            </h4>
                        </div>
                    </div>
                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="w-full bg-agroGreen/5 p-5 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all border border-transparent hover:border-agroGreen/20">
                        <div className="flex items-center gap-4 flex-1 overflow-hidden">
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-500 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M10 15.5l6-3.5-6-3.5v7zM22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z"/></svg>
                            </div>
                            <span className="text-[11px] font-black text-agroDark uppercase tracking-wide">Ver en YouTube</span>
                        </div>
                        <svg className="text-agroGreen/40 group-hover:text-agroGreen transition-colors" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </a>
                </div>
            ))}

            {!activeUnit.isMultimediaLibrary && activeUnit.summaryNotebookUrl && (
              <div className="pt-4 mt-4 border-t border-agroGreen/10">
                <div className="bg-white p-6 rounded-32px shadow-card border border-agroGreen/10">
                  <div className="flex items-center gap-2 mb-4 px-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18E818" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    <h4 className="text-sm font-bold text-agroDark uppercase tracking-tight">Cierre de aprendizaje</h4>
                  </div>
                  <a href={activeUnit.summaryNotebookUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-agroGreen/5 p-6 rounded-2xl flex items-center justify-between group transition-all border border-agroGreen/20">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center text-agroGreen shrink-0 border border-agroGreen/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M10 9H8"/></svg>
                      </div>
                      <div>
                        <span className="block text-sm font-semibold text-agroDark leading-tight">Notebook resumen</span>
                        <span className="text-[10px] font-bold text-agroGreen uppercase tracking-widest block mt-1">Recurso de práctica</span>
                      </div>
                    </div>
                    <svg className="text-agroGreen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </a>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in bg-agroCream min-h-full pb-32">
        <div className="flex items-center justify-between mb-2">
            <div>
                <h2 className="text-3xl font-black text-agroDark uppercase tracking-tight">Módulos</h2>
                <p className="text-agroMuted font-medium italic text-sm">Biblioteca técnica agroecológica</p>
            </div>
        </div>

        <div className="grid gap-6">
            {UNITS.map((unit, idx) => (
                <button key={unit.id} onClick={() => setActiveUnit(unit)} className="bg-white p-6 rounded-32px shadow-card group active:scale-[0.98] transition-all text-left relative overflow-hidden border border-transparent hover:border-agroGreen/10">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="text-8xl font-black text-agroGreen">{idx + 1}</span>
                    </div>
                    <div className="relative z-10 flex flex-col gap-4">
                        {getUnitIcon(unit.icon)}
                        <h3 className="text-xl font-bold text-agroDark leading-tight whitespace-normal break-words overflow-wrap-anywhere">
                            {formatUnitTitle(unit.title)}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-black text-agroGreen tracking-[0.2em] uppercase">
                            {unit.isMultimediaLibrary ? 'Ver Videos' : 'Explorar Unidad'}
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    </div>
  );
};

export default Modules;
