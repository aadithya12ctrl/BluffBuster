import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface RedFlag {
  claim: string;
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  weight: number;
  explanation: string;
  category: string;
}

interface RedFlagReportProps {
  redFlags?: {
    red_flags: RedFlag[];
    overall_risk_score: number;
    summary: string;
  };
}

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colors = {
    critical: 'bg-red-forensic/20 text-red-forensic border-red-forensic/40',
    major: 'bg-amber-forensic/20 text-amber-forensic border-amber-forensic/40',
    moderate: 'bg-amber-forensic/10 text-amber-forensic/80 border-amber-forensic/20',
    minor: 'bg-off-white/10 text-muted-forensic border-off-white/20',
  };

  const Icon = severity === 'critical' ? ShieldAlert : 
               severity === 'major' ? AlertTriangle : 
               severity === 'moderate' ? AlertCircle : Info;

  const style = colors[severity as keyof typeof colors] || colors.minor;

  return (
    <div className={`px-3 py-1 rounded-full border flex items-center gap-2 font-pixel text-[8px] uppercase tracking-tighter ${style}`}>
      <Icon className="w-3 h-3" />
      {severity}
    </div>
  );
};

export default function RedFlagReport({ redFlags }: RedFlagReportProps) {
  if (!redFlags || !redFlags.red_flags || redFlags.red_flags.length === 0) {
    return (
      <div className="glass p-12 border-dashed border-white/20 text-center rounded-sm">
        <p className="font-pixel text-[10px] text-muted-forensic uppercase">No significant red flags detected.</p>
      </div>
    );
  }

  // Sort by weight descending
  const sortedFlags = [...redFlags.red_flags].sort((a, b) => b.weight - a.weight);

  return (
    <div className="space-y-8">
      <div className="glass p-8 border-red-forensic/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldAlert className="w-24 h-24 text-red-forensic" />
        </div>
        
        <div className="relative z-10">
          <h3 className="font-bebas text-2xl tracking-widest text-red-forensic mb-4">EXECUTIVE RISK SUMMARY</h3>
          <p className="font-space text-lg text-off-white/90 leading-relaxed mb-6 italic">
            "{redFlags.summary}"
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${redFlags.overall_risk_score * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full ${redFlags.overall_risk_score > 0.7 ? 'bg-red-forensic shadow-[0_0_10px_#FF3D3D]' : 'bg-amber-forensic shadow-[0_0_10px_#FF9500]'}`}
              />
            </div>
            <span className="font-pixel text-[10px] text-muted-forensic">
              RISK: {(redFlags.overall_risk_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sortedFlags.map((flag, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 hover:bg-white/[0.02] transition-colors border-l-4 border-l-transparent hover:border-l-red-forensic spotlight-card"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <SeverityBadge severity={flag.severity} />
                  <span className="font-pixel text-[8px] text-muted-forensic uppercase tracking-widest">
                    CATEGORY: {flag.category}
                  </span>
                </div>
                <h4 className="font-space text-off-white font-bold text-lg leading-tight uppercase tracking-tight">
                  {flag.claim}
                </h4>
                <p className="font-space text-sm text-muted-forensic leading-relaxed">
                  {flag.explanation}
                </p>
              </div>
              
              <div className="font-pixel text-[20px] text-off-white/20 select-none">
                {String(idx + 1).padStart(2, '0')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
