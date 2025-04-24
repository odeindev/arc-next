// /src/widgets/hero/lib/image-preload.ts

// Утилита для предзагрузки изображений

import { getImagePath } from "../model/constants";

// Добавляем кэш для хранения загруженных изображений
// и предотвращения повторной загрузки одних и тех же ресурсов
const preloadedCache = new Map<number, HTMLImageElement>();

/**
 * Функция для предзагрузки изображения
 * @param index - Индекс изображения (id изображения в массиве)
 * @param callback - Функция обратного вызова после загрузки изображения
 */
export const preloadImage = (index: number, callback: () => void): void => {
  // Проверка, что мы на клиенте
  if (typeof window === 'undefined') return;
  
  // Проверяем, есть ли уже изображение в кэше
  if (preloadedCache.has(index)) {
    // Если изображение уже загружено, просто вызываем callback
    callback();
    return;
  }
  
  const img = new window.Image();
  img.src = getImagePath(index);
  img.onload = () => {
    // Сохраняем в кэш
    preloadedCache.set(index, img);
    callback();
  };
};

/**
 * Функция для предзагрузки начальной партии изображений
 * @param initialImageIndexes - Массив индексов изображений для предзагрузки
 * @param updatePreloadedSet - Функция для обновления состояния предзагруженных изображений
 */
export const preloadInitialBatch = (
  initialImageIndexes: number[], 
  updatePreloadedSet: (index: number) => void
): void => {
  initialImageIndexes.forEach(index => {
    preloadImage(index, () => updatePreloadedSet(index));
  });
};

/**
 * Очистка кэша изображений
 * Вызывать при необходимости освободить память
 */
export const clearPreloadCache = (): void => {
  preloadedCache.clear();
};