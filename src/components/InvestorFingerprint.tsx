import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModeStore } from '../store/modeStore';
import { ChevronDown } from 'lucide-react';

const funds = [
  {
    name: "Sequoia Capital",
    thesis: "Obsesses over market size. TAM claims under extreme scrutiny.",
    analysis: "Our forensic engine shifts focus to bottom-up market sizing. We cross-reference your TAM claims against proprietary Sequoia benchmarks for similar sectors."
  },
  {
    name: "Y Combinator",
    thesis: "Founder-market fit above all. Who are you and why you?",
    analysis: "Analysis prioritizes the 'Team' slide. We verify every credential, previous exit claim, and technical contribution to ensure you are the 0.1%."
  },
  {
    name: "Tiger Global",
    thesis: "Growth at any cost. YoY numbers are everything.",
    analysis: "The engine hammers your cohort analysis and LTV/CAC ratios. We look for 'growth hacks' that mask unsustainable burn rates."
  },
  {
    name: "a16z",
    thesis: "Technical moat. Is the tech genuinely defensible?",
    analysis: "Deep-scan of technical claims. We analyze your 'moat' against open-source trends and patent filings to see if you're actually building or just wrapping."
  }
];

export default function InvestorFingerprint() {
  const { selectedFund, setSelectedFund } = useModeStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentFund = funds.find(f => f.name === selectedFund) || funds[0];

  return (
    <div className="glass p-8 verdict-border-amber relative flex flex-col h-full w-full">
      <div className="flex justify-between items-start mb-8">
        <span className="font-mono text-xs text-amber-forensic/60">05</span>
        <span className="font-bebas text-[10px] tracking-[0.2em] text-amber-forensic border border-amber-forensic/30 px-2 py-0.5 rounded-[2px] uppercase">
          SIMULATE A FUND
        </span>
      </div>

      <div className="relative mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-background/50 border border-border p-4 rounded-[4px] font-bebas text-xl text-off-white tracking-wide"
        >
          {selectedFund}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown className="w-5 h-5 text-amber-forensic" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0, opacity: 0 }}
              className="absolute top-full left-0 w-full bg-card border border-border z-50 origin-top overflow-hidden"
            >
              {funds.map((fund) => (
                <button
                  key={fund.name}
                  onClick={() => {
                    setSelectedFund(fund.name);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-4 hover:bg-amber-forensic/10 transition-colors border-b border-border last:border-0 group"
                >
                  <div className="flex flex-col">
                    <span className="font-bebas text-lg text-off-white">{fund.name}</span>
                    <span className="font-mono text-[10px] text-muted-forensic group-hover:text-amber-forensic/70 transition-colors">
                      {fund.thesis}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFund}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="font-sans font-bold text-xl text-off-white">Analysis Parameters</h3>
            <p className="font-sans text-sm text-muted-forensic leading-relaxed">
              {currentFund.analysis}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
