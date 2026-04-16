import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalBackground from './components/GlobalBackground';
import CustomCursor from './components/CustomCursor';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <main className="relative bg-background selection:bg-red-forensic/30 selection:text-off-white min-h-screen">
        <div className="crt-overlay" />
        <GlobalBackground />
        
        {/* Deep Animated Dimensional Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-red-forensic/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob"></div>
          <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-amber-forensic/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-green-forensic/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
          
          {/* Global Floating Retro Forensics Elements */}
          <div className="absolute top-[15%] right-[10%] opacity-20 animate-float-slow text-green-forensic text-6xl font-pixel retro-text-3d" style={{filter: 'drop-shadow(2px 2px 0px rgba(0, 200, 150, 0.4))'}}>$</div>
          <div className="absolute bottom-[15%] left-[5%] opacity-20 animate-float-fast text-red-forensic text-8xl font-pixel retro-text-3d">!</div>
          <div className="absolute top-[45%] left-[2%] opacity-10 animate-float-slow text-amber-forensic text-5xl font-pixel retro-text-3d">?</div>
          <div className="absolute bottom-[25%] right-[5%] opacity-15 animate-float-fast text-red-forensic text-7xl font-pixel retro-text-3d">X</div>
          <div className="absolute top-[80%] right-[30%] opacity-15 animate-float-slow text-green-forensic text-6xl font-pixel retro-text-3d">%</div>
          <div className="absolute top-[5%] left-[30%] opacity-10 animate-float-fast text-amber-forensic text-4xl font-pixel retro-text-3d">#</div>
        </div>

        <CustomCursor />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard/:sessionId" element={<Dashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
