// /src/widgets/hero/ui/hero-section.tsx

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/components/shared/lib/utils';
import { HeroProps, CarouselState } from '@/components/widgets/hero/model/types';
import { ImageCarousel } from '@/components/widgets/hero/ui/image-carousel';
import { ParticlesCanvas } from '@/components/widgets/hero/ui/particles-canvas';
import { ServerInfoCard } from '@/components/widgets/hero/ui/server-info-card';
import { calculateParallaxStyles } from '@/components/widgets/hero/lib/parallax';
import { CAROUSEL_IMAGE_COUNT, CAROUSEL_TRANSITION_DURATION } from '@/components/widgets/hero/model/constants';
import { preloadImage } from '@/components/widgets/hero/lib/image-preload';

export const HeroSection = ({
  className,
  serverVersion = '1.18.2',
  serverIp = 'arcadia-craft.net',
}: HeroProps) => {
  // Состояния
  const [copied, setCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Состояние карусели, теперь в родительском компоненте
  const [carouselState, setCarouselState] = useState<CarouselState>({
    currentImageIndex: 1,
    isTransitioning: false,
    preloadedImages: new Set([1]),
  });

  // Мемоизированное вычисление стилей для параллакса
  const parallaxStyles = useMemo(() => calculateParallaxStyles(scrollY), [scrollY]);

  // Эффект для отслеживания скролла и установки видимости
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const visibilityTimeout = setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(visibilityTimeout);
    };
  }, []);

  // Функция для копирования IP адреса в буфер обмена с обработкой ошибок
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(serverIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy: ', err);
      return false;
    }
  }, [serverIp]);

  // Обновление состояния предзагруженных изображений
  const updatePreloadedImages = useCallback((index: number) => {
    setCarouselState(prev => ({
      ...prev,
      preloadedImages: new Set([...prev.preloadedImages, index])
    }));
  }, []);

  // Функция для предзагрузки следующего изображения
  const preloadNextImage = useCallback((nextIndex: number) => {
    if (carouselState.preloadedImages.has(nextIndex)) return;
    preloadImage(nextIndex, () => updatePreloadedImages(nextIndex));
  }, [carouselState.preloadedImages, updatePreloadedImages]);

  // Функция для переключения слайда
  const handleSlideChange = useCallback((nextIndex: number) => {
    if (nextIndex === carouselState.currentImageIndex || carouselState.isTransitioning) return;
    
    preloadNextImage(nextIndex);
    setCarouselState(prev => ({ ...prev, isTransitioning: true }));
    
    setTimeout(() => {
      setCarouselState(prev => ({ ...prev, currentImageIndex: nextIndex }));
      
      // Предзагружаем изображение, которое будет после следующего
      const afterNextIndex = (nextIndex % CAROUSEL_IMAGE_COUNT) + 1;
      preloadNextImage(afterNextIndex);
      
      setTimeout(() => {
        setCarouselState(prev => ({ ...prev, isTransitioning: false }));
      }, CAROUSEL_TRANSITION_DURATION);
    }, CAROUSEL_TRANSITION_DURATION);
  }, [carouselState.currentImageIndex, carouselState.isTransitioning, preloadNextImage]);

  // Предзагрузка начальной партии при первом рендере
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Предзагружаем следующие несколько изображений (2, 3)
      preloadNextImage(2);
      preloadNextImage(3);
    }
  }, [preloadNextImage]);

  // Автоматическая смена изображений
  useEffect(() => {
    if (carouselState.isTransitioning) return;
    
    const imageInterval = setInterval(() => {
      const nextIndex = (carouselState.currentImageIndex % CAROUSEL_IMAGE_COUNT) + 1;
      handleSlideChange(nextIndex);
    }, 5000); // Интервал между сменой слайдов

    return () => clearInterval(imageInterval);
  }, [carouselState.currentImageIndex, carouselState.isTransitioning, handleSlideChange]);

  return (
    <section 
      ref={heroRef}
      className={cn(
        'relative w-full h-[1080px] min-h-screen overflow-hidden',
        className
      )}
      aria-label="Главная секция Arcadia Craft"
    >
      {/* Фоновое изображение с параллакс-эффектом */}
      <div 
        className="relative w-full h-full overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {/* Компонент карусели */}
        <ImageCarousel 
          parallaxStyles={parallaxStyles} 
          carouselState={carouselState} 
        />
        
        {/* Компонент с частицами */}
        <ParticlesCanvas />

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
                "font-normal text-base md:text-lg lg:text-xl max-w-4xl mx-auto mb-6 text-slate-100 font-mulish transition-all duration-1000 delay-300",
                isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10"
              )}
            >
              Исследуйте захватывающий мир, воплощайте креативные идеи и объединяйтесь с единомышленниками.
              Погрузитесь в атмосферу древнегреческой эстетики, где каждый игрок найдет свое неповторимое приключение.
            </p>

            {/* Индикаторы карусели - теперь размещены под текстом */}
            <div 
              className={cn(
                "flex justify-center gap-2 mb-8 transition-opacity duration-1000 delay-400",
                isVisible ? "opacity-100" : "opacity-0"
              )}
              role="navigation" 
              aria-label="Навигация по галерее изображений"
            >
              {Array.from({ length: CAROUSEL_IMAGE_COUNT }, (_, i) => (
                <button
                  key={i}
                  type="button" 
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    carouselState.currentImageIndex === i + 1 
                      ? "bg-cyan-400 w-6" 
                      : "bg-gray-400/50 hover:bg-gray-300/70"
                  )}
                  onClick={() => handleSlideChange(i + 1)}
                  aria-label={`Перейти к изображению ${i + 1}`}
                  aria-current={carouselState.currentImageIndex === i + 1 ? "true" : "false"}
                ></button>
              ))}
            </div>

            {/* Компонент с информацией о сервере */}
            <div 
              className={cn(
                "transition-all duration-1000 delay-500",
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              )}
            >
              <ServerInfoCard 
                serverVersion={serverVersion} 
                serverIp={serverIp} 
                onCopy={copyToClipboard} 
                copied={copied} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};