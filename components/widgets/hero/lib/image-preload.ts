// /src/widgets/hero/lib/image-preload.ts

// Утилита для предзагрузки изображений

import { getImagePath } from "../model/constants";

/**
 * Функция для предзагрузки изображения
 * @param index - Индекс изображения
 * @param callback - Функция обратного вызова после загрузки изображения
 */
export const preloadImage = (index: number, callback: () => void): void => {
  // Проверка, что мы на клиенте
  if (typeof window === 'undefined') return;
  
  const img = new window.Image();
  img.src = getImagePath(index);
  img.onload = callback;
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