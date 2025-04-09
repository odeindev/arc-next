// hooks/useCartCalculations.ts

import { useMemo } from 'react';
import { CartItem } from '@/components/store/useCartStore';
import { calculateTotalSum, calculateItemSubtotal } from '@/components/entities/cart/lib/calculations';

interface UseCartCalculationsReturn {
  total: number;
  calculateItemTotal: (item: CartItem) => number;
  isCartEmpty: boolean;
}

/**
 * Hook для расчетов, связанных с корзиной
 * @param cartItems Товары в корзине
 * @returns Объект с разными расчетными значениями
 */
export const useCartCalculations = (cartItems: CartItem[]): UseCartCalculationsReturn => {
  const isCartEmpty = useMemo(() => cartItems.length === 0, [cartItems]);
  
  const total = useMemo(() => {
    return calculateTotalSum(cartItems);
  }, [cartItems]);
  
  const calculateItemTotal = useMemo(() => {
    return (item: CartItem) => calculateItemSubtotal(item);
  }, []);
  
  return {
    total,
    calculateItemTotal,
    isCartEmpty
  };
};