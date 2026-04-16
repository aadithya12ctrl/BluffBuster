import React from 'react';
import { motion } from 'framer-motion';
import InvestorFingerprint from './InvestorFingerprint';
import ClaimDecayVisualizer from './ClaimDecayVisualizer';
import FileUpload from './FileUpload';

const features = [
  {
    id: "01",
    tag: "LIVE WEB EVIDENCE",
    title: "Claim Verification Agent",
    description: "Our agents crawl the live web, SEC filings, and private databases to verify every number in your deck."
  },
  {
    id: "02",
    tag: "FULL INTEL",
    title: "Competitor Trajectory Mapper",
    description: "We don't just list competitors. We map their funding, growth, and feature velocity against yours."
  },
  {
    id: "03",
    tag: "WEIGHTED RISK",
    title: "Investor Red Flag Scorer",
    description: "A proprietary scoring system that weights claims based on historical VC exit data and failure patterns."
  },
  {
    id: "04",
    tag: "INDUSTRY STANDARDS",
    title: "Domain Credibility Checker",
    description: "We compare your unit economics against industry-standard benchmarks for your specific stage and sector."
  }
];

export default function VCMode() {
  return (
    <section id="vc-mode" className="relative min-h-screen bg-transparent py-32 px-4 md:px-20 overflow-hidden">
      {/* Background Gradients for Depth */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-amber-forensic/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="w-full glass bg-amber-forensic/5 py-6 px-8 mb-16 border-y border-amber-forensic/10">
          <h2 className="font-bebas text-5xl tracking-[0.4em] text-amber-forensic text-center">VC MODE</h2>
        </div>

        <FileUpload />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-6 mt-16">
          {features.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-amber p-8 verdict-border-amber relative flex flex-col h-full neon-hover-amber transition-all duration-300 cursor-default"
            >
              <div className="flex justify-between items-start mb-8">
                <span className="font-pixel text-[8px] text-amber-forensic/60">{f.id}</span>
                <span className="font-pixel text-[7px] tracking-[0.2em] text-amber-forensic border border-amber-forensic/30 px-2 py-1 rounded-[2px] uppercase">
                  {f.tag}
                </span>
              </div>
              <h3 className="font-pixel text-[10px] text-off-white mb-6 tracking-widest leading-relaxed">{f.title}</h3>
              <p className="font-pixel text-[8px] text-muted-forensic leading-[2] tracking-wider">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <InvestorFingerprint />
          </motion.div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <ClaimDecayVisualizer />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
