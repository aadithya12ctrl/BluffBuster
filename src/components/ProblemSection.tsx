import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { useTypewriter } from '../hooks/useTypewriter';

gsap.registerPlugin(ScrollTrigger);

const ProblemCard = ({ tag, title, body, color, index }: { tag: string, title: string, body: string, color: string, index: number }) => {
  const { displayedText } = useTypewriter(tag, 40, index * 500);

  return (
    <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center p-20">
      <div className={`glass w-full max-w-4xl p-16 relative overflow-hidden verdict-border-${color} neon-hover-${color} transition-all duration-500 cursor-default`}>
        <div className="font-pixel text-[8px] tracking-[0.4em] text-muted-forensic mb-8 uppercase leading-relaxed">
          {displayedText}
        </div>
        <motion.h2 
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="font-bebas text-7xl text-off-white mb-10 tracking-tight"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-pixel text-[10px] text-muted-forensic max-w-2xl leading-[1.8] tracking-wider"
        >
          {body}
        </motion.p>
      </div>
    </div>
  );
};

export default function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(sliderRef.current, {
        xPercent: -66.67,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${containerRef.current?.offsetWidth || 0 * 2}`,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-transparent overflow-hidden">
      <div ref={sliderRef} className="flex h-screen w-[300%]">
        <ProblemCard 
          tag="FOR INVESTORS" 
          title="Manual due diligence takes hours" 
          body="Sifting through hundreds of decks to find one truth is a forensic nightmare. Most VCs miss the subtle exaggerations that kill returns."
          color="amber"
          index={0}
        />
        <ProblemCard 
          tag="FOR FOUNDERS" 
          title="Founders walk in blind" 
          body="You don't know what the VC knows. You don't know which of your claims will trigger a red flag until the term sheet is pulled."
          color="green"
          index={1}
        />
        <ProblemCard 
          tag="THE REAL VILLAIN" 
          title="Exaggerated truths, not outright lies" 
          body="The most dangerous bluffs aren't the ones that are obviously false. They are the ones that are 'technically true' but fundamentally misleading."
          color="red"
          index={2}
        />
      </div>
    </section>
  );
}
