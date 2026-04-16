import React from 'react';
import { motion } from 'framer-motion';
import { EyeOff, Target, ShieldCheck, Map, ArrowRight, ShieldAlert } from 'lucide-react';

interface MissedCompetitor {
  name: string;
  description: string;
  funding: string;
  trajectory: string;
  how_to_address: string;
}

interface BlindSpotDetectorProps {
  data?: {
    mentioned_competitors: string[];
    missed_competitors: MissedCompetitor[];
    advice: string;
  };
}

export default function BlindSpotDetector({ data }: BlindSpotDetectorProps) {
  if (!data || !data.missed_competitors || data.missed_competitors.length === 0) {
    return (
      <div className="glass p-12 border-dashed border-white/20 text-center rounded-sm">
        <p className="font-pixel text-[10px] text-muted-forensic uppercase">No hidden competitors detected. Your landscape is clear. 🗺️✨</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="glass p-8 border-green-forensic/10 relative overflow-hidden bg-green-forensic/[0.02]">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <EyeOff className="w-24 h-24 text-green-forensic" />
        </div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <h3 className="font-bebas text-2xl tracking-widest text-green-forensic uppercase">Tactical Strategy Advice</h3>
          <p className="font-space text-lg text-off-white/90 leading-relaxed italic">
            "{data.advice}"
          </p>
          <div className="flex flex-wrap gap-2 pt-4">
            <span className="font-pixel text-[6px] text-muted-forensic uppercase tracking-widest self-center mr-2">Mentioned in Deck:</span>
            {data.mentioned_competitors.map((name, i) => (
              <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-sm font-pixel text-[6px] text-off-white/60">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.missed_competitors.map((comp, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-8 border-l-4 border-l-red-forensic hover:bg-white/[0.02] transition-all relative group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Map className="w-24 h-24 text-off-white" />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-pixel text-[7px] text-red-forensic uppercase tracking-[0.2em] mb-1 animate-pulse">
                    <ShieldAlert className="w-3 h-3" /> BLIND SPOT DETECTED
                  </div>
                  <h4 className="font-bebas text-4xl tracking-wider text-off-white italic">
                    {comp.name}
                  </h4>
                </div>
                <div className="flex gap-4">
                   <div className="text-right">
                      <div className="font-pixel text-[6px] text-muted-forensic uppercase mb-1">Funding State</div>
                      <div className="font-space text-xs text-off-white font-bold">{comp.funding}</div>
                   </div>
                </div>
              </div>

              <p className="font-space text-sm text-muted-forensic leading-relaxed max-w-3xl">
                {comp.description}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                <div className="space-y-3">
                   <div className="flex items-center gap-2 font-pixel text-[8px] text-muted-forensic uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-muted-forensic rounded-full" /> Current Trajectory
                   </div>
                   <p className="font-space text-xs text-off-white/80 leading-relaxed italic">
                      "{comp.trajectory}"
                   </p>
                </div>
                <div className="glass-green p-6 border-green-forensic/20 rounded-sm space-y-3">
                   <div className="flex items-center gap-2 font-pixel text-[8px] text-green-forensic uppercase tracking-widest">
                      <ShieldCheck className="w-4 h-4" /> How to Address in Deck
                   </div>
                   <p className="font-space text-xs text-off-white leading-relaxed">
                      {comp.how_to_address}
                   </p>
                   <div className="flex justify-end pt-2">
                      <ArrowRight className="w-4 h-4 text-green-forensic animate-bounce-x" />
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
