// /src/widgets/hero/ui/particles-canvas.tsx

'use client';

import { useEffect, memo, useRef } from 'react';
import { 
  PARTICLE_COUNT,
  PARTICLE_OPACITY_MAX,
  PARTICLE_OPACITY_MIN,
  PARTICLE_SIZE_MAX,
  PARTICLE_SIZE_MIN,
  PARTICLE_SPEED_MAX,
  PARTICLE_SPEED_MIN 
} from '../model/constants';

// Значительно упрощаем компонент с частицами
export const ParticlesCanvas = memo(function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    vx: number;
    vy: number;
  }>>([]);
  
  // Меняем подход - используем Canvas вместо множества DOM-элементов
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Устанавливаем размер канваса
    const updateCanvasSize = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    
    // Инициализируем частицы
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
          speed: Math.random() * (PARTICLE_SPEED_MAX - PARTICLE_SPEED_MIN) + PARTICLE_SPEED_MIN,
          opacity: Math.random() * (PARTICLE_OPACITY_MAX - PARTICLE_OPACITY_MIN) + PARTICLE_OPACITY_MIN,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3
        });
      }
    };
    
    // Анимируем частицы
    const animateParticles = () => {
      if (!canvas || !context) return;
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        // Обновляем позицию
        particle.x += particle.vx * particle.speed;
        particle.y += particle.vy * particle.speed;
        
        // Отражаем от краев
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Рисуем частицу
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(103, 232, 249, ${particle.opacity})`;
        context.fill();
        
        // Добавляем свечение
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size + 1, 0, Math.PI * 2);
        context.fillStyle = `rgba(103, 232, 249, ${particle.opacity * 0.5})`;
        context.fill();
      });
      
      // Запускаем следующий кадр анимации
      animationFrameRef.current = requestAnimationFrame(animateParticles);
    };
    
    // Важно: сначала удаляем предыдущие обработчики, если они были
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    initParticles();
    
    // Запускаем анимацию
    animationFrameRef.current = requestAnimationFrame(animateParticles);
    
    // Очистка при размонтировании
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      // Очищаем массив частиц
      particlesRef.current = [];
    };
  }, []); // Важно: пустой массив зависимостей
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
});