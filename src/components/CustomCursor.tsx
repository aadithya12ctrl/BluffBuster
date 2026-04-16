import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);

  const mouseX = useSpring(0, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('button, a, .interactive-card'));
      setIsText(!!target.closest('p, h1, h2, h3, span:not(.no-cursor-effect)'));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: mouseX,
        y: mouseY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        animate={{
          scale: isText ? 0.3 : isHovering ? 1.6 : 1,
          backgroundColor: isText ? '#FF3D3D' : 'transparent',
          borderWidth: isText ? 0 : 2,
        }}
        className="w-5 h-5 rounded-full border-red-forensic/50"
      />
    </motion.div>
  );
}
