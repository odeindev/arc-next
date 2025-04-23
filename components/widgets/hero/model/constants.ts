// /src/widgets/hero/model/constants.ts

// Константы для компонентов Hero секции

// Настройки частиц
export const PARTICLE_COUNT = 50;
export const PARTICLE_SIZE_MIN = 0.5;
export const PARTICLE_SIZE_MAX = 2.0;
export const PARTICLE_SPEED_MIN = 0.1;
export const PARTICLE_SPEED_MAX = 0.6;
export const PARTICLE_OPACITY_MIN = 0.3;
export const PARTICLE_OPACITY_MAX = 0.8;

// Настройки карусели
export const CAROUSEL_TRANSITION_DURATION = 300; // мс
export const CAROUSEL_INTERVAL = 5000; // мс
export const CAROUSEL_IMAGE_COUNT = 12;

// Настройки параллакса
export const PARALLAX_FACTOR = 0.3;
export const PARALLAX_SCALE_FACTOR = 0.0003;

// Пути к изображениям
export const getImagePath = (index: number): string => 
  `/images/gallery-${String(index).padStart(2, '0')}.avif`;