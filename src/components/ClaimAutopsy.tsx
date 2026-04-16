import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Timer, Info } from 'lucide-react';

export interface AutopsyClaim {
  text: string;
  verdict: string;
  color: string;
  decay?: {
    freshness_score: number;
    estimated_expiry: string;
    decay_reasoning: string;
  };
}

const mockClaims: AutopsyClaim[] = [
  { 
    text: "40% market share in Indian EdTech", 
    verdict: "FALSE", 
    color: "#FF3D3D",
    decay: { freshness_score: 0.2, estimated_expiry: "Expired", decay_reasoning: "Market dominance claims from 2022 are invalidated by the 2023 consolidation wave." }
  },
  { 
    text: "95% retrieval accuracy on medical docs", 
    verdict: "VERIFIED", 
    color: "#00C896",
    decay: { freshness_score: 0.9, estimated_expiry: "Stable 1yr+", decay_reasoning: "Core algorithmic performance in niche medical fields remains top-tier." }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0 }
};

export default function ClaimAutopsy({ claims = mockClaims }: { claims?: AutopsyClaim[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const cards = containerRef.current.getElementsByClassName('spotlight-card');
    for (const card of Array.from(cards)) {
      const rect = (card as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    }
  };

  const getIcon = (verdict: string, color: string) => {
    switch (verdict) {
      case 'VERIFIED': return <CheckCircle2 className="w-5 h-5" style={{ color }} />;
      case 'EXAGGERATED': return <AlertTriangle className="w-5 h-5" style={{ color }} />;
      case 'FALSE': return <XCircle className="w-5 h-5" style={{ color }} />;
      default: return <HelpCircle className="w-5 h-5" style={{ color }} />;
    }
  };

  const getFreshnessColor = (score: number) => {
    if (score > 0.7) return '#00C896';
    if (score > 0.4) return '#FF9500';
    return '#FF3D3D';
  };

  return (
    <motion.div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
    >
      {claims.map((claim, idx) => (
        <motion.div
          key={idx}
          variants={cardVariants}
          className="spotlight-card glass p-6 border-white/5 rounded-xl flex flex-col justify-between min-h-[180px] group transition-all duration-300 hover:border-white/20 hover:-translate-y-1 relative"
        >
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity">
             <Timer className="w-4 h-4 text-muted-forensic" />
          </div>

          <div>
            <p className="font-sans text-sm text-off-white/90 leading-relaxed font-medium mb-6 italic">
              "{claim.text}"
            </p>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {getIcon(claim.verdict, claim.color)}
                <span 
                  className="font-mono text-[11px] tracking-widest uppercase font-bold"
                  style={{ color: claim.color, textShadow: `0 0 10px ${claim.color}40` }}
                >
                  {claim.verdict}
                </span>
              </div>
              
              {claim.decay && (
                <div className="flex items-center gap-2 font-pixel text-[7px] text-muted-forensic uppercase">
                  <span>EXP: {claim.decay.estimated_expiry}</span>
                </div>
              )}
            </div>
          </div>

          {claim.decay && (
            <div className="pt-4 border-t border-white/5 space-y-2">
              <div className="flex justify-between items-center text-[7px] font-pixel text-muted-forensic uppercase tracking-widest">
                <span>TEMPORAL FRESHNESS</span>
                <span style={{ color: getFreshnessColor(claim.decay.freshness_score) }}>
                  {(claim.decay.freshness_score * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${claim.decay.freshness_score * 100}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-full shadow-[0_0_10px_rgba(0,200,150,0.3)]"
                  style={{ backgroundColor: getFreshnessColor(claim.decay.freshness_score) }}
                />
              </div>
              <p className="text-[8px] font-sans text-muted-forensic leading-tight line-clamp-2 italic opacity-60 group-hover:opacity-100 transition-opacity">
                {claim.decay.decay_reasoning}
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
