// components/cart/CartList.tsx

import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import CartItem from '@/components/entities/cart/ui/cart-item';
import { CartItem as CartItemType } from '@/components/store/useCartStore';
import { useCartCalculations } from '@/components/entities/cart/model/useCartCalculations';

interface CartListProps {
  items: CartItemType[];
  onQuantityChange: (id: number, quantity: number) => void;
  onDurationChange: (id: number, duration: '30-d' | '90-d' | '1-y') => void;
  onRemove: (id: number) => void;
}

const CartList: React.FC<CartListProps> = ({
  items,
  onQuantityChange,
  onDurationChange,
  onRemove
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const { calculateItemTotal } = useCartCalculations(items);
  
  // Обработчик клика вне выпадающего списка
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen !== null) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);
  
  return (
    <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl overflow-hidden mb-8 shadow-xl">
      <div className="bg-gradient-to-r from-slate-700 to-slate-700/70 p-6 rounded-t-xl border-l-4 border-yellow-400 shadow-lg shadow-yellow-500/5">
        <h2 className="text-2xl text-white font-bold flex items-center">
          <ShoppingCart className="mr-3 text-yellow-400" size={24} />
          Товары в корзине ({items.length})
        </h2>
      </div>
      
      <div className="hidden md:grid grid-cols-12 gap-4 text-slate-300 border-b border-slate-700/70 p-6">
        <div className="col-span-6 font-medium">Товар</div>
        <div className="col-span-2 text-center font-medium">Цена</div>
        <div className="col-span-2 text-center font-medium">Количество/срок</div>
        <div className="col-span-2 text-right font-medium">Сумма</div>
      </div>
      
      {items.map((item, index) => (
        <CartItem
          key={item.product.id}
          item={item}
          onQuantityChange={onQuantityChange}
          onDurationChange={onDurationChange}
          onRemove={onRemove}
          subtotal={calculateItemTotal(item)}
          index={index}
          isLast={index === items.length - 1}
          dropdownOpen={dropdownOpen}
          onDropdownToggle={setDropdownOpen}
        />
      ))}
    </div>
  );
};

export default CartList;