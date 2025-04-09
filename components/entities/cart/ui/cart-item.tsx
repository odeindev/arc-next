// components/shared/cart-item.tsx

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, ChevronDown } from 'lucide-react';
import { CartItem as CartItemType } from '@/components/store/useCartStore';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (id: number, quantity: number) => void;
  onDurationChange: (id: number, duration: '30-d' | '90-d' | '1-y') => void;
  onRemove: (id: number) => void;
  subtotal: number;
  index: number;
  isLast: boolean;
  dropdownOpen: number | null;
  onDropdownToggle: (id: number | null) => void;
}

// Опции периодов для привилегий
const durationOptions = [
  { value: '30-d', label: '30 дней' },
  { value: '90-d', label: '90 дней' },
  { value: '1-y', label: '1 год' }
];

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onDurationChange,
  onRemove,
  subtotal,
  isLast,
  dropdownOpen,
  onDropdownToggle
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  
  // Обработчик прямого ввода количества
  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onQuantityChange(item.product.id, value);
    }
  };

  // Обработчик для подтверждения ввода при потере фокуса
  const handleQuantityBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      // Если введено некорректное значение, устанавливаем 1
      onQuantityChange(item.product.id, 1);
    }
  };

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 ${
        !isLast ? 'border-b border-slate-700/50' : ''
      } hover:bg-slate-700/30 transition-colors`}
    >
      <div className="col-span-1 md:col-span-6 flex items-center">
        {item.product.icon ? (
          <div className="relative">
            <div className="absolute inset-0 bg-orange-400/20 rounded-lg blur-md"></div>
            <Image
              src="/api/placeholder/56/56"
              alt={item.product.name}
              width={56}
              height={56}
              className="mr-4 rounded-lg relative z-10"
            />
          </div>
        ) : (
          <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg mr-4 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-white/10 rounded-lg"></div>
            <span className="text-white font-bold text-xl">{item.product.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <h3 className="font-bold text-white text-lg">{item.product.name}</h3>
          <p className="text-sm text-slate-400 flex items-center">
            {item.product.type === 'subscription' ? (
              <>
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Привилегия
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Ключ
              </>
            )}
          </p>
        </div>
      </div>
      
      <div className="col-span-1 md:col-span-2 text-left md:text-center">
        <div className="md:hidden text-slate-400 text-sm mb-1">Цена:</div>
        <div className="text-orange-400 font-bold">{item.product.price}</div>
      </div>
      
      <div className="col-span-1 md:col-span-2 text-left md:text-center">
        {item.product.type === 'subscription' ? (
          <>
            <div className="md:hidden text-slate-400 text-sm mb-1">Срок:</div>
            <div className="relative">
              <button 
                className="bg-slate-700 text-white w-full h-10 rounded-lg flex items-center justify-between px-3 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onDropdownToggle(dropdownOpen === item.product.id ? null : item.product.id);
                }}
              >
                <span>
                  {durationOptions.find(opt => opt.value === item.duration)?.label || '30 дней'}
                </span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${dropdownOpen === item.product.id ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Выпадающее меню с выбором периода */}
              {dropdownOpen === item.product.id && (
                <div 
                  className="absolute z-10 mt-2 w-full bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700"
                >
                  {durationOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`px-4 py-3 cursor-pointer hover:bg-slate-700 text-white transition-colors ${item.duration === option.value ? 'bg-orange-500/20 font-medium' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDurationChange(item.product.id, option.value as '30-d' | '90-d' | '1-y');
                        onDropdownToggle(null);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="md:hidden text-slate-400 text-sm mb-1">Количество:</div>
            <div className="flex items-center">
              <button
                onClick={() => item.quantity > 1 && onQuantityChange(item.product.id, item.quantity - 1)}
                className={`bg-slate-700 text-white w-10 h-10 rounded-l-lg flex items-center justify-center ${
                  item.quantity > 1 ? 'hover:bg-slate-600 active:bg-slate-500' : 'opacity-50 cursor-not-allowed'
                } transition-colors`}
              >
                -
              </button>
              <input
                type="text"
                value={item.quantity}
                onChange={handleQuantityInputChange}
                onBlur={handleQuantityBlur}
                className="bg-slate-800 text-white w-12 h-10 text-center focus:outline-none focus:ring-2 focus:ring-orange-400/50 border-x border-slate-600"
                aria-label="Количество товара"
              />
              <button
                onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
                className="bg-slate-700 text-white w-10 h-10 rounded-r-lg flex items-center justify-center hover:bg-slate-600 active:bg-slate-500 transition-colors"
              >
                +
              </button>
            </div>
          </>
        )}
      </div>
      
      <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center">
        <div>
          <div className="md:hidden text-slate-400 text-sm mb-1">Сумма:</div>
          <div className="text-white font-bold">{subtotal} ₽</div>
        </div>
        <div className="relative">
          {deleteConfirm ? (
            <div 
              className="absolute right-0 bottom-full mb-2 bg-slate-700 rounded-lg shadow-lg p-2 w-32 text-center"
            >
              <p className="text-xs text-slate-300 mb-2">Удалить товар?</p>
              <div className="flex justify-between space-x-2">
                <button 
                  onClick={() => {
                    onRemove(item.product.id);
                    setDeleteConfirm(false);
                  }}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded transition-colors"
                >
                  Да
                </button>
                <button 
                  onClick={() => setDeleteConfirm(false)}
                  className="text-xs bg-slate-600 hover:bg-slate-500 text-white py-1 px-2 rounded transition-colors"
                >
                  Нет
                </button>
              </div>
            </div>
          ) : null}
          <button 
            onClick={() => setDeleteConfirm(true)}
            className="text-slate-400 hover:text-red-400 p-2 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Удалить товар"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;