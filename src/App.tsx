import { useState } from 'react';
import { Toaster } from "sonner";
import MainLayout from './pages/MainLayout';
import LandingPage from './pages/LandingPage';
import type { ROUTER } from './types/router_types';

function App() {
  const [currentView, setCurrentView] = useState<ROUTER>('intro');
  // 들어가기 버튼 클릭 시 호출
  const enterApp = () => setCurrentView('dashboard');

  return (
    <>
      <Toaster richColors position="top-right" />
      {currentView === 'intro' ? (
        <LandingPage onEnter={enterApp} />
      ) : (
        <MainLayout current_view={currentView} setView={setCurrentView} />
      )}
    </>
  );
}

export default App
