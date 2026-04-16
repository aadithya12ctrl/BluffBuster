import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, AlertTriangle, BarChart3, Target, Gauge } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Benchmark {
  metric: string;
  industry_avg: string;
  startup_claim: string;
  gap: string;
}

interface Flag {
  claim: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  alternative: string;
}

interface FinancialStressTestProps {
  data?: {
    projections_found: any[];
    benchmarks: Benchmark[];
    flags: Flag[];
    overall_plausibility: number;
  };
}

const PlausibilityDial = ({ score }: { score: number }) => {
  const data = [
    { value: score },
    { value: 1 - score }
  ];
  const color = score > 0.70 ? '#00C896' : score > 0.40 ? '#FF9500' : '#FF3D3D';

  return (
    <div className="w-full h-48 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="80%"
            startAngle={180} endAngle={0}
            innerRadius="65%" outerRadius="90%"
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
            <Cell fill="rgba(255,255,255,0.03)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] flex flex-col items-center">
        <div className="font-bebas text-6xl tracking-tight text-off-white drop-shadow-glow-white">
          {(score * 100).toFixed(0)}<span className="text-xl opacity-30">%</span>
        </div>
        <div className="font-pixel text-[6px] text-muted-forensic uppercase tracking-[0.3em] mt-2">
          PLAUSIBILITY
        </div>
      </div>
    </div>
  );
};

export default function FinancialStressTest({ data }: FinancialStressTestProps) {
  if (!data || !data.benchmarks || data.benchmarks.length === 0) {
    return (
      <div className="glass p-12 border-dashed border-white/20 text-center rounded-sm">
        <p className="font-pixel text-[10px] text-muted-forensic uppercase">No financial projections detected for stress testing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Dial Card */}
        <div className="glass p-8 border-white/10 flex flex-col items-center justify-center relative overflow-hidden h-full">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
           <Gauge className="absolute top-4 left-4 w-4 h-4 text-muted-forensic opacity-20" />
           <PlausibilityDial score={data.overall_plausibility} />
        </div>

        {/* Benchmarks Card */}
        <div className="lg:col-span-2 glass p-8 border-white/10 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <BarChart3 className="w-5 h-5 text-green-forensic" />
            <h3 className="font-bebas text-2xl tracking-widest text-off-white uppercase">Industry Benchmarking</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.benchmarks.map((b, i) => (
              <div key={i} className="bg-white/[0.03] p-4 border border-white/5 rounded-sm space-y-3">
                <div className="font-pixel text-[7px] text-muted-forensic uppercase tracking-widest">{b.metric}</div>
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="font-pixel text-[6px] text-muted-forensic opacity-50 uppercase">Claimed</div>
                    <div className="font-space text-md font-bold text-red-forensic">{b.startup_claim}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="font-pixel text-[6px] text-muted-forensic opacity-50 uppercase">Industry Avg</div>
                    <div className="font-space text-md font-bold text-green-forensic">{b.industry_avg}</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/5 text-[10px] font-space text-amber-forensic italic">
                  Gap: {b.gap}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flags Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <AlertTriangle className="w-5 h-5 text-red-forensic shadow-glow-red" />
          <h3 className="font-bebas text-2xl tracking-widest text-off-white uppercase">Critical Leakage Detection</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.flags.map((flag, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`glass p-6 border-l-4 ${flag.severity === 'high' ? 'border-l-red-forensic bg-red-forensic/5' : flag.severity === 'medium' ? 'border-l-amber-forensic bg-amber-forensic/5' : 'border-l-white/20'}`}
            >
              <div className="font-pixel text-[6px] text-muted-forensic uppercase mb-4 tracking-tighter flex justify-between">
                <span>SEVERITY: {flag.severity}</span>
              </div>
              <h4 className="font-space font-bold text-sm text-off-white mb-2 italic">"{flag.claim}"</h4>
              <p className="font-space text-xs text-muted-forensic leading-relaxed mb-4">
                {flag.issue}
              </p>
              <div className="bg-black/20 p-3 border border-white/5 rounded-sm">
                <span className="font-pixel text-[6px] text-green-forensic uppercase block mb-1">Realistic Projection:</span>
                <span className="font-space text-xs text-off-white/90">{flag.alternative}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
