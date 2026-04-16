import React from 'react';
import { motion } from 'framer-motion';

const claims = [
  { text: "No direct competitors in this space", speed: 1.5, color: "red" },
  { text: "Fastest growing platform in India", speed: 2.5, color: "amber" },
  { text: "TAM of $4.2B by 2027", speed: 4, color: "amber" }
];

export default function ClaimDecayVisualizer() {
  return (
    <div className="glass p-8 verdict-border-amber relative flex flex-col h-full w-full">
      <div className="flex justify-between items-start mb-8">
        <span className="font-mono text-xs text-amber-forensic/60">06</span>
        <span className="font-bebas text-[10px] tracking-[0.2em] text-amber-forensic border border-amber-forensic/30 px-2 py-0.5 rounded-[2px] uppercase">
          CLAIM SHELF LIFE
        </span>
      </div>

      <div className="space-y-8 mb-10">
        {claims.map((claim, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="font-mono text-[11px] text-off-white max-w-[70%]">{claim.text}</span>
              <span className="font-mono text-[10px] text-muted-forensic uppercase">FRESHNESS</span>
            </div>
            <div className="h-1 w-full bg-border rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: "100%", backgroundColor: "#00C896" }}
                animate={{ 
                  width: ["100%", "0%"],
                  backgroundColor: ["#00C896", "#FF9500", "#FF3D3D"]
                }}
                transition={{
                  duration: claim.speed,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="h-full"
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] text-muted-forensic">
              <span>Q1 2026</span>
              <span>Q2</span>
              <span>Q3</span>
              <span>Q4</span>
            </div>
          </div>
        ))}
      </div>

      <p className="font-sans text-sm text-muted-forensic leading-relaxed">
        Claims aren't static. Market dynamics, competitor launches, and regulatory shifts erode the truth of your deck over time. We calculate the half-life of every assertion.
      </p>
    </div>
  );
}
