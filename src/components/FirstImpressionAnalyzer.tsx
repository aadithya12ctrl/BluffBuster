import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Zap, Target, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

interface Rewrite {
  page: number;
  original: string;
  rewrite: string;
  reason: string;
}

interface FirstImpressionData {
  problem_clarity: number;
  hook_strength: number;
  solution_comprehension: number;
  overall_score: number;
  feedback: string;
  rewrites: Rewrite[];
}

interface FirstImpressionAnalyzerProps {
  data?: FirstImpressionData;
}

const ScoreMeter = ({ label, score, icon: Icon, color }: { label: string, score: number, icon: any, color: string }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center text-[8px] font-pixel tracking-tighter uppercase text-muted-forensic">
      <span className="flex items-center gap-1.5"><Icon className="w-3 h-3" /> {label}</span>
      <span className={color}>{(score * 100).toFixed(0)}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${score * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full bg-gradient-to-r from-transparent ${color.replace('text-', 'to-')}`} 
      />
    </div>
  </div>
);

export default function FirstImpressionAnalyzer({ data }: FirstImpressionAnalyzerProps) {
  if (!data) {
    return (
      <div className="glass p-12 border-dashed border-white/20 text-center rounded-sm">
        <p className="font-pixel text-[10px] text-muted-forensic uppercase">Analyzing the first 90 seconds... 📡</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* BIG SCORE CARD */}
        <div className="glass p-10 border-green-forensic/20 flex flex-col items-center justify-center relative overflow-hidden bg-green-forensic/[0.03]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-forensic/30 to-transparent" />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="text-center relative z-10"
          >
            <div className="font-bebas text-8xl tracking-tight text-green-forensic drop-shadow-glow-green">
              {(data.overall_score * 100).toFixed(0)}
            </div>
            <div className="font-pixel text-[7px] text-muted-forensic uppercase tracking-[0.5em] mt-2">
              VIBE SCORE
            </div>
          </motion.div>
          
          <div className="mt-8 text-center max-w-[200px]">
            <p className="font-space text-[10px] text-off-white/70 leading-relaxed italic">
              "{data.feedback}"
            </p>
          </div>
        </div>

        {/* METRICS CARD */}
        <div className="lg:col-span-2 glass p-10 border-white/10 space-y-8 flex flex-col justify-center">
            <div className="space-y-6">
              <ScoreMeter label="Problem Clarity" score={data.problem_clarity} icon={Target} color="text-green-forensic" />
              <ScoreMeter label="Hook Strength" score={data.hook_strength} icon={Zap} color="text-amber-forensic" />
              <ScoreMeter label="Solution Comprehension" score={data.solution_comprehension} icon={BookOpen} color="text-blue-forensic" />
            </div>
            <div className="pt-6 border-t border-white/5 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-muted-forensic opacity-50" />
              <p className="font-space text-[10px] text-muted-forensic">
                VCs typically drop off after Slide 3 if these aren't above 75%.
              </p>
            </div>
        </div>
      </div>

      {/* REWRITE SECTION */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <RefreshCw className="w-5 h-5 text-green-forensic" />
          <h3 className="font-bebas text-2xl tracking-widest text-off-white uppercase">The 90-Second Rescue Plan</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {data.rewrites.map((rw, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 border-l-4 border-l-green-forensic hover:bg-green-forensic/[0.02] transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <div className="font-pixel text-[7px] text-muted-forensic uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-forensic/40 rounded-full" /> Page {rw.page} (Weak Landing)
                  </div>
                  <div className="p-5 bg-white/[0.03] border border-white/5 rounded-sm line-through decoration-red-forensic/30 font-space text-xs text-muted-forensic italic">
                    "{rw.original}"
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="font-pixel text-[7px] text-green-forensic uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-forensic rounded-full animate-pulse" /> Scrutiny-Proof Hook
                  </div>
                  <div className="p-5 bg-green-forensic/5 border border-green-forensic/20 rounded-sm font-space text-sm text-off-white font-bold shadow-[0_0_20px_rgba(0,240,150,0.05)]">
                    "{rw.rewrite}"
                  </div>
                  <div className="pt-2">
                    <p className="font-space text-[10px] text-muted-forensic leading-relaxed">
                      <span className="text-green-forensic/70 font-bold">REASON:</span> {rw.reason}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
