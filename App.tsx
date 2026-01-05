
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

  useEffect(() => {
    // Basic Fade-in Animation utility classes would be injected here if needed via CSS
    // but we use Tailwind's animate-fade-in custom class (already configured if standard, otherwise we can use a generic one)
  }, []);

  const handleEnter = () => {
    setView('HOME');
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setView('READER');
  };

  const renderContent = () => {
    switch (view) {
      case 'HOME':
        return <Home onModuleSelect={() => setView('MODULES')} />;
      case 'MODULES':
        return <Modules onLessonSelect={handleLessonSelect} />;
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
        return <Home onModuleSelect={() => setView('MODULES')} />;
    }
  };

  if (view === 'WELCOME') {
    return <Welcome onEnter={handleEnter} />;
  }

  return (
    <Layout activeView={view} onViewChange={setView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
