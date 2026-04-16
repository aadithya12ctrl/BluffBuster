import React from 'react';
import { motion } from 'framer-motion';
import ClaimAutopsy from './ClaimAutopsy';
import AdversarialDebate from './AdversarialDebate';

export default function WowMoment() {
  return (
    <section className="relative min-h-screen bg-transparent py-32 px-4 md:px-20 overflow-hidden">
      {/* Background Gradients for Depth */}
      <div className="absolute top-[20%] left-[-10%] w-[800px] h-[800px] bg-red-forensic/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute flex flex-col items-center justify-center inset-0 z-10 p-4">
        <div className="text-center mb-20">
          <h2 className="font-bebas text-7xl text-red-forensic tracking-[0.2em] mb-8">THE WOW MOMENT</h2>
          <p className="font-pixel text-[10px] text-off-white tracking-widest uppercase">Two features that make the room go silent.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-16">
          <div className="space-y-8">
            <h3 className="font-pixel text-[10px] text-off-white tracking-[0.1em] uppercase">LIVE CLAIM AUTOPSY</h3>
            <ClaimAutopsy />
          </div>
          
          <div className="space-y-8">
            <h3 className="font-pixel text-[10px] text-off-white tracking-[0.1em] uppercase">ADVERSARIAL DEBATE</h3>
            <AdversarialDebate />
          </div>
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="glass-red p-8 verdict-border-red flex items-center gap-8"
        >
          <div className="font-pixel text-xl text-red-forensic">11</div>
          <div className="font-pixel text-[8px] text-off-white leading-[2] tracking-wider">
            <span className="text-red-forensic font-bold mr-2 tracking-widest">TRUTH HEATMAP:</span>
            Final report overlays verdict colors directly on the uploaded deck pages. Every false claim bleeds red.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
