// store/useCartStore.ts

import { create } from 'zustand';
import { Product } from '../../public/data/products';

// Интерфейс для элемента корзины
export interface CartItem {
  product: Product;
  quantity: number;
  duration?: '30-d' | '90-d' | '1-y';
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  
  // Методы для работы с корзиной
  fetchCart: () => Promise<void>;
  syncWithServer: () => Promise<void>;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateDuration: (productId: number, duration: '30-d' | '90-d' | '1-y') => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
  getItem: (productId: number) => CartItem | undefined;
}

// Мультипликаторы цен для разных периодов
export const durationMultipliers = {
  '30-d': 1,
  '90-d': 2.5,
  '1-y': 8
};

// Создание хранилища с состоянием корзины
const useCartStore = create<CartState>((set, get) => ({
  isLoading: false,
  items: [],

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        set({ items: data.items, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      set({ isLoading: false });
    }
  },

  syncWithServer: async () => {
    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: get().items }),
      });
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    }
  },

  // Добавление товара в корзину
  addItem: async (product: Product, quantity = 1) => {
    try {
      await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product.id, 
          quantity,
          duration: product.type === 'subscription' ? '30-d' : undefined
        }),
      });
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    }
    
    const { items } = get();
    
    // Проверяем, является ли продукт привилегией
    if (product.type === 'subscription') {
      // Если это привилегия, удаляем все другие привилегии и добавляем новую
      const nonSubscriptions = items.filter(item => item.product.type !== 'subscription');
      set({ 
        items: [...nonSubscriptions, { product, quantity: 1, duration: '30-d' }] 
      });
    } else if (product.type === 'key') {
      // Проверяем, есть ли уже такой ключ в корзине
      const existingKeyIndex = items.findIndex(item => item.product.id === product.id);
      
      if (existingKeyIndex >= 0) {
        // Если такой ключ уже есть, обновляем его количество
        const updatedItems = [...items];
        updatedItems[existingKeyIndex].quantity += quantity;
        set({ items: updatedItems });
      } else {
        // Проверяем, сколько разных ключей уже в корзине
        const keyCount = items.filter(item => item.product.type === 'key').length;
        if (keyCount < 4) {
          // Если меньше 4, добавляем новый ключ
          set({ items: [...items, { product, quantity }] });
        } else {
          // Можно добавить уведомление о достижении лимита ключей
          console.warn('Достигнут лимит разных ключей в корзине (максимум 4)');
        }
      }
    }
  },
  
  // Удаление товара из корзины
  removeItem: (productId: number) => {
    set(state => ({
      items: state.items.filter(item => item.product.id !== productId)
    }));
  },
  
  // Обновление количества товара
  updateQuantity: (productId: number, quantity: number) => {
    if (quantity < 1) return;
    
    set(state => ({
      items: state.items.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    }));
  },
  
  // Обновление периода для привилегии
  updateDuration: (productId: number, duration: '30-d' | '90-d' | '1-y') => {
    set(state => ({
      items: state.items.map(item => 
        item.product.id === productId ? { ...item, duration } : item
      )
    }));
  },
  
  // Очистка корзины
  clearCart: () => {
    set({ items: [] });
  },
  
  // Проверка наличия товара в корзине
  isInCart: (productId: number) => {
    return get().items.some(item => item.product.id === productId);
  },
  
  // Получение товара из корзины
  getItem: (productId: number) => {
    return get().items.find(item => item.product.id === productId);
  }
}));

export default useCartStore;