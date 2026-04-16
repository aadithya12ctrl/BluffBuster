import React from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

export default function ScrollProgress() {
  // Use the GSAP-backed ScrollTrigger hook which perfectly syncs with the app's Lenis scroll engine
  const progress = useScrollProgress();

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[3px] z-[1000] bg-background">
        <div 
          className="h-full bg-red-forensic"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* LEFT Pacman Background Track */}
      <div className="fixed top-0 left-[2%] w-[80px] h-[100vh] z-0 pointer-events-none opacity-60 mix-blend-screen overflow-hidden hidden md:block">
        {/* The Edibles */}
        <div className="absolute w-full h-full">
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-amber-forensic transition-opacity duration-75" style={{ opacity: progress > 0.15 ? 0 : 0.8 }}>#</div>
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-green-forensic transition-opacity duration-75" style={{ opacity: progress > 0.35 ? 0 : 0.8 }}>X</div>
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-red-forensic transition-opacity duration-75" style={{ opacity: progress > 0.55 ? 0 : 0.8 }}>?</div>
          <div className="absolute top-[75%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-amber-forensic transition-opacity duration-75" style={{ opacity: progress > 0.75 ? 0 : 0.8 }}>!</div>
          <div className="absolute top-[90%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-red-forensic transition-opacity duration-75" style={{ opacity: progress > 0.90 ? 0 : 0.8 }}>$</div>
        </div>

        {/* The Pacman */}
        <div className="absolute left-0 w-full flex justify-center" style={{ top: `calc(${progress * 100}% - 40px)` }}>
          <div className="pacman-down drop-shadow-2xl"></div>
        </div>
      </div>

      {/* RIGHT Pacman Background Track */}
      <div className="fixed top-0 right-[2%] w-[80px] h-[100vh] z-0 pointer-events-none opacity-60 mix-blend-screen overflow-hidden hidden md:block">
        {/* The Edibles */}
        <div className="absolute w-full h-full">
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-green-forensic transition-opacity duration-75" style={{ opacity: progress > 0.15 ? 0 : 0.8 }}>$</div>
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-red-forensic transition-opacity duration-75" style={{ opacity: progress > 0.35 ? 0 : 0.8 }}>!</div>
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-amber-forensic transition-opacity duration-75" style={{ opacity: progress > 0.55 ? 0 : 0.8 }}>?</div>
          <div className="absolute top-[75%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-red-forensic transition-opacity duration-75" style={{ opacity: progress > 0.75 ? 0 : 0.8 }}>X</div>
          <div className="absolute top-[90%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-green-forensic transition-opacity duration-75" style={{ opacity: progress > 0.90 ? 0 : 0.8 }}>#</div>
        </div>

        {/* The Pacman */}
        <div className="absolute left-0 w-full flex justify-center" style={{ top: `calc(${progress * 100}% - 40px)` }}>
          <div className="pacman-down drop-shadow-2xl"></div>
        </div>
      </div>
    </>
  );
}
