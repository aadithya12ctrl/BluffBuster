import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, DollarSign, Target, ExternalLink } from 'lucide-react';

interface Competitor {
  name: string;
  description: string;
  funding: string;
  trajectory: string;
  comparison_points: string[];
  mentioned_in_deck: boolean;
  url?: string;
}

interface CompetitorMapProps {
  competitors?: {
    competitors: Competitor[];
    competitive_landscape_summary: string;
  };
}

export default function CompetitorMap({ competitors }: CompetitorMapProps) {
  if (!competitors || !competitors.competitors || competitors.competitors.length === 0) {
    return (
      <div className="glass p-12 border-dashed border-white/20 text-center rounded-sm">
        <p className="font-pixel text-[10px] text-muted-forensic uppercase">No direct competitors identified for mapping.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="glass p-8 border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Users className="w-24 h-24 text-off-white" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <h3 className="font-bebas text-2xl tracking-widest text-off-white mb-4 italic">COMPETITIVE LANDSCAPE SUMMARY</h3>
          <p className="font-space text-md text-muted-forensic leading-relaxed">
            {competitors.competitive_landscape_summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {competitors.competitors.map((comp, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`glass p-8 border hover:bg-white/[0.02] transition-all relative overflow-hidden group
              ${comp.mentioned_in_deck ? 'border-white/10' : 'border-red-forensic/30'}`}
          >
            {!comp.mentioned_in_deck && (
              <div className="absolute top-0 right-0 bg-red-forensic text-off-white font-pixel text-[6px] px-3 py-1 uppercase tracking-tighter">
                MISSED BY FOUNDER
              </div>
            )}
            
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bebas text-3xl tracking-wider text-off-white group-hover:text-red-forensic transition-colors">
                    {comp.name}
                  </h4>
                  <p className="font-space text-xs text-muted-forensic uppercase tracking-widest mt-1">
                    {comp.description.substring(0, 100)}...
                  </p>
                </div>
                {comp.url && (
                  <a href={comp.url} target="_blank" rel="noreferrer" className="text-muted-forensic hover:text-off-white transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-pixel text-[8px] text-muted-forensic uppercase tracking-tighter">
                    <DollarSign className="w-3 h-3 text-green-forensic" /> Funding
                  </div>
                  <div className="font-space text-sm text-off-white truncate font-bold">
                    {comp.funding}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-pixel text-[8px] text-muted-forensic uppercase tracking-tighter">
                    <TrendingUp className="w-3 h-3 text-amber-forensic" /> Trajectory
                  </div>
                  <div className="font-space text-sm text-off-white truncate font-bold">
                    {comp.trajectory}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-2 font-pixel text-[8px] text-red-forensic uppercase tracking-widest mb-2">
                  <Target className="w-3 h-3" /> Comparison Points
                </div>
                {comp.comparison_points.map((point, pIdx) => (
                  <div key={pIdx} className="flex gap-3 items-start group/point">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-forensic shrink-0 group-hover/point:scale-125 transition-transform" />
                    <p className="font-space text-xs text-off-white/80 leading-relaxed italic">
                      "{point}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
