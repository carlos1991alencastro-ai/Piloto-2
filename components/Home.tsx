
import React from 'react';
import { UNITS } from '../constants';

interface HomeProps {
  onModuleSelect: (unitId?: string) => void;
}

// Formateador especial para unidades: 'Unidad I. Bases y principios...'
const formatUnitTitle = (str: string) => {
  if (!str) return '';
  // Si contiene 'Unidad', preservamos el número romano en mayúsculas
  const match = str.match(/^(Unidad\s+[IVXLC]+)(\.\s+)?(.*)$/i);
  if (match) {
    const unitPart = match[1].split(' ')[0] + ' ' + match[1].split(' ')[1].toUpperCase();
    const rest = match[3].toLowerCase();
    const capitalizedRest = rest.charAt(0).toUpperCase() + rest.slice(1);
    return `${unitPart}. ${capitalizedRest}`;
  }
  // Para otros (como Biblioteca multimedia)
  const lowercase = str.toLowerCase();
  return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
};

const getUnitIcon = (iconName: string) => {
  const iconProps = "w-7 h-7 text-agroGreen drop-shadow-[0_0_2px_rgba(24,232,24,0.3)]";
  const containerStyle = "w-14 h-14 bg-agroGreen/5 rounded-full flex items-center justify-center border-2 border-agroGreen shadow-[0_4px_10px_-2px_rgba(24,232,24,0.2)] shrink-0 transition-all group-hover:bg-agroGreen/10";
  
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

const Home: React.FC<HomeProps> = ({ onModuleSelect }) => {
  const [stats, setStats] = React.useState({ progress: 0 });

  React.useEffect(() => {
    const savedProgress = localStorage.getItem('agro_reading_progress');
    if (savedProgress) {
        const p = JSON.parse(savedProgress);
        setStats({ progress: Math.min(100, p.length * 5) });
    }
  }, []);

  return (
    <div className="p-6 space-y-8 animate-fade-in bg-agroCream">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-agroGreen/30 shadow-sm">
            <svg className="w-6 h-6 text-agroGreen" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8.13,20C11,20 14.28,17.22 18,17C19.5,17 20,18 20,18V18L21,11.85C21,11.85 21,8 17,8M14,11C13.2,11 12.5,10.3 12.5,9.5C12.5,8.7 13.2,8 14,8C14.8,8 15.5,8.7 15.5,9.5C15.5,10.3 14.8,11 14,11Z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-agroDark tracking-tight">ISTAH AGRO</h2>
        </div>
        <div className="w-10 h-10 bg-white text-agroGreen border border-agroGreen/20 flex items-center justify-center rounded-xl font-black shadow-sm">
            99
        </div>
      </header>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white rounded-full border-4 border-agroGreen/20 shadow-card flex items-center justify-center text-3xl">
           👨‍🌾
        </div>
        <div>
           <p className="text-[10px] font-black text-agroGreen uppercase tracking-widest">Estudiante Premium</p>
           <h3 className="text-2xl font-black text-agroDark">¡Buen día! 🌱</h3>
        </div>
      </div>

      <div className="bg-white p-8 rounded-32px shadow-card border border-agroGreen/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-agroGreen/5 rounded-full -mr-16 -mt-16"></div>
        <div className="flex justify-between items-end mb-4">
            <h4 className="text-lg font-black text-agroDark">Tu Avance</h4>
            <span className="text-4xl font-black text-agroGreen">{stats.progress}%</span>
        </div>
        <div className="w-full h-3 bg-agroCream rounded-full overflow-hidden">
            <div 
                className="h-full bg-agroGreen transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_#18E818]"
                style={{ width: `${stats.progress}%` }}
            ></div>
        </div>
      </div>

      <div className="space-y-4 pb-12">
        <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#18E818" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
            <h4 className="text-xl font-black text-agroDark uppercase tracking-tight">Contenido académico</h4>
        </div>

        <div className="grid gap-4">
            {UNITS.map((unit) => (
                <button 
                  key={unit.id}
                  onClick={() => onModuleSelect(unit.id)}
                  className="bg-white p-6 rounded-32px shadow-card border border-transparent hover:border-agroGreen/20 active:scale-[0.98] transition-all flex items-center gap-4 text-left group"
                >
                    {getUnitIcon(unit.icon)}
                    <div className="flex-1 flex flex-col">
                        <h5 className="font-bold text-agroDark text-[14px] leading-tight whitespace-normal break-words overflow-wrap-anywhere">
                            {formatUnitTitle(unit.title)}
                        </h5>
                    </div>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
