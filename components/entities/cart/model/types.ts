// entities/cart/model/types.ts

export type Duration = "30-d" | "90-d" | "1-y";

export interface CartProduct {
  id: number;
  name: string;
  icon?: string;
  type: "subscription" | "key";
  price: number; // числовое значение, форматирование на уровне UI
}

export interface CartItemModel {
  product: CartProduct;
  quantity: number;
  duration: Duration;
}
