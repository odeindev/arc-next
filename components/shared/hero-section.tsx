'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/components/shared/lib/utils';
import { Check, Copy, Server } from 'lucide-react';

interface HeroProps {
  className?: string;
  serverVersion?: string;
  serverIp?: string;
}

export const HeroSection = ({
  className,
  serverVersion = '1.18.2',
  serverIp = 'arcadia-craft.net',
}: HeroProps) => {
  const [copied, setCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; speed: number; opacity: number }>>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set([1]));

  // Функция для предзагрузки следующего изображения
  const preloadNextImage = (nextIndex: number) => {
    if (preloadedImages.has(nextIndex)) return;
    
    // Используем HTMLImageElement вместо Image, чтобы избежать конфликта с компонентом Next.js
    const img = new window.Image();
    img.src = `/images/gallery-${String(nextIndex).padStart(2, '0')}.avif`;
    img.onload = () => {
      setPreloadedImages(prev => new Set([...prev, nextIndex]));
    };
  };

  // Создаем эффект параллакса при скролле
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Инициализация частиц
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.5 + 0.3
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener('scroll', handleScroll);
    
    const visibilityTimeout = setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(visibilityTimeout);
    };
  }, []);

  // Эффект для автоматической смены изображений каждые 5 секунд
  useEffect(() => {
    const imageInterval = setInterval(() => {
      // Предзагружаем следующее изображение
      const nextIndex = (currentImageIndex % 12) + 1;
      preloadNextImage(nextIndex);
      
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(nextIndex);
        
        // Предзагружаем изображение, которое будет после следующего
        preloadNextImage((nextIndex % 12) + 1);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 300);
    }, 5000);

    return () => clearInterval(imageInterval);
  }, [currentImageIndex]);

  // Предзагрузка ближайших нескольких изображений при первом рендере
  useEffect(() => {
    // Убедимся, что выполняется только на клиенте
    if (typeof window !== 'undefined') {
      const preloadInitialBatch = () => {
        // Предзагружаем следующие несколько изображений (2, 3)
        preloadNextImage(2);
        preloadNextImage(3);
      };
      
      preloadInitialBatch();
    }
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      return false;
    }
  };

  // Вычисляем коэффициент параллакса в зависимости от высоты секции
  const parallaxFactor = 0.3;
  const parallaxOffset = scrollY * parallaxFactor;

  // Получаем текущий путь к изображению
  const currentImagePath = `/images/gallery-${String(currentImageIndex).padStart(2, '0')}.avif`;

  // Функция для переключения слайда по клику
  const handleSlideClick = (index: number) => {
    if (index === currentImageIndex) return;
    
    preloadNextImage(index);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  return (
    <section 
      ref={heroRef}
      className={cn(
        'relative w-full h-[1080px] min-h-screen overflow-hidden',
        className
      )}
    >
      {/* Фоновое изображение с параллакс-эффектом */}
      <div 
        className="relative w-full h-full overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {/* Контейнер с параллакс-эффектом */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            transform: `translateY(${parallaxOffset}px) scale(${1 + scrollY * 0.0003})`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Используем div-обертку для позиционирования и размеров */}
          <div className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%]">
            <div
              className={cn(
                "relative w-full h-full transition-opacity duration-300",
                isTransitioning ? "opacity-0" : "opacity-100"
              )}
            >
              <Image
                src={currentImagePath}
                alt="Arcadia Craft Server"
                fill
                priority={currentImageIndex === 1}
                loading={currentImageIndex === 1 ? "eager" : "lazy"}
                sizes="120vw"
                className="object-cover object-center"
                style={{ 
                  filter: 'brightness(0.7)'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Overlay с градиентом */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>
        
        {/* Анимированные частицы */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle, index) => (
            <div
              key={index}
              className="absolute rounded-full bg-cyan-300"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animation: `float ${5 / particle.speed}s infinite ease-in-out`,
                animationDelay: `${index * 0.1}s`
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center px-4 md:px-8">
          <div 
            className={cn(
              "max-w-6xl mx-auto text-center transition-all duration-1000",
              isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-10"
            )}
          >
            {/* Анимированный заголовок */}
            <div className="mb-6 md:mb-10 relative">
              <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-2 text-white">
                Добро пожаловать на
              </h1>
              <div className="relative inline-block">
                <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 text-white font-chakra-petch">
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                    ARCADIA CRAFT
                  </span>
                </h1>
                {/* Декоративная линия под названием */}
                <div className="h-1 w-full bg-gradient-to-r from-cyan-200 via-blue-400 to-cyan-600 rounded-full"></div>
              </div>
            </div>

            {/* Подзаголовок с тайпрайтер-эффектом */}
            <p 
              className={cn(
                "font-normal text-base md:text-lg lg:text-xl max-w-4xl mx-auto mb-8 text-slate-100 font-mulish transition-all duration-1000 delay-300",
                isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
              )}
            >
              Исследуйте захватывающий мир, воплощайте креативные идеи и объединяйтесь с единомышленниками.
              Погрузитесь в атмосферу древнегреческой эстетики, где каждый игрок найдет свое неповторимое приключение.
            </p>

            {/* Индикаторы слайдов */}
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: 12 }, (_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer",
                    currentImageIndex === i + 1 
                      ? "bg-cyan-400 w-4" 
                      : "bg-gray-400/50 hover:bg-gray-300/70"
                  )}
                  onClick={() => handleSlideClick(i + 1)}
                ></div>
              ))}
            </div>

            {/* Карточка с информацией о сервере - стеклянный дизайн */}
            <div
              className={cn(
                'bg-gradient-to-br from-slate-900/80 to-slate-700/50 backdrop-blur-lg rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(74,144,226,0.3)] max-w-lg mx-auto mt-4 transition-all duration-1000 delay-500 border border-slate-600/30',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              )}
            >
              <div className="relative p-8">
                {/* Блики на стекле */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Информация о версии */}
                <div className="flex items-center justify-center gap-4 mb-6 relative">
                  <Server className="text-cyan-400" size={24} />
                  <span className="font-semibold text-white/90 text-lg">
                    Версия сервера:{' '}
                    <span className="bg-gradient-to-r from-teal-400 to-blue-400 text-transparent bg-clip-text font-bold">
                      {serverVersion}
                    </span>
                  </span>
                </div>

                {/* Копирование IP */}
                <div className="bg-slate-800/70 backdrop-blur-sm px-6 py-4 rounded-xl mb-2 relative overflow-hidden group">
                  {/* Анимированный фон при наведении */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="text-center text-slate-300 mb-2 font-medium">
                    Нажми, чтобы скопировать адрес:
                  </div>
                  <div
                    className="flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-700/50 p-3 rounded-lg transition-all duration-300 group relative"
                    onClick={copyToClipboard}
                    role="button"
                    aria-label="Скопировать IP адрес"
                  >
                    <span className="font-semibold text-white text-lg">IP:</span>
                    <span className="font-bold bg-gradient-to-r from-cyan-300 to-blue-400 text-transparent bg-clip-text mr-2 text-lg tracking-wide">
                      {serverIp}
                    </span>
                    <div className="relative">
                      {copied ? (
                        <Check size={20} className="text-green-400" />
                      ) : (
                        <Copy size={20} className="text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Уведомление о копировании */}
      {copied && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-xl animate-fadeIn z-50 backdrop-blur-sm flex items-center gap-2">
          <Check size={18} />
          IP-адрес скопирован!
        </div>
      )}

      {/* Добавляем стили для анимации частиц */}
      <style jsx global>{`
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
      `}</style>
    </section>
  );
};