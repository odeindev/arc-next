// /src/widgets/hero/model/types.ts

// Типы для компонентов секции Hero

// Базовые пропсы для HeroSection
export interface HeroProps {
  className?: string;
  serverVersion?: string;
  serverIp?: string;
}

// Типы для частиц
export interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  id: string; // Уникальный идентификатор для оптимизации рендеринга
}

// Расширенные типы для карусели изображений
export interface CarouselState {
  currentImageIndex: number;
  isTransitioning: boolean;
  preloadedImages: Set<number>;
}

export type CarouselAction = 
  | { type: 'SET_CURRENT_IMAGE'; payload: number }
  | { type: 'SET_TRANSITIONING'; payload: boolean }
  | { type: 'ADD_PRELOADED_IMAGE'; payload: number }
  | { type: 'START_TRANSITION'; payload: number };

// Типы для сервер-инфо карточки
export interface ServerInfoProps {
  serverVersion: string;
  serverIp: string;
  onCopy: () => Promise<boolean>;
  copied: boolean;
}

// Типы для событий карусели
export interface CarouselEvents {
  onSlideChange?: (index: number) => void;
  onTransitionEnd?: () => void;
  onImageLoad?: (index: number) => void;
  onImageError?: (index: number, error: Error) => void;
}