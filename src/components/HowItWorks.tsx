import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { id: 1, title: "Choose Mode", description: "Select between Founder or VC perspective to tailor the forensic analysis." },
  { id: 2, title: "Upload Deck", description: "Securely upload your pitch deck for a deep-scan claim extraction." },
  { id: 3, title: "Live Autopsy", description: "Watch as our AI dissects every claim against real-world evidence in real-time." },
  { id: 4, title: "Results + Debate", description: "Review the adversarial debate between the Defender and Prosecutor agents." },
  { id: 5, title: "Truth Heatmap", description: "Get a visual overlay of your deck showing exactly where the bluffs are." }
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(lineRef.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 20%",
          end: "bottom 80%",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-transparent py-32 px-4 md:px-20 flex flex-col md:flex-row gap-20">
      
      {/* Background Gradients for Depth */}
      <div className="absolute top-[10%] left-[-20%] w-[600px] h-[600px] bg-red-forensic/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[800px] h-[800px] bg-amber-forensic/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Left: Sticky Timeline */}
      <div className="md:w-1/3 relative z-10">
        <div className="sticky top-[20vh] space-y-12">
          <h2 className="font-bebas text-5xl text-red-forensic mb-12">HOW IT WORKS</h2>
          <div className="relative pl-12">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 w-[2px] h-full bg-muted-forensic/20" />
            <div ref={lineRef} className="absolute left-4 top-0 w-[2px] h-full bg-red-forensic origin-top scale-y-0" />

            <div className="space-y-16">
              {steps.map((step) => (
                <div key={step.id} className="relative group cursor-pointer">
                  <div className="absolute -left-[44px] top-0 w-8 h-8 rounded-full bg-background border-2 border-muted-forensic flex items-center justify-center font-pixel text-[8px] text-muted-forensic group-hover:border-red-forensic group-hover:text-off-white group-neon-hover-red transition-all duration-300">
                    {step.id}
                  </div>
                  <div className="text-muted-forensic group-hover:text-off-white transition-colors duration-300">
                    <h3 className="font-pixel text-[10px] tracking-widest leading-relaxed">{step.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Content Panels */}
      <div className="md:w-2/3 space-y-[40vh]">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="h-[60vh] flex flex-col justify-center glass-red p-12 verdict-border-red"
          >
            <span className="font-pixel text-red-forensic text-[8px] tracking-[0.3em] mb-8">STEP 0{step.id}</span>
            <h3 className="font-bebas text-6xl text-off-white mb-10 tracking-tight">{step.title}</h3>
            <p className="font-pixel text-[10px] text-muted-forensic leading-[2] tracking-wider">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
