import React from 'react';
import { motion } from 'framer-motion';
import { useModeStore } from '../store/modeStore';

export default function Hero() {
  const setMode = useModeStore((state) => state.setMode);

  const title = "BLUFFBUSTER";
  const characters = title.split("");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050508]">
      
      {/* Background Animated Waves - Custom SVG mimicking the inspiration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Deep Red Background Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-forensic/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-forensic/10 rounded-full blur-[120px]"></div>

        {/* Wavy shape layers - using SVG */}
        <div className="absolute bottom-0 w-full h-[40vh] z-0">
          {/* Back Wave (Greenish) */}
          <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(0, 200, 150, 0.15)" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          {/* Middle Wave (Amber/Redish) */}
          <svg className="absolute bottom-0 w-full h-[85%]" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="rgba(255, 149, 0, 0.15)" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          {/* Front Wave (Dark Ground) */}
          <svg className="absolute bottom-0 w-full h-[60%]" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#0A0A0F" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,117.3C960,139,1056,181,1152,176C1248,171,1344,117,1392,85.3L1440,53.3L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Floating Retro Elements - Forensic / VC Themed */}
      <div className="absolute inset-0 pointer-events-none z-10 select-none">
        <div className="absolute top-[20%] left-[15%] opacity-70 animate-float-slow text-green-forensic text-5xl md:text-7xl font-pixel flex items-center justify-center retro-text-3d" style={{filter: 'drop-shadow(3px 3px 0px rgba(0, 200, 150, 0.4))'}}>$</div>
        <div className="absolute bottom-[30%] left-[10%] opacity-80 animate-float-fast text-red-forensic text-6xl md:text-8xl font-pixel flex items-center justify-center retro-text-3d">!</div>
        <div className="absolute top-[15%] right-[15%] opacity-70 animate-float-fast text-amber-forensic text-5xl md:text-6xl font-pixel flex items-center justify-center" style={{textShadow: '3px 3px 0px rgba(255, 149, 0, 0.4)'}}>?</div>
        <div className="absolute bottom-[25%] right-[10%] opacity-60 animate-float-slow text-red-forensic text-4xl md:text-5xl font-pixel flex items-center justify-center" style={{textShadow: '2px 2px 0px rgba(255, 61, 61, 0.5)'}}>X</div>
        <div className="absolute top-[50%] left-[8%] opacity-50 animate-float-slow text-green-forensic text-3xl font-pixel flex items-center justify-center">%</div>
        <div className="absolute top-[40%] right-[8%] opacity-50 animate-float-fast text-amber-forensic text-4xl font-pixel flex items-center justify-center">#</div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-7xl">
        <h1 className="font-pixel text-[clamp(40px,7vw,100px)] leading-[1.2] flex flex-wrap justify-center overflow-hidden tracking-normal mb-8 retro-text-3d drop-shadow-2xl">
          {characters.map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: -50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
                delay: i * 0.05
              }}
              className="inline-block mx-[2px]"
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <div className="mt-8 mb-16 space-y-5 bg-[#050508]/60 p-6 rounded-lg backdrop-blur-sm border border-white/5">
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="font-pixel text-[12px] md:text-[14px] leading-relaxed text-off-white tracking-[0.1em] uppercase"
          >
            Lies are obvious.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="font-pixel text-[12px] md:text-[14px] leading-relaxed text-amber-forensic tracking-[0.1em] uppercase"
          >
            Exaggerated truths aren't.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-4">
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 1.0 }}
            onClick={() => { setMode('founder'); scrollToSection('founder-mode'); }}
            style={{ '--btn-color': '#00C896', '--btn-color-glow': 'rgba(0, 200, 150, 0.4)' } as any}
            className="retro-button px-8 md:px-12 py-5 text-green-forensic border-green-forensic font-pixel text-[12px] md:text-[14px] tracking-[0.1em] uppercase"
          >
            I'M A FOUNDER
          </motion.button>
          
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 1.2 }}
            onClick={() => { setMode('vc'); scrollToSection('vc-mode'); }}
            style={{ '--btn-color': '#FF9500', '--btn-color-glow': 'rgba(255, 149, 0, 0.4)' } as any}
            className="retro-button px-8 md:px-12 py-5 text-amber-forensic border-amber-forensic font-pixel text-[12px] md:text-[14px] tracking-[0.1em] uppercase"
          >
            I'M A VC
          </motion.button>
        </div>
      </div>
    </section>
  );
}

