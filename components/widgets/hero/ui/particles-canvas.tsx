// /src/widgets/hero/ui/particles-canvas.tsx

'use client';

import { useEffect, useState, useMemo, memo } from 'react';
import { Particle } from '../model/types';
import { 
  PARTICLE_COUNT, 
  PARTICLE_OPACITY_MAX, 
  PARTICLE_OPACITY_MIN, 
  PARTICLE_SIZE_MAX, 
  PARTICLE_SIZE_MIN, 
  PARTICLE_SPEED_MAX, 
  PARTICLE_SPEED_MIN 
} from '../model/constants';

// Вспомогательная функция для генерации уникального ID
const generateId = () => Math.random().toString(36).substring(2, 10);

// Вспомогательная функция для генерации частиц
const generateParticles = (count: number): Particle[] => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
      speed: Math.random() * (PARTICLE_SPEED_MAX - PARTICLE_SPEED_MIN) + PARTICLE_SPEED_MIN,
      opacity: Math.random() * (PARTICLE_OPACITY_MAX - PARTICLE_OPACITY_MIN) + PARTICLE_OPACITY_MIN,
      id: generateId()
    });
  }
  return particles;
};

export const ParticlesCanvas = memo(function ParticlesCanvas() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Инициализация частиц только на клиенте
  useEffect(() => {
    setIsClient(true);
    setParticles(generateParticles(PARTICLE_COUNT));
    
    // Добавляем регенерацию частиц через интервал для оживления эффекта
    const regenerationInterval = setInterval(() => {
      setParticles(prevParticles => {
        // Обновляем только 10% частиц каждый раз
        const particlesToUpdate = Math.ceil(prevParticles.length * 0.1);
        const newParticles = [...prevParticles];
        
        for (let i = 0; i < particlesToUpdate; i++) {
          const randomIndex = Math.floor(Math.random() * newParticles.length);
          newParticles[randomIndex] = {
            ...generateParticles(1)[0],
            id: newParticles[randomIndex].id // Сохраняем существующий ID
          };
        }
        
        return newParticles;
      });
    }, 5000); // Каждые 5 секунд
    
    return () => clearInterval(regenerationInterval);
  }, []);

  // Мемоизируем стили для анимации для предотвращения пересоздания
  const animationStyles = useMemo(() => `
    @keyframes float {
      0%, 100% {
        transform: translateY(0) translateX(0);
      }
      25% {
        transform: translateY(-10px) translateX(5px);
      }
      50% {
        transform: translateY(0) translateX(10px);
      }
      75% {
        transform: translateY(10px) translateX(5px);
      }
    }
  `, []);

  // Если не на клиенте, возвращаем пустой компонент
  if (!isClient) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-10" 
      aria-hidden="true"
    >
      {particles.map((particle) => {
        // Вычисляем значения для анимации
        const animationName = "float";
        const animationDuration = `${5 / particle.speed}s`;
        const animationTimingFunction = "ease-in-out";
        const animationIterationCount = "infinite";
        const animationDelay = `${parseInt(particle.id, 36) % 10 * 0.1}s`;
        
        return (
          <div
            key={particle.id}
            className="absolute rounded-full bg-cyan-300"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationName,
              animationDuration,
              animationTimingFunction,
              animationIterationCount,
              animationDelay,
              boxShadow: '0 0 6px rgba(103, 232, 249, 0.5)'
            }}
          />
        );
      })}

      {/* Стили для анимации частиц */}
      <style jsx global>{animationStyles}</style>
    </div>
  );
});