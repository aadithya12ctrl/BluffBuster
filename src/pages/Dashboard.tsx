import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, ArrowLeft, Target, Fingerprint, ShieldAlert } from 'lucide-react';
import { api, SessionResult } from '../lib/api';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const GaugeChart = ({ score, color }: { score: number, color: string }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 1 - score }
  ];
  return (
    <div className="w-full h-24 mb-[-20px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="100%"
            startAngle={180} endAngle={0}
            innerRadius="70%" outerRadius="100%"
            dataKey="value"
            stroke="none"
            isAnimationActive={true}
            animationBegin={500}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            <Cell fill={color} />
            <Cell fill="rgba(255,255,255,0.05)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

import ClaimAutopsy from '../components/ClaimAutopsy';
import AdversarialDebate from '../components/AdversarialDebate';
import RedFlagReport from '../components/RedFlagReport';
import CompetitorMap from '../components/CompetitorMap';
import DomainForensics from '../components/DomainForensics';
import ClaimRepairFeed from '../components/ClaimRepairFeed';
import FinancialStressTest from '../components/FinancialStressTest';
import BlindSpotDetector from '../components/BlindSpotDetector';
import FirstImpressionAnalyzer from '../components/FirstImpressionAnalyzer';
import { INVESTOR_PERSONAS } from '../components/PersonaSelector';
import { LayoutGrid, Binary, Landmark, Zap, ShieldCheck, Microscope, Monitor, EyeOff, Trees, TrendingUp, Cpu, Info } from 'lucide-react';

export default function Dashboard() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingPhrases = [
    "Establishing neural link to backend...",
    "Extracting verifiable claims from PDF...",
    "Querying SEC filings and private market data...",
    "Stress-testing financial projections...",
    "Mapping competitor trajectory...",
    "Executing adversarial debate algorithms...",
    "Finalizing truth heatmap layer..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingTextIndex(prev => (prev + 1) % loadingPhrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [loadingPhrases.length]);

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    // Set up polling
    let active = true;
    
    const poll = async () => {
      try {
        const data = await api.getSession(sessionId);
        if (!active) return;
        
        setSession(data);
        
        if (data.status === 'processing') {
          setTimeout(poll, 3000); // Poll every 3s
        }
      } catch (err) {
        if (!active) return;
        console.error("Polling error:", err);
        setError("Failed to communicate with the BluffBuster analytic engine.");
      }
    };
    
    poll();
    
    return () => { active = false; };
  }, [sessionId, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass p-8 border-red-forensic/40 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-red-forensic mx-auto mb-4" />
          <h2 className="font-bebas text-2xl text-off-white tracking-widest mb-4">SYSTEM ERROR</h2>
          <p className="font-pixel text-[10px] text-muted-forensic tracking-widest mb-8 leading-relaxed uppercase">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="glass-red px-6 py-3 font-pixel text-[10px] tracking-widest uppercase text-off-white hover:text-red-forensic transition-colors"
          >
            RETURN TO BASE
          </button>
        </div>
      </div>
    );
  }

  if (!session || session.status === 'processing') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
        <Loader2 className="w-16 h-16 text-red-forensic animate-spin mb-8" />
        <h2 className="font-bebas text-5xl tracking-[0.2em] text-off-white mb-4">FORENSIC SCAN ACTIVE</h2>
        <motion.p 
          key={loadingTextIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="font-pixel text-[10px] text-muted-forensic leading-[2] tracking-wider uppercase max-w-md h-8"
        >
          {loadingPhrases[loadingTextIndex]}
        </motion.p>
      </div>
    );
  }

  const res = session.results;
  if (!res) return null;

  return (
    <div className="min-h-screen bg-background text-off-white py-24 px-4 md:px-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
        <svg width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    
      <button 
        onClick={() => navigate('/')}
        className="relative z-10 flex items-center gap-2 font-pixel text-[10px] text-muted-forensic hover:text-off-white transition-colors mb-16 tracking-widest uppercase"
      >
        <ArrowLeft className="w-4 h-4" /> Start New Scan
      </button>

      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="relative z-10 max-w-7xl mx-auto space-y-24"
      >
        {/* Top overview row */}
        {/* Header with Fund Lens */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="font-pixel text-[8px] text-muted-forensic tracking-widest uppercase bg-white/5 px-2 py-1 rounded-sm border border-white/10">
                Session ID: {sessionId?.[0] === 'e' ? 'DEMO-808' : sessionId?.slice(0, 8)}
              </div>
              <div className="font-pixel text-[8px] text-green-forensic tracking-widest uppercase bg-green-forensic/10 px-2 py-1 rounded-sm border border-green-forensic/20 animate-pulse">
                SCANNED: COMPLETE
              </div>
            </div>
            <h1 className="font-bebas text-7xl md:text-8xl tracking-tighter text-off-white leading-[0.8] flex items-baseline gap-4">
              DILIGENCE <span className="text-red-forensic">REPORT</span>
            </h1>
          </div>

          <div className="flex flex-col items-end gap-3 mb-2">
            {res.mode === 'vc' && (
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-3 glass p-4 pr-6 border-white/10"
              >
                {(() => {
                  const persona = INVESTOR_PERSONAS.find(p => p.id === res.investor_persona) || INVESTOR_PERSONAS[0];
                  return (
                    <>
                      <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-white/5 border border-white/10">
                        <persona.icon className="w-5 h-5 transition-colors" style={{ color: persona.color }} />
                      </div>
                      <div>
                        <div className="font-pixel text-[7px] text-muted-forensic tracking-tighter uppercase mb-1">
                          ACTIVE INVESTOR LENS
                        </div>
                        <div className="font-bebas text-xl tracking-widest text-off-white uppercase" style={{ color: persona.color }}>
                          {persona.name}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            )}
            <div className="font-pixel text-[10px] text-muted-forensic tracking-widest uppercase opacity-30">
              {new Date().toLocaleDateString()} // FORENSIC LOG 404
            </div>
          </div>
        </motion.div>

        {/* Top overview row */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8 items-stretch justify-between">
          <div className="glass p-10 border-white/10 text-center min-w-[320px] relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="font-pixel text-[8px] text-muted-forensic mb-4 tracking-[0.4em] uppercase flex items-center justify-center gap-2">
              <Fingerprint className="w-4 h-4" /> TRUST FACTOR
            </div>
            
            <div className="relative">
              <GaugeChart 
                score={res.overall_trust_score} 
                color={res.overall_trust_score > 0.7 ? '#00C896' : res.overall_trust_score > 0.4 ? '#FF9500' : '#FF3D3D'} 
              />
              <div className={`absolute inset-0 flex items-center justify-center font-bebas text-6xl ${res.overall_trust_score > 0.7 ? 'text-green-forensic' : res.overall_trust_score > 0.4 ? 'text-amber-forensic' : 'text-red-forensic'} drop-shadow-glow`}>
                {(res.overall_trust_score * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic components mapping from the API results */}
        
        {/* We reuse the ClaimAutopsy mockup structure but in a real app we would map `res.claim_results`. 
            For now, let's render the mock UI so it maintains the "Wow Moment" aesthetics.  
            In a complete build we'd pass props down to `ClaimAutopsy`. */}
        
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="flex items-center gap-4 border-b border-red-forensic/20 pb-4 mb-8">
            <div className="w-2 h-8 bg-red-forensic shadow-[0_0_15px_rgba(255,61,61,0.5)]" />
            <h2 className="font-bebas text-4xl tracking-widest flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-red-forensic" /> CLAIM AUTOPSY
            </h2>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <ClaimAutopsy claims={
                res.claim_results && res.claim_results.length > 0 
                  ? res.claim_results.map((c: any) => ({
                      text: c.claim,
                      verdict: c.verdict,
                      color: c.verdict === 'VERIFIED' ? "#00C896" : c.verdict === 'EXAGGERATED' ? "#FF9500" : c.verdict === 'FALSE' ? "#FF3D3D" : "#888",
                      decay: c.temporal_decay
                    }))
                  : undefined
              } />
            </div>
            <div className="lg:w-1/3 flex flex-col justify-center">
              <div className="glass-red p-8 verdict-border-red">
                <p className="font-pixel text-[10px] text-off-white leading-[2] tracking-wider uppercase mb-6">
                  <span className="text-red-forensic font-bold mr-2">VERDICT:</span>
                  The system extracted and verified multiple claims. Extrapolated data points severely mismatch public filings.
                </p>
                <div className="space-y-2 font-pixel text-[8px] uppercase tracking-widest">
                  <div className="flex justify-between border-b border-white/5 py-2">
                    <span className="text-muted-forensic">Claims Extracted:</span>
                    <span className="text-off-white">{res.claim_results?.length || 0}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-2">
                    <span className="text-muted-forensic">Pages Parsed:</span>
                    <span className="text-off-white">{res.heatmap?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Mode-Specific Reports */}
        {res.mode === 'founder' ? (
          <>
            {/* Founder Pillar 1: First Impression Analyzer */}
            <motion.div variants={itemVariants} className="space-y-8 mt-24">
              <div className="flex items-center gap-4 border-b border-blue-forensic/20 pb-4 mb-8">
                <div className="w-2 h-8 bg-blue-forensic shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                <h2 className="font-bebas text-4xl tracking-widest flex items-center gap-3 text-blue-forensic">
                  <Monitor className="w-6 h-6" /> FIRST IMPRESSION ANALYZER
                </h2>
                <span className="font-pixel text-[7px] text-muted-forensic ml-auto uppercase tracking-tighter bg-blue-forensic/10 px-2 py-1 rounded-sm border border-blue-forensic/20">The 90-Second Vibe Check</span>
              </div>
              <FirstImpressionAnalyzer data={res.first_impression} />
            </motion.div>

            {/* Founder Pillar 2: Claim Repair Engine */}
            <motion.div variants={itemVariants} className="space-y-8 mt-24">
              <div className="flex items-center gap-4 border-b border-green-forensic/20 pb-4 mb-8">
                <div className="w-2 h-8 bg-green-forensic shadow-[0_0_15px_rgba(0,200,150,0.5)]" />
                <h2 className="font-bebas text-4xl tracking-widest flex items-center gap-3 text-green-forensic">
                  <ShieldCheck className="w-6 h-6" /> CLAIM REPAIR ENGINE
                </h2>
                <span className="font-pixel text-[7px] text-muted-forensic ml-auto uppercase tracking-tighter bg-green-forensic/10 px-2 py-1 rounded-sm border border-green-forensic/20">The Scrutiny-Proof Rewrite</span>
              </div>
              <ClaimRepairFeed claims={res.claim_results} />
            </motion.div>

            {/* Founder Pillar 3: Financial Stress Tester */}
            <motion.div variants={itemVariants} className="space-y-8 mt-24">
              <div className="flex items-center gap-4 border-b border-off-white/10 pb-4 mb-8">
                <div className="w-2 h-8 bg-off-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                <h2 className="font-bebas text-4xl tracking-widest flex items-center gap-3 text-off-white">
                  <Landmark className="w-6 h-6" /> FINANCIAL PROJECTION STRESS TESTER
                </h2>
                <span className="font-pixel text-[7px] text-muted-forensic ml-auto uppercase tracking-tighter bg-white/5 px-2 py-1 rounded-sm border border-white/10">The Bullshit Meter</span>
              </div>
              <FinancialStressTest data={res.financial_stress} />
            </motion.div>

            {/* Founder Pillar 4: Competitor Blind Spot Detector */}
            <motion.div variants={itemVariants} className="space-y-8 mt-24">
              <div className="flex items-center gap-4 border-b border-red-forensic/20 pb-4 mb-8">
                <div className="w-2 h-8 bg-red-forensic shadow-[0_0_15px_rgba(255,61,61,0.5)]" />
                <h2 className="font-bebas text-4xl tracking-widest flex items-center gap-3 text-red-forensic">
                  <EyeOff className="w-6 h-6" /> COMPETITOR BLIND SPOT DETECTOR
                </h2>
                <span className="font-pixel text-[7px] text-muted-forensic ml-auto uppercase tracking-tighter bg-red-forensic/10 px-2 py-1 rounded-sm border border-red-forensic/20">The Stealth Rival Finder</span>
              </div>
              <BlindSpotDetector data={res.competitors} />
            </motion.div>
          </>
        ) : (
          <>
            {/* VC Mode: Competitor Trajectory Mapper */}
            <motion.div variants={itemVariants} className="space-y-8 mt-24">
              <div className="flex items-center gap-4 border-b border-off-white/10 pb-4 mb-8">
                <div className="w-2 h-8 bg-off-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                <h2 className="font-bebas text-4xl tracking-widest flex items-center gap-3">
                  <LayoutGrid className="w-6 h-6 text-off-white" /> COMPETITOR TRAJECTORY MAPPER
                </h2>
              </div>
              <CompetitorMap competitors={res.competitors} />
            </motion.div>

            {/* VC Mode: Investor Red Flags */}
            <motion.div variants={itemVariants} className="space-y-8 mt-24">
              <div className="flex items-center gap-4 border-b border-red-forensic/20 pb-4 mb-8">
                <div className="w-2 h-8 bg-red-forensic shadow-[0_0_15px_rgba(255,61,61,0.5)]" />
                <h2 className="font-bebas text-4xl tracking-widest flex items-center gap-3 text-red-forensic">
                  <Binary className="w-6 h-6" /> INVESTOR RED FLAG SCORER
                </h2>
              </div>
              <RedFlagReport redFlags={res.red_flags} />
            </motion.div>

            {/* VC Mode: Domain Credibility */}
            <motion.div variants={itemVariants} className="space-y-8 mt-24">
              <div className="flex items-center gap-4 border-b border-amber-forensic/20 pb-4 mb-8">
                <div className="w-2 h-8 bg-amber-forensic shadow-[0_0_159px_rgba(255,149,0,0.5)]" />
                <h2 className="font-bebas text-4xl tracking-widest flex items-center gap-3 text-amber-forensic">
                  <Microscope className="w-6 h-6" /> DOMAIN CREDIBILITY CHECKER
                </h2>
              </div>
              <DomainForensics domainData={res.domain_credibility} />
            </motion.div>
          </>
        )}

        <motion.div variants={itemVariants} className="space-y-8 mt-24">
          <div className="flex items-center gap-4 border-b border-[#1E1E2E] pb-4 mb-8">
            <div className="w-2 h-8 bg-off-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            <h2 className="font-bebas text-4xl tracking-widest text-off-white">TRUTH HEATMAP</h2>
            <span className="font-pixel text-[7px] text-muted-forensic ml-auto uppercase tracking-tighter bg-white/5 px-2 py-1 rounded-sm border border-white/10">Page-by-Page Forensic Scan</span>
          </div>
          
          {/* Actual Heatmap Bar */}
          {res.heatmap && res.heatmap.length > 0 ? (
            <div className="space-y-6">
              {/* Continuous heatmap strip */}
              <div className="relative glass p-6">
                <div className="flex w-full h-20 rounded-sm overflow-hidden border border-white/10">
                  {res.heatmap.map((page: any, idx: number) => {
                    const colorMap: Record<string, string> = {
                      green: 'rgba(0, 200, 150, __ALPHA__)',
                      amber: 'rgba(255, 149, 0, __ALPHA__)',
                      red: 'rgba(255, 61, 61, __ALPHA__)',
                    };
                    const baseColor = colorMap[page.dominant_color] || colorMap.amber;
                    // Intensity based on how extreme the score is (further from 0.5 = more intense)
                    const intensity = Math.max(0.3, page.page_score > 0.5 ? page.page_score : 1 - page.page_score);
                    const bgColor = baseColor.replace('__ALPHA__', String(intensity));
                    const glowColor = baseColor.replace('__ALPHA__', '0.6');
                    
                    return (
                      <div 
                        key={idx}
                        className="relative group flex-1 flex items-end justify-center cursor-pointer transition-all duration-300 hover:brightness-150"
                        style={{ 
                          background: `linear-gradient(to top, ${bgColor}, rgba(10,10,15,0.8))`,
                          boxShadow: `inset 0 -4px 20px ${glowColor}`,
                        }}
                      >
                        {/* Inner heat bar — height proportional to score */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 transition-all duration-500"
                          style={{ 
                            height: `${Math.max(15, page.page_score * 100)}%`,
                            background: bgColor,
                            boxShadow: `0 0 30px ${glowColor}`,
                          }}
                        />
                        {/* Page label */}
                        <div className="relative z-10 font-pixel text-[7px] text-off-white/80 tracking-widest pb-2 group-hover:text-off-white transition-colors">
                          {page.page_number}
                        </div>
                        {/* Hover tooltip */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 glass px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 border border-white/10">
                          <div className="font-pixel text-[7px] text-off-white tracking-widest">PG {page.page_number}</div>
                          <div className={`font-bebas text-xl ${page.dominant_color === 'green' ? 'text-green-forensic' : page.dominant_color === 'amber' ? 'text-amber-forensic' : 'text-red-forensic'}`}>
                            {(page.page_score * 100).toFixed(0)}%
                          </div>
                          <div className="font-pixel text-[6px] text-muted-forensic">{page.claims?.length || 0} claims</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Legend bar */}
                <div className="flex items-center justify-between mt-4 px-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-red-forensic shadow-[0_0_8px_rgba(255,61,61,0.5)]" />
                      <span className="font-pixel text-[7px] text-muted-forensic tracking-widest uppercase">False</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-amber-forensic shadow-[0_0_8px_rgba(255,149,0,0.5)]" />
                      <span className="font-pixel text-[7px] text-muted-forensic tracking-widest uppercase">Exaggerated</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm bg-green-forensic shadow-[0_0_8px_rgba(0,200,150,0.5)]" />
                      <span className="font-pixel text-[7px] text-muted-forensic tracking-widest uppercase">Verified</span>
                    </div>
                  </div>
                  <div className="font-pixel text-[7px] text-muted-forensic tracking-widest uppercase">
                    {res.heatmap.length} pages scanned
                  </div>
                </div>
              </div>

              {/* Per-page claim drill-down */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {res.heatmap.map((page: any, idx: number) => (
                  <div key={idx} className={`glass p-4 border-l-4 ${
                    page.dominant_color === 'green' ? 'border-l-green-forensic' :
                    page.dominant_color === 'amber' ? 'border-l-amber-forensic' : 'border-l-red-forensic'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-pixel text-[8px] text-muted-forensic tracking-widest uppercase">Page {page.page_number}</span>
                      <span className={`font-bebas text-2xl ${
                        page.dominant_color === 'green' ? 'text-green-forensic' :
                        page.dominant_color === 'amber' ? 'text-amber-forensic' : 'text-red-forensic'
                      }`}>{(page.page_score * 100).toFixed(0)}%</span>
                    </div>
                    {/* Mini claim bars */}
                    <div className="space-y-1.5">
                      {(page.claims || []).slice(0, 3).map((claim: any, cIdx: number) => {
                        const vColor = claim.verdict === 'VERIFIED' ? '#00C896' : claim.verdict === 'EXAGGERATED' ? '#FF9500' : claim.verdict === 'FALSE' ? '#FF3D3D' : '#555';
                        return (
                          <div key={cIdx} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: vColor, boxShadow: `0 0 6px ${vColor}` }} />
                            <span className="font-pixel text-[6px] text-off-white/70 tracking-wider truncate uppercase">{claim.claim?.slice(0, 50) || `Claim ${cIdx + 1}`}...</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-white/20 p-12 text-center text-muted-forensic font-pixel text-[10px] uppercase">
              No Heatmap Data Generated
            </div>
          )}
        </motion.div>
        
        <motion.div variants={itemVariants} className="space-y-8 mt-24">
          <div className="flex items-center gap-4 border-b border-amber-forensic/20 pb-4 mb-8">
            <div className="w-2 h-8 bg-amber-forensic shadow-[0_0_15px_rgba(255,149,0,0.5)]" />
            <h2 className="font-bebas text-4xl tracking-widest">ADVERSARIAL DEBATE</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <AdversarialDebate 
              debate={res.debate && res.debate.length > 0 ? res.debate : undefined} 
              sessionId={sessionId} 
            />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
