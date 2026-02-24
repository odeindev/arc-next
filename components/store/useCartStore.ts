import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Duration } from "../entities/cart/model/types";
import { Product } from "../../public/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  duration?: Duration;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  _hasHydrated: boolean;

  setHasHydrated: (value: boolean) => void;
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
      _hasHydrated: false,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      fetchCart: async () => {},

      syncWithServer: async () => {},

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
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default useCartStore;
