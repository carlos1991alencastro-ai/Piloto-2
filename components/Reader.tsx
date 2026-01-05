
import React, { useState, useEffect, useRef } from 'react';
import { Lesson } from '../types';
import { getDriveDirectUrl } from '../constants';

interface ReaderProps {
  lesson: Lesson;
  onClose: () => void;
}

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
      className={`fixed inset-0 bg-white z-[100] flex flex-col transition-all duration-300 ${isFullscreen ? 'p-0' : ''}`}
      style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
    >
      {/* Cabecera Ultra-Limpia - Blanco Total */}
      <header className="h-[56px] bg-white text-slate-800 px-4 flex items-center justify-between border-b border-slate-50 relative z-10 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Botón de Retroceso Sencillo */}
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 active:scale-90 transition-all shrink-0"
            aria-label="Volver"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-[13px] font-semibold text-slate-500 truncate leading-tight">
              {lesson.title}
            </h3>
            <span className="text-[7px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-0.5">
              BIBLIOTECA TÉCNICA ISTAH
            </span>
          </div>
        </div>

        <div className="flex items-center">
          {/* Botón de Pantalla Completa Circular Minimalista */}
          <button 
            onClick={toggleFullscreen}
            className="w-9 h-9 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center active:scale-90 transition-all border border-slate-100/50"
            title="Pantalla Completa"
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
            )}
          </button>
        </div>
      </header>

      {/* Área de Visualización del PDF - Optimizada para Tacto */}
      <div 
        className="flex-1 bg-white relative overflow-hidden flex items-center justify-center" 
        style={{ 
          touchAction: 'pan-x pan-y pinch-zoom',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <iframe
          src={getDriveDirectUrl(lesson.driveId)}
          allow="fullscreen"
          loading="lazy"
          className="w-full h-full border-none hide-scrollbar"
          title={lesson.title}
          style={{ 
             width: '100%',
             height: '100%',
             border: 'none',
             touchAction: 'auto',
             WebkitOverflowScrolling: 'touch',
             backgroundColor: 'white'
          }}
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
      `}} />
    </div>
  );
};

export default Reader;
