
import React, { useState, useEffect, useRef } from 'react';
import { CarpetaApunte, MultimediaItem } from '../types';

const Notes: React.FC = () => {
  const [carpetas, setCarpetas] = useState<CarpetaApunte[]>([]);
  const [activeCarpetaId, setActiveCarpetaId] = useState<string | null>(null);
  const [newCarpetaNombre, setNewCarpetaNombre] = useState('');
  const [activeTab, setActiveTab] = useState<'NOTAS' | 'MULTIMEDIA'>('NOTAS');
  const [selectedMedia, setSelectedMedia] = useState<MultimediaItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<{ carpetaId: string, itemId: string } | null>(null);
  
  // Estados para grabación de audio
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('agro_carpetas_notas');
    if (saved) setCarpetas(JSON.parse(saved));
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const saveToStorage = (updatedCarpetas: CarpetaApunte[]) => {
    localStorage.setItem('agro_carpetas_notas', JSON.stringify(updatedCarpetas));
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
    saveToStorage(updated);
    setNewCarpetaNombre('');
  };

  const actualizarContenido = (id: string, text: string) => {
    const updated = carpetas.map(c => 
      c.id === id ? { ...c, contenido: text, fecha: Date.now() } : c
    );
    setCarpetas(updated);
    saveToStorage(updated);
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
      saveToStorage(updated);
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
          saveToStorage(updated);
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

  // --- COMPARTIR ARCHIVO ---
  const compartirArchivo = async (item: MultimediaItem) => {
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const extension = item.type === 'audio' ? 'webm' : item.type === 'photo' ? 'jpg' : 'mp4';
      const file = new File([blob], `${item.name.replace(/[^a-z0-9]/gi, '_')}.${extension}`, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: item.name,
          text: 'Enviado desde AgroLearn ISTAH'
        });
      } else if (navigator.share) {
        await navigator.share({
          title: item.name,
          text: `Mira este registro: ${item.name}`,
          url: window.location.href
        });
      } else {
        alert('Tu navegador no soporta la función de compartir.');
      }
    } catch (err) {
      console.error('Error al compartir:', err);
    }
  };

  // --- LÓGICA DE BORRADO DIRECTO Y DEFINITIVO ---

  const confirmarEliminarMedia = () => {
    if (mediaToDelete) {
      const { carpetaId, itemId } = mediaToDelete;
      const updated = carpetas.map(c => {
        if (c.id === carpetaId) {
          return {
            ...c,
            multimedia: c.multimedia.filter(m => m.id !== itemId)
          };
        }
        return c;
      });
      setCarpetas(updated);
      localStorage.setItem('agro_carpetas_notas', JSON.stringify(updated));
      showToast('MEMORIA LIBERADA EXITOSAMENTE');
      setMediaToDelete(null);
    }
  };

  const confirmarEliminarCarpeta = () => {
    if (folderToDelete) {
      const updated = carpetas.filter(c => c.id !== folderToDelete);
      setCarpetas(updated);
      localStorage.setItem('agro_carpetas_notas', JSON.stringify(updated));
      showToast('MEMORIA LIBERADA EXITOSAMENTE');
      setFolderToDelete(null);
    }
  };

  const activeCarpeta = carpetas.find(c => c.id === activeCarpetaId);

  // --- RENDERIZADO ---

  const renderMultimediaCard = (item: MultimediaItem) => (
    <div key={item.id} className="bg-white p-4 rounded-32px shadow-card border border-agroGreen/5 flex flex-col gap-3 transition-all">
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
        <div className="flex items-center gap-1">
          {/* ICONO COMPARTIR - MANTENIDO INTACTO */}
          <button 
            onClick={() => compartirArchivo(item)} 
            className="p-2 text-agroGreen/60 hover:text-agroGreen transition-colors shrink-0"
            title="Compartir"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </button>
          {/* BOTÓN BASURERO - CORREGIDO PARA BORRADO DIRECTO */}
          <button 
            onClick={() => setMediaToDelete({ carpetaId: activeCarpeta!.id, itemId: item.id })} 
            className="p-2 text-red-300 hover:text-red-500 transition-colors shrink-0"
            title="Borrar permanentemente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-2xl bg-agroCream/30 relative">
        {item.type === 'audio' && (
          <audio controls src={item.url} className="w-full h-10" />
        )}
        {item.type === 'photo' && (
          <img 
            src={item.url} 
            alt={item.name} 
            className="w-full h-32 object-cover cursor-pointer" 
            onClick={() => setSelectedMedia(item)}
          />
        )}
        {item.type === 'video' && (
          <video controls src={item.url} className="w-full h-40 object-cover" />
        )}
      </div>
    </div>
  );

  if (activeCarpetaId && activeCarpeta) {
    return (
      <div className="p-6 h-full flex flex-col animate-fade-in bg-agroCream">
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[250] bg-agroDark text-white px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl animate-slide-in">
            {toast}
          </div>
        )}
        
        {/* MODAL DE CONFIRMACIÓN ESTILIZADO PARA MULTIMEDIA */}
        {mediaToDelete && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-fade-in">
            <div className="absolute inset-0 bg-agroDark/40 backdrop-blur-sm" onClick={() => setMediaToDelete(null)}></div>
            <div className="bg-white w-full max-w-sm rounded-32px p-8 shadow-2xl relative z-10 animate-slide-in border border-agroGreen/10">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </div>
              <h3 className="text-xl font-black text-agroDark text-center uppercase leading-tight mb-3">¿ELIMINAR PERMANENTEMENTE?</h3>
              <p className="text-agroMuted text-center text-sm font-medium leading-relaxed mb-8">
                Esta acción borrará este archivo multimedia. No se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setMediaToDelete(null)}
                  className="flex-1 py-4 text-[11px] font-black text-agroDark uppercase tracking-widest bg-agroCream rounded-2xl active:scale-95 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmarEliminarMedia}
                  className="flex-1 py-4 text-[11px] font-black text-white uppercase tracking-widest bg-red-500 rounded-2xl shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

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
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2 2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
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
    <div className="p-6 space-y-8 animate-fade-in bg-agroCream min-h-full flex flex-col pb-32">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[250] bg-agroDark text-white px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl animate-slide-in">
          {toast}
        </div>
      )}
      
      {/* MODAL DE CONFIRMACIÓN ESTILIZADO PARA CARPETAS */}
      {folderToDelete && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-agroDark/40 backdrop-blur-sm" onClick={() => setFolderToDelete(null)}></div>
          <div className="bg-white w-full max-w-sm rounded-32px p-8 shadow-2xl relative z-10 animate-slide-in border border-agroGreen/10">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </div>
            <h3 className="text-xl font-black text-agroDark text-center uppercase leading-tight mb-3">¿ELIMINAR PERMANENTEMENTE?</h3>
            <p className="text-agroMuted text-center text-sm font-medium leading-relaxed mb-8">
              Esta acción borrará todas las notas y archivos multimedia de esta clase. No se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setFolderToDelete(null)}
                className="flex-1 py-4 text-[11px] font-black text-agroDark uppercase tracking-widest bg-agroCream rounded-2xl active:scale-95 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminarCarpeta}
                className="flex-1 py-4 text-[11px] font-black text-white uppercase tracking-widest bg-red-500 rounded-2xl shadow-lg shadow-red-500/20 active:scale-95 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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
            <button 
              onClick={(e) => { e.stopPropagation(); setFolderToDelete(carpeta.id); }} 
              className="p-3 text-red-200 hover:text-red-500 transition-colors shrink-0"
              title="Borrar clase permanentemente"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
