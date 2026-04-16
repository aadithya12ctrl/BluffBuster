import React, { useEffect, useRef } from 'react';

export default function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: -1000, y: -1000 };
    const particles: Particle[] = [];
    const particleCount = 40;
    const gridSize = 50;

    class Particle {
      x: number;
      y: number;
      size: number;
      baseX: number;
      baseY: number;
      density: number;
      char: string;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2 + 1;
        this.density = (Math.random() * 30) + 1;
        const chars = ['0', '1', '+', '-', '×', '÷', '>', '_'];
        this.char = chars[Math.floor(Math.random() * chars.length)];
        
        const colors = ['rgba(255, 61, 61, 0.15)', 'rgba(0, 200, 150, 0.15)', 'rgba(255, 149, 0, 0.15)'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.font = '10px "Press Start 2P"';
        ctx.fillText(this.char, this.x, this.y);
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = 150;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;

        if (distance < maxDistance) {
          this.x -= directionX;
          this.y -= directionY;
        } else {
          if (this.x !== this.baseX) {
            const dx = this.x - this.baseX;
            this.x -= dx / 20;
          }
          if (this.y !== this.baseY) {
            const dy = this.y - this.baseY;
            this.y -= dy / 20;
          }
        }
      }
    }

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const mouseTrail: { x: number, y: number, age: number }[] = [];

    const drawGrid = () => {
      if (!ctx) return;
      
      const time = Date.now() * 0.001;
      
      // Update trail
      if (mouse.x > 0) {
        mouseTrail.push({ x: mouse.x, y: mouse.y, age: 1 });
      }
      if (mouseTrail.length > 20) mouseTrail.shift();
      mouseTrail.forEach(t => t.age *= 0.9);

      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Check trail
          let trailIntensity = 0;
          mouseTrail.forEach(t => {
            const tdx = t.x - x;
            const tdy = t.y - y;
            const tdist = Math.sqrt(tdx * tdx + tdy * tdy);
            if (tdist < 100) trailIntensity = Math.max(trailIntensity, (100 - tdist) / 100 * t.age);
          });

          // Subtle flicker
          const flicker = Math.sin(time * 10 + (x + y) * 0.01) * 0.5 + 0.5;
          
          if (distance < 250 || trailIntensity > 0) {
            const distOpacity = distance < 250 ? (250 - distance) / 250 : 0;
            const opacity = Math.max(distOpacity * 0.15, trailIntensity * 0.3) * flicker;
            
            ctx.strokeStyle = `rgba(255, 61, 61, ${opacity})`;
            ctx.strokeRect(x - 1, y - 1, 3, 3);
            
            // Connecting lines to mouse
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = `rgba(255, 61, 61, ${opacity * 0.2})`;
              ctx.stroke();
            }
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.02 * flicker})`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    };

    const drawGlitch = () => {
      if (!ctx || Math.random() > 0.95) return;
      
      const y = Math.random() * height;
      const h = Math.random() * 2;
      ctx.fillStyle = `rgba(255, 61, 61, ${Math.random() * 0.05})`;
      ctx.fillRect(0, y, width, h);
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawGlitch();
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-50"
      style={{ 
        mixBlendMode: 'screen',
        imageRendering: 'pixelated'
      }}
    />
  );
}
