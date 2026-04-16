import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { motion } from 'framer-motion';
import FileUpload from './FileUpload';

const features = [
  {
    id: "01",
    tag: "HOOK OR LOSE",
    title: "First Impression Analyzer",
    description: "Our AI simulates the first 30 seconds of a VC's attention span. We tell you exactly where they stop reading."
  },
  {
    id: "02",
    tag: "MINIMUM VIABLE FIX",
    title: "Claim Repair Engine",
    description: "Don't delete the slide. Reword it. We provide the exact phrasing that stays true to your vision while passing forensic scrutiny."
  },
  {
    id: "03",
    tag: "SHOW YOUR MATH",
    title: "Financial Projection Stress Tester",
    description: "We run 10,000 simulations on your growth claims. If your numbers don't add up, we show you the leak before they do."
  },
  {
    id: "04",
    tag: "NO SURPRISES",
    title: "Competitor Blind Spot Detector",
    description: "VCs have access to private market data. We scan the same databases to find the competitors you didn't know existed."
  }
];

const FeatureCard = ({ feature }: { feature: typeof features[0] }) => {
  const [props, set] = useSpring(() => ({
    scale: 1,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    borderColor: 'rgba(255, 255, 255, 0.06)',
    config: { mass: 1, tension: 350, friction: 25 }
  }));

  return (
    <animated.div
      onMouseEnter={() => set({ 
        scale: 1.02, 
        boxShadow: '-4px 0 16px rgba(0,200,150,0.5)',
        borderColor: 'rgba(0,200,150,0.3)'
      })}
      onMouseLeave={() => set({ 
        scale: 1, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        borderColor: 'rgba(255, 255, 255, 0.06)'
      })}
      style={props}
      className="glass-green p-8 verdict-border-green relative flex flex-col h-full neon-hover-green transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-8">
        <span className="font-pixel text-[8px] text-green-forensic/60">{feature.id}</span>
        <span className="font-pixel text-[7px] tracking-[0.2em] text-green-forensic border border-green-forensic/30 px-2 py-1 rounded-[2px] uppercase">
          {feature.tag}
        </span>
      </div>
      <h3 className="font-pixel text-[10px] text-off-white mb-6 tracking-widest leading-relaxed">{feature.title}</h3>
      <p className="font-pixel text-[8px] text-muted-forensic leading-[2] tracking-wider">
        {feature.description}
      </p>
    </animated.div>
  );
};

export default function FounderMode() {
  return (
    <section id="founder-mode" className="relative min-h-screen bg-transparent py-32 px-4 md:px-20 overflow-hidden">
      {/* Background Gradients for Depth */}
      <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-green-forensic/5 rounded-full blur-[150px] pointer-events-none z-0" />
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-0">
        <svg width="100%" height="100%">
          <filter id="greenNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#greenNoise)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="w-full glass bg-green-forensic/5 py-6 px-8 mb-16 border-y border-green-forensic/10">
          <h2 className="font-bebas text-5xl tracking-[0.4em] text-green-forensic text-center">FOUNDER MODE</h2>
        </div>

        <FileUpload />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-16">
          {features.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <FeatureCard feature={f} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
