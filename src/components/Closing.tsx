import React from 'react';
import { motion } from 'framer-motion';

export default function Closing() {
  const title = "BLUFFBUSTER";
  const characters = title.split("");

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
        <div className="absolute top-[30%] left-[20%] opacity-60 animate-float-slow text-green-forensic text-4xl md:text-5xl font-pixel flex items-center justify-center retro-text-3d" style={{filter: 'drop-shadow(2px 2px 0px rgba(0, 200, 150, 0.4))'}}>$</div>
        <div className="absolute bottom-[40%] left-[15%] opacity-70 animate-float-fast text-red-forensic text-5xl md:text-7xl font-pixel flex items-center justify-center retro-text-3d">!</div>
        <div className="absolute top-[25%] right-[20%] opacity-60 animate-float-fast text-amber-forensic text-4xl md:text-5xl font-pixel flex items-center justify-center" style={{textShadow: '2px 2px 0px rgba(255, 149, 0, 0.4)'}}>?</div>
        <div className="absolute bottom-[35%] right-[15%] opacity-50 animate-float-slow text-red-forensic text-3xl md:text-4xl font-pixel flex items-center justify-center" style={{textShadow: '2px 2px 0px rgba(255, 61, 61, 0.5)'}}>X</div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-7xl">
        <h2 className="font-pixel text-[clamp(40px,7vw,100px)] leading-[1.2] flex flex-wrap justify-center overflow-hidden tracking-normal mb-8 retro-text-3d drop-shadow-2xl">
          {characters.map((char, i) => (
            <motion.span
              key={i}
              initial={{ x: i % 2 === 0 ? -60 : 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: false }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: i * 0.05
              }}
              className="inline-block mx-[2px]"
            >
              {char}
            </motion.span>
          ))}
        </h2>

        <div className="mt-8 space-y-6 bg-[#050508]/60 p-6 rounded-lg backdrop-blur-sm border border-white/5 inline-block">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-pixel text-[12px] md:text-[14px] text-off-white tracking-[0.2em] uppercase"
          >
            Lies are obvious.
          </motion.p>
          <div className="w-24 h-[1px] bg-red-forensic/30 mx-auto my-6" />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="font-pixel text-[12px] md:text-[14px] text-amber-forensic tracking-[0.2em] uppercase"
          >
            Exaggerated truths aren't.
          </motion.p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 font-pixel text-[7px] text-muted-forensic tracking-[0.4em] uppercase w-max max-w-full overflow-hidden whitespace-nowrap">
          <span className="hover:text-off-white transition-colors duration-300 cursor-default">Forensic Unit 01</span>
          <span className="text-red-forensic opacity-50">|</span>
          <span className="hover:text-off-white transition-colors duration-300 cursor-default">Truth Protocol Alpha</span>
          <span className="text-red-forensic opacity-50">|</span>
          <span className="hover:text-off-white transition-colors duration-300 cursor-default">BluffBuster v2.4</span>
        </div>
      </div>
    </section>
  );
}
