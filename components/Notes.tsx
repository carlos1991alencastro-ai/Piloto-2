
import React, { useState, useEffect } from 'react';
import { Note } from '../types';

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('agro_apuntes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const deleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('agro_apuntes', JSON.stringify(updated));
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-black text-agroDark tracking-tight">Mis Apuntes</h2>
                <p className="text-agroMuted font-medium italic">Sistema de citas automatizado</p>
            </div>
            <div className="w-12 h-12 bg-agroGreen text-agroDark rounded-2xl flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(24,232,24,0.4)] font-black text-xl">
                99
            </div>
        </div>

        {notes.length === 0 ? (
            <div className="bg-white p-12 rounded-32px shadow-card border border-agroGreen/5 text-center space-y-4">
                <div className="w-20 h-20 bg-agroCream mx-auto rounded-full flex items-center justify-center text-4xl opacity-50">
                    ✍️
                </div>
                <h3 className="text-lg font-bold text-agroDark">No hay citas guardadas</h3>
                <p className="text-sm text-agroMuted leading-relaxed">
                    Usa el botón <span className="text-agroGreen font-black">99</span> dentro del lector de PDF para capturar automáticamente el texto seleccionado.
                </p>
            </div>
        ) : (
            <div className="space-y-4">
                {notes.map((note) => (
                    <div key={note.id} className="bg-white p-6 rounded-32px shadow-card border border-transparent relative group">
                        <button 
                            onClick={() => deleteNote(note.id)}
                            className="absolute top-4 right-4 text-agroMuted hover:text-red-500 transition-colors p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>

                        <div className="pr-10">
                            <span className="inline-block px-3 py-1 bg-agroGreen/10 text-agroGreen text-[10px] font-black tracking-widest uppercase rounded-full mb-3">
                                {note.lessonTitle}
                            </span>
                            <p className="text-agroDark font-medium leading-relaxed italic text-sm">
                                "{note.text}"
                            </p>
                            <div className="mt-4 pt-4 border-t border-agroCream flex items-center justify-between">
                                <span className="text-[10px] text-agroMuted font-bold uppercase tracking-widest">GUARDADO EL {note.date}</span>
                                <div className="text-agroGreen opacity-20">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16C10.9124 16 10.017 16.8954 10.017 18L10.017 21H4.017V15H7.017C8.12157 15 9.017 14.1046 9.017 13C9.017 11.8954 8.12157 11 7.017 11H4.017V5H10.017V8C10.017 9.10457 10.9124 10 12.017 10C13.1216 10 14.017 9.10457 14.017 8V5H20.017V11H17.017C15.9124 11 15.017 11.8954 15.017 13C15.017 14.1046 15.9124 15 17.017 15H20.017V21H14.017Z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

export default Notes;
