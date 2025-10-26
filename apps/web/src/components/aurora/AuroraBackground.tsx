'use client';

import { useEffect, useRef, useState } from 'react';

interface AuroraParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  color: string;
  size: number;
}

interface AuroraBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  interactive?: boolean;
  className?: string;
}

/**
 * AuroraBackground - Dynamic canvas-based northern lights simulation
 *
 * UltraThink Reasoning:
 * - Uses canvas for performance (better than DOM manipulation)
 * - Particle system creates organic flowing motion
 * - Color palette matches aurora theme (green, blue, purple)
 * - Interactive mode responds to mouse movement
 * - Intensity controls particle count and speed
 * - requestAnimationFrame ensures smooth 60fps animation
 */
export default function AuroraBackground({
  intensity = 'medium',
  interactive = true,
  className = ''
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<AuroraParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  // Intensity settings
  const intensityConfig = {
    low: { particleCount: 30, speed: 0.3, opacity: 0.3 },
    medium: { particleCount: 60, speed: 0.5, opacity: 0.5 },
    high: { particleCount: 100, speed: 0.8, opacity: 0.7 }
  };

  const config = intensityConfig[intensity];

  // Aurora color palette
  const colors = [
    'rgba(0, 255, 136, 0.6)',  // Aurora green
    'rgba(77, 148, 255, 0.6)', // Aurora blue
    'rgba(163, 102, 255, 0.6)', // Aurora purple
    'rgba(255, 102, 204, 0.4)', // Aurora pink
  ];

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: config.particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed * 0.3, // Slower vertical movement
        opacity: Math.random() * config.opacity,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3 + 1
      }));
    };
    initParticles();

    // Mouse move handler for interactivity
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Clear with slight trail effect for glow
      ctx.fillStyle = 'rgba(10, 17, 40, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Interactive particle attraction to mouse
        if (interactive) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const force = (200 - distance) / 200;
            particle.vx += (dx / distance) * force * 0.01;
            particle.vy += (dy / distance) * force * 0.01;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Dampen velocity
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Pulsing opacity
        particle.opacity += (Math.random() - 0.5) * 0.02;
        particle.opacity = Math.max(0.1, Math.min(config.opacity, particle.opacity));

        // Draw particle with glow
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.shadowBlur = 20;
        ctx.shadowColor = particle.color;

        // Draw main particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connecting lines between nearby particles
        particlesRef.current.forEach((other, otherIndex) => {
          if (otherIndex <= index) return;

          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = (1 - distance / 150) * particle.opacity * 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [intensity, interactive, config]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        background: 'linear-gradient(to bottom, #0a1128 0%, #1a2844 50%, #0a1128 100%)'
      }}
    />
  );
}
