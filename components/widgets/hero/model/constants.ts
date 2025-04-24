// /src/widgets/hero/model/constants.ts

import { GALLERY_IMAGES_AVIF } from '@/public/images/index';

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
export const CAROUSEL_IMAGE_COUNT = GALLERY_IMAGES_AVIF.length;

// Настройки параллакса
export const PARALLAX_FACTOR = 0.3;
export const PARALLAX_SCALE_FACTOR = 0.0003;

// Получение пути к изображению по индексу (с учетом новой структуры данных)
export const getImagePath = (index: number): string => {
  // Находим изображение по id (индексы в массиве начинаются с 0, а id с 1)
  const image = GALLERY_IMAGES_AVIF.find(img => img.id === index);
  // Возвращаем путь к изображению, или первое изображение как запасной вариант
  return image ? image.path : GALLERY_IMAGES_AVIF[0].path;
};

// Получение alt текста для изображения
export const getImageAlt = (index: number): string => {
  const image = GALLERY_IMAGES_AVIF.find(img => img.id === index);
  return image ? image.alt : 'Изображение галереи';
};