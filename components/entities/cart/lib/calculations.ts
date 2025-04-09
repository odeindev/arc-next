// utils/cart/calculations.ts

import { CartItem, durationMultipliers } from '@/components/store/useCartStore';

/**
 * Извлекает числовое значение цены из строки
 * @param price Строка с ценой (например, '500 ₽')
 * @returns Числовое значение цены
 */
export const extractPriceValue = (price: string): number => {
  return Number(price.replace(/[^\d]/g, ''));
};

/**
 * Рассчитывает стоимость отдельного товара с учетом количества или длительности
 * @param item Элемент корзины
 * @returns Сумма для данного товара
 */
export const calculateItemSubtotal = (item: CartItem): number => {
  const price = extractPriceValue(item.product.price);
  
  // Если это привилегия, применяем коэффициент для периода
  if (item.product.type === 'subscription' && item.duration) {
    return price * (durationMultipliers[item.duration] || 1);
  }
  
  // Для ключей считаем с учетом количества
  return price * item.quantity;
};

/**
 * Рассчитывает общую сумму всех товаров в корзине
 * @param items Список товаров в корзине
 * @returns Общая сумма корзины
 */
export const calculateTotalSum = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + calculateItemSubtotal(item);
  }, 0);
};