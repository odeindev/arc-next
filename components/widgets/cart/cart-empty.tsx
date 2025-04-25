// components/cart/CartEmpty.tsx

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/shared/ui';

interface CartEmptyProps {
  className?: string;
}

const CartEmpty: React.FC<CartEmptyProps> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-20 ${className}`}>
      <div className="bg-slate-800/60 backdrop-blur-sm rounded-full p-12 mb-6 shadow-lg shadow-yellow-500/10">
        <ShoppingCart size={80} className="text-yellow-400" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">Ваша корзина пуста</h2>
      <p className="text-slate-300 mb-10 text-center max-w-md">
        Вы ещё не добавили товары в корзину. Посетите магазин, чтобы выбрать привилегии или ключи.
      </p>
      <Link href="/shop">
        <Button 
          color="yellow"
          text="Перейти в магазин" 
          className="w-64 group relative overflow-hidden"
        />
      </Link>
    </div>
  );
};

export default CartEmpty;