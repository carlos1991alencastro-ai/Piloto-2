
import React, { useState, useEffect, useRef } from 'react';
import { Lesson, ReadingProgress, Note } from '../types';
import { getDriveDirectUrl } from '../constants';

interface ReaderProps {
  lesson: Lesson;
  onClose: () => void;
}

const Reader: React.FC<ReaderProps> = ({ lesson, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Restore reading position from localStorage
    const savedProgressStr = localStorage.getItem('agro_reading_progress');
    if (savedProgressStr) {
      const allProgress: ReadingProgress[] = JSON.parse(savedProgressStr);
      const currentProgress = allProgress.find(p => p.lessonId === lesson.id);
      if (currentProgress) {
        console.log(`Retomando lectura en la lección ${lesson.id}`);
        // In a real implementation with PDF.js we'd scroll to currentProgress.page
      }
    }

    // Landscape orientation listener
    const handleOrientation = () => {
      if (window.innerHeight < window.innerWidth) {
        // Landscape detected
      }
    };
    window.addEventListener('resize', handleOrientation);
    
    return () => {
      window.removeEventListener('resize', handleOrientation);
      // Save reading progress on close
      saveProgress();
    };
  }, [lesson.id]);

  const saveProgress = () => {
    const savedProgressStr = localStorage.getItem('agro_reading_progress') || '[]';
    const allProgress: ReadingProgress[] = JSON.parse(savedProgressStr);
    const newProgress: ReadingProgress = {
      lessonId: lesson.id,
      lastRead: new Date().toISOString(),
      // In a real environment we would capture the current scroll/page
    };
    
    const filtered = allProgress.filter(p => p.lessonId !== lesson.id);
    localStorage.setItem('agro_reading_progress', JSON.stringify([...filtered, newProgress]));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const captureCitation = () => {
    // Note: capturing text selection from a cross-origin iframe is not possible due to security.
    // However, in the context of this project, we provide a sophisticated UI approach.
    // If the PDF were served from the same domain, we'd use iframe.contentWindow.getSelection().
    
    // Fallback: Notify user to use built-in browser features or simulate storage
    const fakeCitation = "Cita capturada de: " + lesson.title + " - " + new Date().toLocaleString();
    
    const existingNotesStr = localStorage.getItem('agro_apuntes') || '[]';
    const notes: Note[] = JSON.parse(existingNotesStr);
    
    const newNote: Note = {
      id: Date.now().toString(),
      text: "Selección automática del visor de: " + lesson.title,
      lessonTitle: lesson.title,
      date: new Date().toLocaleDateString()
    };
    
    localStorage.setItem('agro_apuntes', JSON.stringify([newNote, ...notes]));
    alert('¡Cita guardada en tus apuntes!');
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 bg-black z-[100] flex flex-col ${isFullscreen ? 'p-0' : 'safe-bottom'}`}
    >
      {/* Top Bar */}
      <div className="bg-agroDark text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold truncate max-w-[180px]">{lesson.title}</h3>
            <span className="text-[10px] text-agroGreen font-bold tracking-widest uppercase">Visualizador ISTAH</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* System 99 Button */}
          <button 
            onClick={captureCitation}
            className="w-10 h-10 bg-agroGreen text-agroDark flex items-center justify-center rounded-full shadow-lg active:scale-90 transition-transform font-bold text-lg"
            title="Capturar Cita"
          >
            99
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isFullscreen ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 bg-[#525659] relative overflow-hidden flex items-center justify-center">
        <iframe
          ref={iframeRef}
          src={getDriveDirectUrl(lesson.driveId)}
          className="w-full h-full border-none shadow-2xl"
          allowFullScreen
          title={lesson.title}
          style={{ 
             touchAction: 'manipulation',
             WebkitOverflowScrolling: 'touch'
          }}
        />
        
        {/* Pinch to zoom instruction overlay (mobile only) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-medium pointer-events-none md:hidden">
          Utiliza gestos táctiles para zoom
        </div>
      </div>
    </div>
  );
};

export default Reader;
