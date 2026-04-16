import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface ClaimResult {
  claim: string;
  verdict: string;
  reasoning: string;
  repair_suggestion?: string;
}

interface ClaimRepairFeedProps {
  claims?: ClaimResult[];
}

export default function ClaimRepairFeed({ claims }: ClaimRepairFeedProps) {
  const repairs = claims?.filter(c => c.repair_suggestion) || [];
  
  if (repairs.length === 0) {
    return (
      <div className="glass p-12 border-dashed border-green-forensic/20 text-center rounded-sm">
        <p className="font-pixel text-[10px] text-muted-forensic uppercase">All claims verified. No repairs necessary. 🚀</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {repairs.map((repair, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-green p-8 border hover:bg-green-forensic/[0.02] transition-colors relative group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <RefreshCw className="w-16 h-16 text-green-forensic animate-spin-slow" />
            </div>

            <div className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Before */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-pixel text-[7px] text-red-forensic uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-red-forensic" /> ORIGINAL CLAIM (FLAGGED)
                  </div>
                  <div className="bg-white/[0.03] p-6 border border-white/5 rounded-sm italic font-space text-muted-forensic text-sm line-through decoration-red-forensic/40">
                    "{repair.claim}"
                  </div>
                </div>

                {/* After */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-pixel text-[7px] text-green-forensic uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-green-forensic animate-pulse" /> Scrutiny-Proof Rewrite
                  </div>
                  <div className="bg-green-forensic/5 p-6 border border-green-forensic/20 rounded-sm font-space text-off-white text-sm font-bold shadow-[0_0_15px_rgba(0,200,150,0.05)]">
                    "{repair.repair_suggestion}"
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-pixel text-[8px] text-green-forensic uppercase tracking-widest">
                    <MessageSquare className="w-3 h-3" /> Analyst Logic
                  </div>
                  <p className="font-space text-xs text-muted-forensic leading-relaxed">
                    {repair.reasoning}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <div className="flex items-center gap-2 font-pixel text-[6px] text-green-forensic/50 uppercase tracking-tighter">
                  <CheckCircle2 className="w-3 h-3" /> Passes Forensic Scrutiny
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
