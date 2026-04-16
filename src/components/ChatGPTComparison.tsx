import React from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const comparison = [
  { chatgpt: "Generic AI analysis", bluffbuster: "Forensic evidence extraction" },
  { chatgpt: "Hallucination risk", bluffbuster: "Real-time web verification" },
  { chatgpt: "Surface-level feedback", bluffbuster: "Deep-scan financial stress testing" },
  { chatgpt: "Static response", bluffbuster: "Adversarial agent debate" },
  { chatgpt: "No source citations", bluffbuster: "Evidence with receipts" },
  { chatgpt: "Gives an opinion", bluffbuster: "Gives you the truth" }
];

export default function ChatGPTComparison() {
  return (
    <section className="relative min-h-screen bg-transparent py-32 px-4 md:px-20 overflow-hidden">
      {/* Background Gradients for Depth */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-red-forensic/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-green-forensic/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="font-bebas text-[clamp(48px,8vw,120px)] text-off-white text-center mb-24 leading-none">
          WHY NOT JUST USE CHATGPT?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ChatGPT Column */}
          <div className="glass bg-white/[0.02] p-10 border-white/5 rounded-lg space-y-8">
            <h3 className="font-pixel text-[10px] text-muted-forensic tracking-[0.2em] mb-10 uppercase">CHATGPT WITH A PROMPT</h3>
            {comparison.map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-red-forensic/10 border border-red-forensic/30 rounded-[2px]">
                  <X className="w-4 h-4 text-red-forensic" />
                </div>
                <span className="font-pixel text-[8px] text-muted-forensic leading-relaxed">{item.chatgpt}</span>
              </motion.div>
            ))}
          </div>

          {/* BluffBuster Column */}
          <div className="glass bg-red-forensic/[0.04] p-10 border-red-forensic/10 rounded-lg space-y-8">
            <h3 className="font-pixel text-[10px] text-red-forensic tracking-[0.2em] mb-10 uppercase">BLUFFBUSTER</h3>
            {comparison.map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-green-forensic/5 neon-hover-green transition-all duration-300 cursor-default"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-green-forensic/10 border border-green-forensic/30 rounded-[2px]">
                  <Check className="w-4 h-4 text-green-forensic" />
                </div>
                <span className="font-pixel text-[8px] text-off-white leading-relaxed">{item.bluffbuster}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="font-pixel text-[10px] text-amber-forensic max-w-4xl mx-auto leading-[2] tracking-widest uppercase">
            "ChatGPT gives you an opinion. BluffBuster gives you evidence with receipts. That is the difference."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
