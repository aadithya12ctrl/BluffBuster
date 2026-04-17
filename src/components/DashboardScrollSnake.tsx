import React from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

export default function DashboardScrollSnake() {
  const progress = useScrollProgress();

  const thresholds = [0.15, 0.35, 0.55, 0.75, 0.90];
  const eatenCount = thresholds.filter(p => progress > p).length;
  // Let the snake start with 1 head and 2 body segments.
  const bodySegments = Array.from({ length: 3 + eatenCount });

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[3px] z-[1000] bg-transparent">
        <div 
          className="h-full bg-green-forensic shadow-[0_0_10px_#00C896]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* LEFT Snake Background Track */}
      <div className="fixed top-0 left-[2%] w-[80px] h-[100vh] z-0 pointer-events-none opacity-60 mix-blend-screen overflow-hidden hidden md:block">
        {/* The Edibles */}
        <div className="absolute w-full h-full text-center">
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-amber-forensic transition-opacity duration-75" style={{ opacity: progress > 0.15 ? 0 : 0.8 }}>#</div>
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-green-forensic transition-opacity duration-75" style={{ opacity: progress > 0.35 ? 0 : 0.8 }}>X</div>
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-red-forensic transition-opacity duration-75" style={{ opacity: progress > 0.55 ? 0 : 0.8 }}>?</div>
          <div className="absolute top-[75%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-amber-forensic transition-opacity duration-75" style={{ opacity: progress > 0.75 ? 0 : 0.8 }}>!</div>
          <div className="absolute top-[90%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-red-forensic transition-opacity duration-75" style={{ opacity: progress > 0.90 ? 0 : 0.8 }}>$</div>
        </div>

        {/* The Snake */}
        <div className="absolute left-0 w-full flex flex-col items-center gap-[2px]" style={{ top: `${progress * 100}%`, transform: 'translateY(-100%)' }}>
          {bodySegments.map((_, i) => (
             <div key={i} className="w-7 h-7 border-[3px] border-background shadow-[0_0_8px_rgba(0,200,150,0.5)] bg-green-forensic relative shrink-0">
                {i === bodySegments.length - 1 && (
                  <>
                    <div className="absolute bottom-1 left-[3px] w-1.5 h-1.5 bg-background"></div>
                    <div className="absolute bottom-1 right-[3px] w-1.5 h-1.5 bg-background"></div>
                  </>
                )}
             </div>
          ))}
        </div>
      </div>

      {/* RIGHT Snake Background Track */}
      <div className="fixed top-0 right-[2%] w-[80px] h-[100vh] z-0 pointer-events-none opacity-60 mix-blend-screen overflow-hidden hidden md:block">
        {/* The Edibles */}
        <div className="absolute w-full h-full text-center">
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-green-forensic transition-opacity duration-75" style={{ opacity: progress > 0.15 ? 0 : 0.8 }}>$</div>
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-red-forensic transition-opacity duration-75" style={{ opacity: progress > 0.35 ? 0 : 0.8 }}>!</div>
          <div className="absolute top-[55%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-amber-forensic transition-opacity duration-75" style={{ opacity: progress > 0.55 ? 0 : 0.8 }}>?</div>
          <div className="absolute top-[75%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-red-forensic transition-opacity duration-75" style={{ opacity: progress > 0.75 ? 0 : 0.8 }}>X</div>
          <div className="absolute top-[90%] left-1/2 -translate-x-1/2 font-pixel text-4xl text-green-forensic transition-opacity duration-75" style={{ opacity: progress > 0.90 ? 0 : 0.8 }}>#</div>
        </div>

        {/* The Snake */}
        <div className="absolute left-0 w-full flex flex-col items-center gap-[2px]" style={{ top: `${progress * 100}%`, transform: 'translateY(-100%)' }}>
          {bodySegments.map((_, i) => (
             <div key={i} className="w-7 h-7 border-[3px] border-background shadow-[0_0_8px_rgba(0,200,150,0.5)] bg-green-forensic relative shrink-0">
                {i === bodySegments.length - 1 && (
                  <>
                    <div className="absolute bottom-1 left-[3px] w-1.5 h-1.5 bg-background"></div>
                    <div className="absolute bottom-1 right-[3px] w-1.5 h-1.5 bg-background"></div>
                  </>
                )}
             </div>
          ))}
        </div>
      </div>
    </>
  );
}
