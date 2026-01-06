
import React, { useState, useEffect, useRef, memo } from 'react';
import { Lesson } from '../types';
import { getDriveDirectUrl } from '../constants';

interface ReaderProps {
  lesson: Lesson;
  onClose: () => void;
}

// Formateador a Sentence Case: Primera letra mayúscula, resto minúscula
const toSentenceCase = (str: string) => {
  if (!str) return '';
  const lowercase = str.toLowerCase();
  return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
};

const Reader: React.FC<ReaderProps> = ({ lesson, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const readerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerContainerRef.current?.requestFullscreen({ navigationUI: 'hide' }).catch(err => {
        console.error(`Error al intentar activar pantalla completa: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      ref={readerContainerRef}
      className={`fixed inset-0 bg-white z-[100] flex flex-col ${isFullscreen ? 'p-0' : ''}`}
      style={{ 
        touchAction: 'auto',
        userSelect: 'text',
        WebkitUserSelect: 'text',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      } as React.CSSProperties}
    >
      {/* Cabecera Minimalista Blanca */}
      <header className="h-[64px] bg-white text-slate-800 px-4 flex items-center justify-between border-b border-slate-100 relative z-10 shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Botón de Retroceso Sencillo */}
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 active:scale-90 transition-transform shrink-0"
            aria-label="Volver"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-[15px] font-medium text-slate-900 leading-tight whitespace-normal break-words">
              {toSentenceCase(lesson.title)}
            </h3>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              BIBLIOTECA TÉCNICA ISTAH
            </span>
          </div>
        </div>

        <div className="flex items-center">
          {/* ÚNICAMENTE Botón de Pantalla Completa */}
          <button 
            onClick={toggleFullscreen}
            className="w-11 h-11 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center active:scale-90 transition-transform border border-slate-100"
            title="Pantalla Completa"
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
            )}
          </button>
        </div>
      </header>

      {/* Área del Documento - Optimización de Scroll y GPU */}
      <div 
        className="flex-1 bg-white relative overflow-hidden" 
        style={{ 
          touchAction: 'auto',
          WebkitOverflowScrolling: 'touch', // Scroll inercial nativo
          userSelect: 'text',
          WebkitUserSelect: 'text',
          pointerEvents: 'auto',
          overflowY: 'auto', // Scroll vertical permitido
          overflowX: 'hidden', // Evitar desbordamiento lateral del contenedor
          willChange: 'transform' // Preparar GPU para scroll fluido
        } as React.CSSProperties}
      >
        <iframe
          src={getDriveDirectUrl(lesson.driveId)}
          allow="fullscreen"
          loading="lazy"
          className="w-full h-full border-none hide-scrollbar selection-enabled"
          title={lesson.title}
          style={{ 
             display: 'block',
             width: '100%',
             height: '100%', // Forzar altura total
             border: 'none',
             touchAction: 'auto',
             WebkitOverflowScrolling: 'touch',
             backgroundColor: 'white',
             userSelect: 'text',
             WebkitUserSelect: 'text',
             pointerEvents: 'auto'
          } as React.CSSProperties}
          // @ts-ignore
          allowFullScreen={true}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .selection-enabled {
          user-select: text !important;
          -webkit-user-select: text !important;
        }
        iframe {
          -webkit-transform: translate3d(0,0,0);
          transform: translate3d(0,0,0);
        }
      `}} />
    </div>
  );
};

export default memo(Reader);
