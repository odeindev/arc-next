// components/CartHeader.tsx

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const CartHeader: React.FC = () => {
  // Получаем доступ к состоянию корзины
  const { items } = useCartStore();
  
  // Количество товаров в корзине
  const cartItemsCount = items.reduce((count, item) => count + item.quantity, 0);

  if (cartItemsCount === 0) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 z-10">
      <Link href="/cart">
        <div className="bg-slate-800 p-3 rounded-full shadow-lg hover:bg-slate-700 transition-colors relative">
          <ShoppingCart className="text-white" size={24} />
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {cartItemsCount}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default CartHeader;