// /src/widgets/hero/ui/particles-canvas.tsx

'use client';

import { useEffect, memo, useRef, useCallback } from 'react';
import { 
  PARTICLE_COUNT,
  PARTICLE_OPACITY_MAX,
  PARTICLE_OPACITY_MIN,
  PARTICLE_SIZE_MAX,
  PARTICLE_SIZE_MIN,
  PARTICLE_SPEED_MAX,
  PARTICLE_SPEED_MIN 
} from '../model/constants';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  vx: number;
  vy: number;
}

const PARTICLE_COLOR = '103, 232, 249';
const VELOCITY_RANGE = 0.3;

export const ParticlesCanvas = memo(function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mountedRef = useRef(true);
  
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas?.parentElement) return;
    
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }, []);
  
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
      speed: Math.random() * (PARTICLE_SPEED_MAX - PARTICLE_SPEED_MIN) + PARTICLE_SPEED_MIN,
      opacity: Math.random() * (PARTICLE_OPACITY_MAX - PARTICLE_OPACITY_MIN) + PARTICLE_OPACITY_MIN,
      vx: (Math.random() - 0.5) * VELOCITY_RANGE,
      vy: (Math.random() - 0.5) * VELOCITY_RANGE
    }));
  }, []);
  
  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    
    if (!canvas || !context || !mountedRef.current) return;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesRef.current.forEach(particle => {
      // Обновление позиции
      particle.x += particle.vx * particle.speed;
      particle.y += particle.vy * particle.speed;
      
      // Отражение от краев
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      
      // Рисуем частицу
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fillStyle = `rgba(${PARTICLE_COLOR}, ${particle.opacity})`;
      context.fill();
      
      // Свечение
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size + 1, 0, Math.PI * 2);
      context.fillStyle = `rgba(${PARTICLE_COLOR}, ${particle.opacity * 0.5})`;
      context.fill();
    });
    
    animationFrameRef.current = requestAnimationFrame(animateParticles);
  }, []);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Простой resize без throttling
    const handleResize = () => {
      updateCanvasSize();
      initParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    updateCanvasSize();
    initParticles();
    
    // Задержка старта анимации для улучшения LCP
    const timeout = setTimeout(() => {
      if (mountedRef.current) {
        animationFrameRef.current = requestAnimationFrame(animateParticles);
      }
    }, 100);
    
    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      particlesRef.current = [];
    };
  }, [updateCanvasSize, initParticles, animateParticles]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
});