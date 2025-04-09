'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button, ContentSection } from '../../components/shared';
import { Trash2, ShoppingCart, ChevronDown, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import useCartStore, { durationMultipliers } from '../../components/store/useCartStore';

interface Props {
  className?: string;
}

// Опции периодов для привилегий
const durationOptions = [
  { value: '30-d', label: '30 дней' },
  { value: '90-d', label: '90 дней' },
  { value: '1-y', label: '1 год' }
];

const CartPage: React.FC<Props> = ({ className }) => {
  const { 
    items: cartItems, 
    updateQuantity, 
    removeItem, 
    updateDuration, 
    clearCart 
  } = useCartStore();
  
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  
  // Проверка пустой ли корзина
  const isCartEmpty = cartItems.length === 0;
  
  // Расчет общей суммы с учетом периодов для привилегий
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Убираем ₽ и конвертируем в число
      const price = Number(item.product.price.replace(/[^\d]/g, ''));
      
      // Если это привилегия, применяем коэффициент для периода
      if (item.product.type === 'subscription' && item.duration) {
        return total + (price * (durationMultipliers[item.duration] || 1));
      }
      
      // Для ключей считаем как обычно
      return total + (price * item.quantity);
    }, 0);
  };

  // Обработчик прямого ввода количества
  const handleQuantityInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateQuantity(id, value);
    }
  };

  // Обработчик для подтверждения ввода при потере фокуса
  const handleQuantityBlur = (id: number, e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      // Если введено некорректное значение, устанавливаем 1
      updateQuantity(id, 1);
    }
  };

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
    <div className={cn('relative min-h-screen flex flex-col', className)}>
      <ContentSection 
        title="Корзина"
        iconSrc="/icons/cart-icon.gif"
        iconAlt="Cart Icon"
        className="flex-grow"
      >
        {isCartEmpty ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-full p-12 mb-6 shadow-lg shadow-orange-500/10">
              <ShoppingCart size={80} className="text-orange-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Ваша корзина пуста</h2>
            <p className="text-slate-300 mb-10 text-center max-w-md">
              Вы ещё не добавили товары в корзину. Посетите магазин, чтобы выбрать привилегии или ключи.
            </p>
            <Link href="/shop">
              <Button 
                color="orange"
                text="Перейти в магазин" 
                className="w-64 group relative overflow-hidden"
              />
            </Link>
          </div>
        ) : (
          <div>
            <div className="bg-gradient-to-r from-slate-700 to-slate-700/70 p-6 rounded-xl mb-6 border-l-4 border-orange-400 shadow-lg shadow-orange-500/5">
              <h2 className="text-2xl text-white font-bold flex items-center">
                <ShoppingCart className="mr-3 text-orange-400" size={24} />
                Товары в корзине ({cartItems.length})
              </h2>
            </div>
            
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl overflow-hidden mb-8 shadow-xl">
              <div className="hidden md:grid grid-cols-12 gap-4 text-slate-300 border-b border-slate-700/70 p-6">
                <div className="col-span-6 font-medium">Товар</div>
                <div className="col-span-2 text-center font-medium">Цена</div>
                <div className="col-span-2 text-center font-medium">Количество/срок</div>
                <div className="col-span-2 text-right font-medium">Сумма</div>
              </div>
              
              {cartItems.map((item, index) => {
                // Извлекаем числовое значение цены
                const price = Number(item.product.price.replace(/[^\d]/g, ''));
                
                // Рассчитываем сумму с учетом периода для привилегий
                let subtotal = price;
                if (item.product.type === 'subscription' && item.duration) {
                  subtotal = price * (durationMultipliers[item.duration] || 1);
                } else {
                  subtotal = price * item.quantity;
                }
                
                return (
                  <div
                    key={item.product.id}
                    className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-6 ${
                      index !== cartItems.length - 1 ? 'border-b border-slate-700/50' : ''
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
                                setDropdownOpen(dropdownOpen === item.product.id ? null : item.product.id);
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
                                      updateDuration(item.product.id, option.value as '30-d' | '90-d' | '1-y');
                                      setDropdownOpen(null);
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
                              onClick={() => item.quantity > 1 && updateQuantity(item.product.id, item.quantity - 1)}
                              className={`bg-slate-700 text-white w-10 h-10 rounded-l-lg flex items-center justify-center ${
                                item.quantity > 1 ? 'hover:bg-slate-600 active:bg-slate-500' : 'opacity-50 cursor-not-allowed'
                              } transition-colors`}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              onChange={(e) => handleQuantityInputChange(item.product.id, e)}
                              onBlur={(e) => handleQuantityBlur(item.product.id, e)}
                              className="bg-slate-800 text-white w-12 h-10 text-center focus:outline-none focus:ring-2 focus:ring-orange-400/50 border-x border-slate-600"
                              aria-label="Количество товара"
                            />
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
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
                        {deleteConfirm === item.product.id ? (
                          <div 
                            className="absolute right-0 bottom-full mb-2 bg-slate-700 rounded-lg shadow-lg p-2 w-32 text-center"
                          >
                            <p className="text-xs text-slate-300 mb-2">Удалить товар?</p>
                            <div className="flex justify-between space-x-2">
                              <button 
                                onClick={() => {
                                  removeItem(item.product.id);
                                  setDeleteConfirm(null);
                                }}
                                className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded transition-colors"
                              >
                                Да
                              </button>
                              <button 
                                onClick={() => setDeleteConfirm(null)}
                                className="text-xs bg-slate-600 hover:bg-slate-500 text-white py-1 px-2 rounded transition-colors"
                              >
                                Нет
                              </button>
                            </div>
                          </div>
                        ) : null}
                        <button 
                          onClick={() => setDeleteConfirm(item.product.id)}
                          className="text-slate-400 hover:text-red-400 p-2 rounded-full hover:bg-slate-700 transition-colors"
                          aria-label="Удалить товар"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 md:mb-0">
                <button
                  onClick={() => clearCart()}
                  className="flex items-center text-slate-300 hover:text-red-400 hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 size={20} className="mr-2" />
                  Очистить корзину
                </button>
                <Link href="/shop" className="mt-4 sm:mt-0 sm:ml-4">
                  <Button
                    color="blue"
                    text="Продолжить покупки"
                    icon={<ArrowLeft className="mr-2" />}
                    className="flex-shrink-0"
                  />
                </Link>
              </div>
              
              <div className="w-full md:w-auto">
                <div className="flex justify-between md:justify-end items-center mb-4">
                  <div className="text-slate-300 mr-4 font-medium">Итого:</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    {calculateTotal()} ₽
                  </div>
                </div>
                <Button 
                  color="green"
                  text="Оформить заказ" 
                  className="w-full md:w-64 group relative overflow-hidden shadow-lg shadow-green-500/10" 
                />
              </div>
            </div>
          </div>
        )}
      </ContentSection>
    </div>
  );
};

export default CartPage;