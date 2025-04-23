// /src/widgets/hero/lib/parallax.ts

// Утилита для расчета параллакс-эффекта

import { PARALLAX_FACTOR, PARALLAX_SCALE_FACTOR } from "../model/constants";

/**
 * Расчет стилей для параллакс-эффекта
 * @param scrollY - Текущее значение скролла по вертикали
 * @returns Объект со стилями для применения параллакс-эффекта
 */
export const calculateParallaxStyles = (scrollY: number): React.CSSProperties => {
  const parallaxOffset = scrollY * PARALLAX_FACTOR;
  const scale = 1 + scrollY * PARALLAX_SCALE_FACTOR;
  
  return {
    transform: `translateY(${parallaxOffset}px) scale(${scale})`,
    transition: 'transform 0.1s ease-out'
  };
};