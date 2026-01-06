
import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import Layout from './components/Layout';
import Home from './components/Home';
import Modules from './components/Modules';
import Notes from './components/Notes';
import Profile from './components/Profile';
import Reader from './components/Reader';
import { ViewState, Lesson } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('WELCOME');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>(undefined);

  const handleEnter = () => {
    setView('HOME');
  };

  const handleModuleSelect = (unitId?: string) => {
    setSelectedUnitId(unitId);
    setView('MODULES');
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setView('READER');
  };

  const renderContent = () => {
    switch (view) {
      case 'HOME':
        return <Home onModuleSelect={handleModuleSelect} />;
      case 'MODULES':
        return <Modules onLessonSelect={handleLessonSelect} initialUnitId={selectedUnitId} />;
      case 'NOTES':
        return <Notes />;
      case 'PROFILE':
        return <Profile />;
      case 'READER':
        return selectedLesson ? (
          <Reader 
            lesson={selectedLesson} 
            onClose={() => setView('MODULES')} 
          />
        ) : null;
      default:
        return <Home onModuleSelect={handleModuleSelect} />;
    }
  };

  if (view === 'WELCOME') {
    return <Welcome onEnter={handleEnter} />;
  }

  return (
    <Layout activeView={view} onViewChange={(v) => {
      if (v !== 'MODULES') setSelectedUnitId(undefined);
      setView(v);
    }}>
      {renderContent()}
    </Layout>
  );
};

export default App;
