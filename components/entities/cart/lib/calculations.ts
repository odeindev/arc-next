// utils/cart/calculations.ts

import { CartItem, durationMultipliers } from "@/components/store/useCartStore";

export const calculateItemSubtotal = (item: CartItem): number => {
  const { price } = item.product;

  if (item.product.type === "subscription" && item.duration) {
    return price * (durationMultipliers[item.duration] ?? 1);
  }

  return price * item.quantity;
};

export const calculateTotalSum = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + calculateItemSubtotal(item), 0);
};
