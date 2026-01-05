
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="p-6 space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
            <div className="relative inline-block">
                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-card border-4 border-agroGreen mx-auto">
                    <img src="https://picsum.photos/seed/farmer/200" className="w-full h-full rounded-full object-cover" alt="Profile" />
                </div>
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-agroGreen rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-black text-agroDark">Estudiante ISTAH</h2>
                <p className="text-agroGreen font-bold tracking-widest uppercase text-xs">Membresía Premium AgroLearn</p>
            </div>
        </div>

        <div className="bg-white rounded-32px shadow-card border border-agroGreen/5 divide-y divide-agroCream overflow-hidden">
            {[
                { label: 'Mis Certificados', icon: '📜' },
                { label: 'Historial de Lectura', icon: '📖' },
                { label: 'Configuración', icon: '⚙️' },
                { label: 'Soporte Técnico', icon: '🛠️' },
                { label: 'Cerrar Sesión', icon: '🚪', color: 'text-red-500' }
            ].map((item, idx) => (
                <button 
                  key={idx}
                  className="w-full p-5 flex items-center justify-between hover:bg-agroCream/20 transition-colors active:scale-[0.99]"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-xl">{item.icon}</span>
                        <span className={`font-bold ${item.color || 'text-agroDark'}`}>{item.label}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-20"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            ))}
        </div>

        <div className="bg-agroDark p-8 rounded-32px text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-agroGreen/10 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-lg font-black mb-2 relative z-10">Misión ISTAH</h3>
            <p className="text-sm text-gray-400 leading-relaxed italic relative z-10">
                "Promoviendo la agricultura regenerativa y sustentable a través de la educación técnica de calidad en toda la región."
            </p>
        </div>
    </div>
  );
};

export default Profile;
