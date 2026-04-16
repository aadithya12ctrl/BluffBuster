import React from 'react';
import { motion } from 'framer-motion';
import { Crosshair, CheckCircle2, XCircle, Info, Landmark } from 'lucide-react';

interface Assessment {
  claim: string;
  industry_standard: string;
  meets_standard: boolean;
  gap: string;
  recommendation: string;
}

interface DomainForensicsProps {
  domainData?: {
    industry_detected: string;
    credibility_assessments: Assessment[];
    domain_score: number;
    summary: string;
  };
}

export default function DomainForensics({ domainData }: DomainForensicsProps) {
  if (!domainData || !domainData.credibility_assessments || domainData.credibility_assessments.length === 0) {
    return (
      <div className="glass p-12 border-dashed border-white/20 text-center rounded-sm">
        <p className="font-pixel text-[10px] text-muted-forensic uppercase">No domain-specific assessments available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between bg-white/[0.02] p-8 border border-white/10 rounded-sm">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <Landmark className="w-5 h-5 text-amber-forensic" />
            <h3 className="font-bebas text-3xl tracking-widest text-off-white">
              INDUSTRY DETECTED: <span className="text-amber-forensic">{domainData.industry_detected.toUpperCase()}</span>
            </h3>
          </div>
          <p className="font-space text-md text-off-white/70 leading-relaxed italic">
            "{domainData.summary}"
          </p>
        </div>
        
        <div className="text-right">
          <div className="font-pixel text-[8px] text-muted-forensic mb-2 tracking-[0.2em] uppercase">Sector Compliance</div>
          <div className="font-bebas text-6xl text-off-white shadow-text-glow">
            {(domainData.domain_score * 10).toFixed(1)}
            <span className="text-2xl text-muted-forensic"> / 10</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {domainData.credibility_assessments.map((item, idx) => (
          <div key={idx} className="glass p-8 border-white/5 relative group transition-all hover:border-white/20">
            <div className={`absolute top-0 left-0 w-1 h-full 
              ${item.meets_standard ? 'bg-green-forensic shadow-[0_0_10px_rgba(0,200,150,0.5)]' : 'bg-red-forensic shadow-[0_0_10px_rgba(255,61,61,0.5)]'}`} 
            />
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <h4 className="font-space font-bold text-lg text-off-white leading-tight">
                    "{item.claim}"
                  </h4>
                  <div className="flex items-center gap-2">
                    {item.meets_standard ? (
                      <div className="flex items-center gap-2 font-pixel text-[8px] text-green-forensic uppercase tracking-widest">
                        <CheckCircle2 className="w-4 h-4" /> MEETS DOMAIN BAR
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 font-pixel text-[8px] text-red-forensic uppercase tracking-widest">
                        <XCircle className="w-4 h-4" /> BELOW DOMAIN BAR
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-pixel text-[8px] text-muted-forensic uppercase tracking-widest">
                    <Crosshair className="w-3 h-3" /> Industry Standard
                  </div>
                  <p className="font-space text-sm text-off-white/80 leading-relaxed">
                    {item.industry_standard}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-pixel text-[8px] text-amber-forensic uppercase tracking-widest">
                    <Info className="w-3 h-3" /> Diligence Gap
                  </div>
                  <p className="font-space text-sm text-amber-forensic/80 leading-relaxed italic">
                    {item.gap}
                  </p>
                </div>
              </div>

              {!item.meets_standard && (
                <div className="bg-white/[0.03] p-4 border border-white/5 font-space text-xs text-muted-forensic leading-relaxed">
                  <span className="text-off-white font-pixel text-[7px] uppercase tracking-widest mr-2 block mb-2">Recommendation:</span>
                  {item.recommendation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
