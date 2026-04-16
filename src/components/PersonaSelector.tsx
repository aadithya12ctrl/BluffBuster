import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trees, Zap, TrendingUp, Cpu, Microscope, Check } from 'lucide-react';

export const INVESTOR_PERSONAS = [
  { id: 'standard', name: 'Standard VC', icon: Microscope, color: '#00F096', description: 'Balanced forensic audit.' },
  { id: 'sequoia', name: 'Sequoia Capital', icon: Trees, color: '#004e1c', description: 'Moats & Market Domination.' },
  { id: 'yc', name: 'Y Combinator', icon: Zap, color: '#ff6600', description: 'Velocity & Founder Fit.' },
  { id: 'tiger', name: 'Tiger Global', icon: TrendingUp, color: '#000000', description: 'Aggressive Scale & Multiples.' },
  { id: 'benchmark', name: 'Benchmark', icon: Cpu, color: '#0070f3', description: 'Product-Led Growth.' }
];

interface PersonaSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export default function PersonaSelector({ selectedId, onSelect, disabled }: PersonaSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selected = INVESTOR_PERSONAS.find(p => p.id === selectedId) || INVESTOR_PERSONAS[0];

  return (
    <div className="relative w-full">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full glass p-4 border-white/10 flex items-center justify-between group transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/20'}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-sm flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
            <selected.icon className="w-5 h-5" style={{ color: selected.color }} />
          </div>
          <div className="text-left">
            <div className="font-bebas text-lg tracking-widest text-off-white uppercase">{selected.name}</div>
            <div className="font-space text-[9px] text-muted-forensic uppercase tracking-tighter">{selected.description}</div>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-forensic transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 glass border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="p-2 space-y-1">
                {INVESTOR_PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => {
                      onSelect(persona.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-4 flex items-center justify-between rounded-sm transition-all ${selectedId === persona.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-4">
                      <persona.icon className="w-4 h-4 text-muted-forensic" style={{ color: selectedId === persona.id ? persona.color : undefined }} />
                      <div className="text-left">
                        <div className="font-bebas text-md tracking-widest text-off-white uppercase italic">{persona.name}</div>
                        <div className="font-space text-[8px] text-muted-forensic uppercase">{persona.description}</div>
                      </div>
                    </div>
                    {selectedId === persona.id && <Check className="w-4 h-4 text-green-forensic" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
