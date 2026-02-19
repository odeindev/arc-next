// store/useCartStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Duration } from "../entities/cart/model/types";
import { Product } from "../../public/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  duration?: "30-d" | "90-d" | "180-d" | "1-y";
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  syncWithServer: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateDuration: (productId: number, duration: Duration) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItem: (productId: number) => CartItem | undefined;
}

export const durationMultipliers = {
  "30-d": 1,
  "90-d": 2.5,
  "180-d": 4.5,
  "1-y": 8,
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      items: [],

      // TODO: заменить на fetch("/api/cart") когда будет бэкенд
      fetchCart: async () => {
        // persist автоматически восстанавливает данные из localStorage
      },

      // TODO: раскомментировать когда будет бэкенд
      syncWithServer: async () => {
        // try {
        //   const response = await fetch("/api/cart", {
        //     method: "PUT",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ items: get().items }),
        //   });
        //   if (!response.ok) {
        //     throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
        //   }
        // } catch (error) {
        //   console.error("Error syncing cart with server:", error);
        // }
      },

      addItem: async (product: Product, quantity = 1) => {
        const { items } = get();

        if (product.type === "subscription") {
          const nonSubscriptions = items.filter(
            (item) => item.product.type !== "subscription",
          );
          const existing = items.find((item) => item.product.id === product.id);
          const duration = existing?.duration ?? "30-d";
          set({
            items: [...nonSubscriptions, { product, quantity: 1, duration }],
          });
        } else if (product.type === "key") {
          const existingKeyIndex = items.findIndex(
            (item) => item.product.id === product.id,
          );
          if (existingKeyIndex >= 0) {
            const updatedItems = [...items];
            updatedItems[existingKeyIndex] = {
              ...updatedItems[existingKeyIndex],
              quantity: updatedItems[existingKeyIndex].quantity + quantity,
            };
            set({ items: updatedItems });
          } else {
            const keyCount = items.filter(
              (item) => item.product.type === "key",
            ).length;
            if (keyCount < 4) {
              set({ items: [...items, { product, quantity }] });
            } else {
              console.warn(
                "Достигнут лимит разных ключей в корзине (максимум 4)",
              );
              return;
            }
          }
        }

        // TODO: раскомментировать когда будет бэкенд
        // try {
        //   const response = await fetch("/api/cart/items", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //       productId: product.id,
        //       quantity,
        //       duration: product.type === "subscription" ? "30-d" : undefined,
        //     }),
        //   });
        //   if (!response.ok) {
        //     throw new Error(`Failed to add item: ${response.status} ${response.statusText}`);
        //   }
        // } catch (error) {
        //   console.error("Error adding item to cart:", error);
        //   set({ items: previousItems });
        // }
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
        }));
      },

      updateDuration: (productId: number, duration: Duration) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, duration } : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      isInCart: (productId: number) => {
        return get().items.some((item) => item.product.id === productId);
      },

      getItem: (productId: number) => {
        return get().items.find((item) => item.product.id === productId);
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);

export default useCartStore;
