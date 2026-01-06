
import React, { useState, useEffect, useRef } from 'react';
import { CarpetaApunte, MultimediaItem } from '../types';

const Notes: React.FC = () => {
  const [carpetas, setCarpetas] = useState<CarpetaApunte[]>([]);
  const [carpetasBorradas, setCarpetasBorradas] = useState<CarpetaApunte[]>([]);
  const [activeCarpetaId, setActiveCarpetaId] = useState<string | null>(null);
  const [newCarpetaNombre, setNewCarpetaNombre] = useState('');
  const [activeTab, setActiveTab] = useState<'NOTAS' | 'MULTIMEDIA'>('NOTAS');
  const [selectedMedia, setSelectedMedia] = useState<MultimediaItem | null>(null);
  
  // Estados para grabación de audio
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('agro_carpetas_notas');
    if (saved) setCarpetas(JSON.parse(saved));
    const savedTrash = localStorage.getItem('agro_carpetas_papelera');
    if (savedTrash) setCarpetasBorradas(JSON.parse(savedTrash));
  }, []);

  const saveToStorage = (updatedCarpetas: CarpetaApunte[], updatedTrash: CarpetaApunte[]) => {
    localStorage.setItem('agro_carpetas_notas', JSON.stringify(updatedCarpetas));
    localStorage.setItem('agro_carpetas_papelera', JSON.stringify(updatedTrash));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const crearCarpeta = () => {
    if (!newCarpetaNombre.trim()) return;
    const nueva: CarpetaApunte = {
      id: Date.now().toString(),
      nombre: newCarpetaNombre.trim(),
      contenido: '',
      fecha: Date.now(),
      multimedia: [],
      papeleraMultimedia: []
    };
    const updated = [nueva, ...carpetas];
    setCarpetas(updated);
    saveToStorage(updated, carpetasBorradas);
    setNewCarpetaNombre('');
  };

  const actualizarContenido = (id: string, text: string) => {
    const updated = carpetas.map(c => 
      c.id === id ? { ...c, contenido: text, fecha: Date.now() } : c
    );
    setCarpetas(updated);
    saveToStorage(updated, carpetasBorradas);
  };

  // --- CAPTURA MULTIMEDIA ---

  const handleCaptureFile = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video') => {
    const file = e.target.files?.[0];
    if (!file || !activeCarpetaId) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const newItem: MultimediaItem = {
        id: Date.now().toString(),
        type,
        url: base64data,
        name: `${type.toUpperCase()} - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        fecha: Date.now()
      };
      const updated = carpetas.map(c => 
        c.id === activeCarpetaId ? { ...c, multimedia: [newItem, ...c.multimedia] } : c
      );
      setCarpetas(updated);
      saveToStorage(updated, carpetasBorradas);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      setRecordTime(0);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const newItem: MultimediaItem = {
            id: Date.now().toString(),
            type: 'audio',
            url: reader.result as string,
            name: `AUDIO - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            fecha: Date.now()
          };
          const updated = carpetas.map(c => 
            c.id === activeCarpetaId ? { ...c, multimedia: [newItem, ...c.multimedia] } : c
          );
          setCarpetas(updated);
          saveToStorage(updated, carpetasBorradas);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRecordTime(0);
      };

      recorder.start();
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Permiso de micrófono denegado.");
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- FUNCIONES DE PAPELERA CON GUARDADO INMEDIATO ---

  const moverMultimediaAPapelera = (carpetaId: string, itemId: string) => {
    const updated = carpetas.map(c => {
      if (c.id === carpetaId) {
        const item = c.multimedia.find(m => m.id === itemId);
        if (item) {
          return {
            ...c,
            multimedia: c.multimedia.filter(m => m.id !== itemId),
            papeleraMultimedia: [item, ...c.papeleraMultimedia]
          };
        }
      }
      return c;
    });
    setCarpetas(updated);
    saveToStorage(updated, carpetasBorradas);
  };

  const restaurarMultimedia = (carpetaId: string, itemId: string) => {
    const updated = carpetas.map(c => {
      if (c.id === carpetaId) {
        const item = c.papeleraMultimedia.find(m => m.id === itemId);
        if (item) {
          return {
            ...c,
            papeleraMultimedia: c.papeleraMultimedia.filter(m => m.id !== itemId),
            multimedia: [item, ...c.multimedia]
          };
        }
      }
      return c;
    });
    setCarpetas(updated);
    saveToStorage(updated, carpetasBorradas);
  };

  const eliminarMultimediaPermanente = (carpetaId: string, itemId: string) => {
    if (confirm('¿Borrar permanentemente este archivo multimedia? Esta acción es irreversible.')) {
      const updated = carpetas.map(c => 
        c.id === carpetaId ? { ...c, papeleraMultimedia: c.papeleraMultimedia.filter(m => m.id !== itemId) } : c
      );
      setCarpetas(updated);
      saveToStorage(updated, carpetasBorradas);
    }
  };

  const moverCarpetaAPapelera = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const carpeta = carpetas.find(c => c.id === id);
    if (carpeta) {
      const updated = carpetas.filter(c => c.id !== id);
      const updatedTrash = [carpeta, ...carpetasBorradas];
      setCarpetas(updated);
      setCarpetasBorradas(updatedTrash);
      saveToStorage(updated, updatedTrash);
    }
  };

  const restaurarCarpeta = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const carpeta = carpetasBorradas.find(c => c.id === id);
    if (carpeta) {
      const updatedTrash = carpetasBorradas.filter(c => c.id !== id);
      const updated = [carpeta, ...carpetas];
      setCarpetas(updated);
      setCarpetasBorradas(updatedTrash);
      saveToStorage(updated, updatedTrash);
    }
  };

  const eliminarCarpetaPermanente = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('¿Borrar definitivamente esta clase? Se perderán todas las notas y archivos asociados.')) {
      const updatedTrash = carpetasBorradas.filter(c => c.id !== id);
      setCarpetasBorradas(updatedTrash);
      saveToStorage(carpetas, updatedTrash);
    }
  };

  const activeCarpeta = carpetas.find(c => c.id === activeCarpetaId);

  // --- RENDERIZADO ---

  const renderMultimediaCard = (item: MultimediaItem, isTrash: boolean = false) => (
    <div key={item.id} className={`bg-white p-4 rounded-32px shadow-card border border-agroGreen/5 flex flex-col gap-3 transition-all ${isTrash ? 'opacity-60 grayscale' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="w-10 h-10 bg-agroCream rounded-full flex items-center justify-center text-agroGreen shadow-sm shrink-0 border border-agroGreen/10">
            {item.type === 'audio' ? '🎙️' : item.type === 'photo' ? '📸' : '🎥'}
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-agroDark uppercase tracking-widest leading-snug whitespace-normal break-words">{item.name}</p>
            <p className="text-[8px] text-agroMuted font-bold uppercase">{new Date(item.fecha).toLocaleDateString()}</p>
          </div>
        </div>
        {!isTrash && (
          <button onClick={() => moverMultimediaAPapelera(activeCarpeta!.id, item.id)} className="p-2 text-red-300 hover:text-red-500 transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        )}
      </div>

      <div className="w-full overflow-hidden rounded-2xl bg-agroCream/30">
        {item.type === 'audio' && (
          <audio controls src={item.url} className="w-full h-10" />
        )}
        {item.type === 'photo' && (
          <img 
            src={item.url} 
            alt={item.name} 
            className="w-full h-32 object-cover cursor-pointer" 
            onClick={() => !isTrash && setSelectedMedia(item)}
          />
        )}
        {item.type === 'video' && (
          <video controls src={item.url} className="w-full h-40 object-cover" />
        )}
      </div>

      {isTrash && (
        <div className="flex gap-2 mt-1">
          <button onClick={() => restaurarMultimedia(activeCarpeta!.id, item.id)} className="flex-1 py-2 bg-agroGreen/10 text-agroGreen text-[9px] font-black rounded-xl uppercase tracking-widest active:scale-95 transition-all">Restaurar</button>
          <button onClick={() => eliminarMultimediaPermanente(activeCarpeta!.id, item.id)} className="flex-1 py-2 bg-red-50 text-red-500 text-[9px] font-black rounded-xl uppercase tracking-widest active:scale-95 transition-all">Borrar</button>
        </div>
      )}
    </div>
  );

  if (activeCarpetaId && activeCarpeta) {
    return (
      <div className="p-6 h-full flex flex-col animate-fade-in bg-agroCream">
        <header className="flex items-center justify-between mb-4">
          <button onClick={() => { setActiveCarpetaId(null); setActiveTab('NOTAS'); }} className="flex items-center gap-2 text-agroDark font-black group">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-card group-hover:bg-agroGreen transition-colors group-hover:text-white border border-agroGreen/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </div>
            VOLVER
          </button>
          <div className="text-right">
             <h3 className="font-black text-agroDark uppercase text-[10px] tracking-widest whitespace-normal break-words max-w-[150px] leading-tight">{activeCarpeta.nombre}</h3>
             <span className="text-[9px] text-agroGreen font-black uppercase tracking-widest flex items-center justify-end gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-agroGreen animate-pulse"></span>
                AUTOGUARDADO
             </span>
          </div>
        </header>

        <div className="bg-white/60 p-1 rounded-2xl flex shadow-sm border border-agroGreen/10 mb-6">
          <button onClick={() => setActiveTab('NOTAS')} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${activeTab === 'NOTAS' ? 'bg-white text-agroGreen shadow-sm ring-1 ring-agroGreen/10' : 'text-agroMuted'}`}>NOTAS</button>
          <button onClick={() => setActiveTab('MULTIMEDIA')} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all ${activeTab === 'MULTIMEDIA' ? 'bg-white text-agroGreen shadow-sm ring-1 ring-agroGreen/10' : 'text-agroMuted'}`}>MULTIMEDIA</button>
        </div>

        {activeTab === 'NOTAS' ? (
          <div className="flex-1 bg-white rounded-32px shadow-card border border-agroGreen/5 overflow-hidden flex flex-col">
              <textarea
                  value={activeCarpeta.contenido}
                  onChange={(e) => actualizarContenido(activeCarpeta.id, e.target.value)}
                  placeholder="Apuntes de campo..."
                  className="w-full h-full p-8 text-agroDark font-medium leading-relaxed resize-none focus:outline-none bg-transparent placeholder:text-agroMuted/20 text-base"
                  autoFocus
              />
          </div>
        ) : (
          <div className="flex-1 space-y-6 overflow-y-auto hide-scrollbar pb-10">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2">
                <button onClick={isRecording ? stopRecordingAudio : startRecordingAudio} className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${isRecording ? 'bg-red-500 text-white' : 'bg-white text-agroGreen border border-agroGreen/10'}`}>
                  {isRecording ? <div className="w-4 h-4 bg-white rounded-sm"></div> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>}
                </button>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isRecording ? 'text-red-500 animate-pulse' : 'text-agroDark'}`}>
                  {isRecording ? formatTime(recordTime) : 'Audio'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <label className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-agroGreen shadow-lg active:scale-95 transition-all cursor-pointer border border-agroGreen/10">
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleCaptureFile(e, 'photo')} />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </label>
                <span className="text-[10px] font-black uppercase tracking-widest text-agroDark">Cámara</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <label className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-agroGreen shadow-lg active:scale-95 transition-all cursor-pointer border border-agroGreen/10">
                  <input type="file" accept="video/*" capture="environment" className="hidden" onChange={(e) => handleCaptureFile(e, 'video')} />
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                </label>
                <span className="text-[10px] font-black uppercase tracking-widest text-agroDark">Video</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-agroDark uppercase tracking-[0.2em] ml-2">Galería de Registros</h4>
              <div className="grid gap-4">
                {activeCarpeta.multimedia.length === 0 ? (
                  <div className="bg-white/50 border border-dashed border-agroGreen/10 p-10 rounded-32px text-center opacity-30">
                    <p className="text-[9px] font-bold uppercase tracking-widest">Lista multimedia vacía</p>
                  </div>
                ) : (
                  activeCarpeta.multimedia.map(item => renderMultimediaCard(item))
                )}
              </div>
            </div>

            {activeCarpeta.papeleraMultimedia.length > 0 && (
              <div className="pt-6 border-t border-agroGreen/10 space-y-4">
                <h4 className="text-[10px] font-black text-agroMuted uppercase tracking-[0.2em] ml-2">Papelera Multimedia</h4>
                <div className="grid gap-4">
                  {activeCarpeta.papeleraMultimedia.map(item => renderMultimediaCard(item, true))}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedMedia && (
          <div className="fixed inset-0 bg-agroDark/95 z-[200] flex flex-col animate-fade-in p-6" onClick={() => setSelectedMedia(null)}>
            <button className="self-end w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className="flex-1 flex items-center justify-center">
              <img src={selectedMedia.url} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" alt="Preview" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-fade-in bg-agroCream min-h-full flex flex-col">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-agroDark tracking-tight leading-tight uppercase">Mis Apuntes</h2>
          <p className="text-agroMuted font-medium italic text-sm">Biblioteca técnica ISTAH</p>
        </div>
      </header>

      <div className="bg-white p-4 rounded-32px shadow-card border border-agroGreen/10 flex gap-2">
        <input 
          type="text" 
          value={newCarpetaNombre} 
          onChange={(e) => setNewCarpetaNombre(e.target.value)} 
          placeholder="Nombre de la clase..." 
          className="flex-1 bg-agroCream/50 px-6 py-4 rounded-2xl text-agroDark font-bold focus:outline-none placeholder:text-agroMuted/30 text-sm" 
          onKeyDown={(e) => e.key === 'Enter' && crearCarpeta()} 
        />
        <button onClick={crearCarpeta} className="bg-agroGreen text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>

      <div className="grid gap-4">
        {carpetas.length === 0 && (
          <div className="text-center py-20 opacity-10">
            <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z" /></svg>
            <p className="font-black uppercase tracking-widest text-[11px]">No hay registros</p>
          </div>
        )}
        
        {carpetas.map(carpeta => (
          <div key={carpeta.id} onClick={() => setActiveCarpetaId(carpeta.id)} className="bg-white p-6 rounded-32px shadow-card group active:scale-[0.98] transition-all flex items-center justify-between border border-transparent hover:border-agroGreen/10 cursor-pointer">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-agroCream rounded-full flex items-center justify-center text-agroGreen border border-agroGreen/10 shadow-sm shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-black text-agroDark leading-snug text-lg whitespace-normal break-words overflow-wrap-anywhere uppercase">{carpeta.nombre}</h3>
                <p className="text-[10px] text-agroGreen font-black uppercase tracking-widest mt-1">{carpeta.multimedia.length} REGISTROS</p>
              </div>
            </div>
            <button onClick={(e) => moverCarpetaAPapelera(e, carpeta.id)} className="p-3 text-red-200 hover:text-red-500 transition-colors shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        ))}
      </div>

      {carpetasBorradas.length > 0 && (
        <div className="pt-8 pb-32 space-y-4">
          <h4 className="text-[10px] font-black text-agroMuted uppercase tracking-widest px-2">Historial de Papelera</h4>
          <div className="grid gap-3">
            {carpetasBorradas.map(carpeta => (
              <div key={carpeta.id} className="bg-white/40 p-5 rounded-32px border border-dashed border-agroMuted/20 flex items-center justify-between opacity-70">
                <div className="overflow-hidden pr-2 flex-1">
                  <span className="font-black text-agroDark uppercase text-[11px] block whitespace-normal break-words leading-tight">{carpeta.nombre}</span>
                  <span className="text-[8px] text-agroMuted font-bold uppercase block mt-0.5">Pendiente de borrado</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={(e) => restaurarCarpeta(e, carpeta.id)} className="w-10 h-10 text-agroGreen bg-white rounded-2xl shadow-sm border border-agroGreen/5 active:scale-90 transition-all flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  </button>
                  <button onClick={(e) => eliminarCarpetaPermanente(e, carpeta.id)} className="w-10 h-10 text-red-500 bg-white rounded-2xl shadow-sm border border-red-50 active:scale-90 transition-all flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
