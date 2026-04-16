import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Terminal, Send, Gavel } from 'lucide-react';
import { api } from '../lib/api';

export interface DebateMessage {
  role: 'defender' | 'prosecutor';
  content: string;
  claim_ref?: string;
}

const mockDebate: DebateMessage[] = [
  {
    role: "defender",
    content: "The market share calculation includes the unorganized sector, which we are digitizing. The growth is real."
  },
  {
    role: "prosecutor",
    content: "Digitizing doesn't equal ownership. Your actual revenue-generating share is less than 4%. This is a bluff."
  }
];

const TypewriterText = ({ text, delay = 0, onComplete }: { text: string, delay?: number, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(false);
    
    const startTimeout = setTimeout(() => {
      setIsTyping(true);
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      }, 30); // 30ms per char
      
      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return (
    <span className="font-mono text-sm leading-relaxed tracking-wide">
      {displayedText}
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-current ml-1 align-middle"
        />
      )}
    </span>
  );
};

export default function AdversarialDebate({ debate = mockDebate, sessionId }: { debate?: DebateMessage[], sessionId?: string }) {
  const [index, setIndex] = useState(0);
  const [hitlInput, setHitlInput] = useState("");
  const [isJudging, setIsJudging] = useState(false);
  const [showProsecutor, setShowProsecutor] = useState(false);
  
  // Store rulings by claim index
  const [rulings, setRulings] = useState<Record<number, any>>({});

  const pairs = [];
  for (let i = 0; i < debate.length; i += 2) {
    pairs.push([debate[i], debate[i + 1]].filter(Boolean));
  }

  const currentPair = pairs[index] || [];
  const defenderMsg = currentPair.find(m => m?.role === 'defender');
  const prosecutorMsg = currentPair.find(m => m?.role === 'prosecutor');
  
  const currentClaim = defenderMsg?.claim_ref || prosecutorMsg?.claim_ref || "Unknown Claim";
  const currentRuling = rulings[index];

  // Reset sequence when changing index
  useEffect(() => {
    setShowProsecutor(false);
  }, [index]);

  const handleJudgeSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && hitlInput.trim() && sessionId && !isJudging) {
      setIsJudging(true);
      try {
        const result = await api.interveneDebate(sessionId, currentClaim, hitlInput);
        setRulings(prev => ({ ...prev, [index]: result.ruling }));
        setHitlInput("");
      } catch (err) {
        console.error("Failed to intervene:", err);
      } finally {
        setIsJudging(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full relative pb-10">
      
      {pairs.length > 1 && (
        <div className="flex justify-end gap-2 mb-2">
          <button 
             onClick={() => setIndex(i => Math.max(0, i - 1))}
             disabled={index === 0}
             className="text-muted-forensic hover:text-off-white font-pixel text-[8px] disabled:opacity-30 uppercase tracking-widest transition-colors cursor-pointer"
          >
            PREV DEBATE
          </button>
          <span className="text-muted-forensic font-pixel text-[8px] mx-2 flex items-center bg-white/5 px-2 py-1 rounded">
            {index + 1} / {pairs.length}
          </span>
          <button 
             onClick={() => setIndex(i => Math.min(pairs.length - 1, i + 1))}
             disabled={index === pairs.length - 1}
             className="text-muted-forensic hover:text-off-white font-pixel text-[8px] disabled:opacity-30 uppercase tracking-widest transition-colors cursor-pointer"
          >
            NEXT DEBATE
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {defenderMsg && (
          <motion.div
             key={`def-${index}`}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             transition={{ duration: 0.5 }}
             className="glass p-8 verdict-border-green relative shadow-[0_0_20px_rgba(0,200,150,0.05)] hover:shadow-[0_0_30px_rgba(0,200,150,0.15)] transition-all duration-500 cursor-default"
           >
             <div className="flex justify-between items-start mb-4">
               <h4 className="font-bebas text-green-forensic text-2xl tracking-widest flex items-center gap-2">
                 <Terminal className="w-5 h-5" /> DEFENDER
               </h4>
               {defenderMsg.claim_ref && (
                 <span className="bg-green-forensic/10 text-green-forensic text-[9px] px-3 py-1.5 font-pixel uppercase tracking-widest max-w-[250px] truncate rounded border border-green-forensic/20" title={defenderMsg.claim_ref}>
                   Ref: {defenderMsg.claim_ref}
                 </span>
               )}
             </div>
             <div className="text-off-white/90 bg-black/40 p-4 rounded border border-white/5">
                <TypewriterText 
                  text={defenderMsg.content} 
                  delay={200} 
                  onComplete={() => setShowProsecutor(true)} 
                />
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {prosecutorMsg && showProsecutor && (
          <motion.div
            key={`pro-${index}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex justify-center -my-2 relative z-10">
              <span className="font-bebas text-5xl text-red-forensic tracking-tighter bg-[#050508] px-4 rounded-full shadow-[0_0_20px_rgba(255,61,61,0.2)] border border-red-forensic/20">
                VS
              </span>
            </div>

            <div className="glass p-8 verdict-border-red relative shadow-[0_0_20px_rgba(255,61,61,0.05)] hover:shadow-[0_0_30px_rgba(255,61,61,0.15)] transition-all duration-500 cursor-default">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bebas text-red-forensic text-2xl tracking-widest flex items-center gap-2">
                  <Terminal className="w-5 h-5" /> PROSECUTOR
                </h4>
              </div>
              <div className="text-off-white/90 bg-black/40 p-4 rounded border border-white/5">
                 <TypewriterText text={prosecutorMsg.content} delay={500} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentRuling ? (
          <motion.div
            key={`ruling-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 border-white/20 border-t-4 border-t-off-white relative mt-8 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bebas text-off-white text-3xl tracking-widest flex items-center gap-3">
                <Gavel className="w-6 h-6" /> FINAL RULING
              </h4>
              <span className="font-pixel text-[10px] uppercase text-muted-forensic bg-white/5 px-3 py-1 rounded">
                Confidence: {currentRuling.confidence * 100}%
              </span>
            </div>
            <div className={`font-mono text-[16px] font-bold tracking-widest px-4 py-2 border-2 inline-block mb-6 rounded shadow-lg
              ${currentRuling.verdict === 'VERIFIED' ? 'text-green-forensic border-green-forensic bg-green-forensic/10 shadow-green-forensic/20' : 
                currentRuling.verdict === 'FALSE' ? 'text-red-forensic border-red-forensic bg-red-forensic/10 shadow-red-forensic/20' : 
                currentRuling.verdict === 'EXAGGERATED' ? 'text-amber-forensic border-amber-forensic bg-amber-forensic/10 shadow-amber-forensic/20' : 
                'text-muted-forensic border-muted-forensic bg-white/5'}`}
            >
              {currentRuling.verdict}
            </div>
            <p className="font-sans text-base text-off-white leading-relaxed">
              {currentRuling.reasoning}
            </p>
            <div className="mt-8 pt-6 border-t border-white/10">
               <p className="font-pixel text-[10px] text-muted-forensic uppercase leading-[2]">
                 <span className="text-off-white font-bold mr-2 text-xs">Core Finding:</span> {currentRuling.key_point}
               </p>
            </div>
          </motion.div>
        ) : (
          showProsecutor && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="glass p-8 verdict-border-amber relative mt-8 shadow-[0_0_20px_rgba(255,149,0,0.05)] hover:shadow-[0_0_30px_rgba(255,149,0,0.1)] transition-all"
            >
              <h4 className="font-bebas text-amber-forensic text-2xl mb-4 uppercase tracking-widest flex items-center justify-between">
                <span className="flex items-center gap-2"><Gavel className="w-5 h-5" /> YOU JUDGE</span>
                {isJudging && <Loader2 className="w-5 h-5 animate-spin text-amber-forensic" />}
              </h4>
              <div className="relative group">
                <input 
                  type="text" 
                  value={hitlInput}
                  onChange={(e) => setHitlInput(e.target.value)}
                  onKeyDown={handleJudgeSubmit}
                  disabled={isJudging || !sessionId}
                  placeholder={sessionId ? "Intercept the debate. Type your direction and press Enter..." : "Connect backend to judge..."} 
                  className="w-full bg-[#050508] border border-white/10 p-5 pr-12 rounded font-mono text-sm text-off-white placeholder:text-muted-forensic focus:outline-none focus:border-amber-forensic focus:shadow-[0_0_25px_rgba(255,149,0,0.2)] transition-all duration-300 disabled:opacity-50"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-forensic group-focus-within:text-amber-forensic transition-colors">
                  <Send className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
