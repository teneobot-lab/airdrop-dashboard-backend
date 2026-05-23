import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { ToastProvider, useToast } from './components/Toast';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Wallets } from './pages/Wallets';
import { Activity } from './pages/Activity';
import { statsService } from './services/statsService';
import type { Stats } from './types';

const AppContent: React.FC = () => {
  const location = useLocation();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    statsService.get().then(setStats).catch(console.error);
  }, [location.pathname]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="min-h-screen bg-cream-200">
      <Sidebar />
      <div className={`transition-all duration-300 ${isMobile ? '' : 'md:ml-60'}`}>
        <Header stats={stats} />
        <main className="p-4 md:p-6 pb-24 md:pb-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/wallets" element={<Wallets />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;