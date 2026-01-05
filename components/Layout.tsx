
import React from 'react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const tabs = [
    { id: 'HOME' as ViewState, label: 'INICIO', icon: (active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    )},
    { id: 'MODULES' as ViewState, label: 'MÓDULOS', icon: (active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
    )},
    { id: 'NOTES' as ViewState, label: 'APUNTES', icon: (active: boolean) => (
       <div className={`font-black text-lg ${active ? 'text-agroGreen' : 'text-gray-400'}`}>99</div>
    )},
    { id: 'PROFILE' as ViewState, label: 'PERFIL', icon: (active: boolean) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    )}
  ];

  return (
    <div className="min-h-screen bg-agroCream flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-xl border-t border-agroGreen/10 px-6 py-4 rounded-t-32px shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-40 safe-bottom">
        <div className="flex justify-between items-center">
          {tabs.map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-40 grayscale'}`}
              >
                <div className={`p-2 rounded-2xl ${isActive ? 'bg-agroGreen/20 text-agroGreen' : 'text-agroDark'}`}>
                  {tab.icon(isActive)}
                </div>
                <span className={`text-[9px] font-extrabold tracking-widest ${isActive ? 'text-agroDark' : 'text-gray-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
