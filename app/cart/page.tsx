'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button, ContentSection } from '../../components/shared';
import { Product, products } from '../../public/data/products';
import { Trash2, ShoppingCart, ChevronDown } from 'lucide-react';

interface Props {
  className?: string;
}

// Интерфейс для элемента корзины
interface CartItem {
  product: Product;
  quantity: number;
  duration?: '30-d' | '90-d' | '1-y';
}

// Опции периодов для привилегий
const durationOptions = [
  { value: '30-d', label: '30 дней' },
  { value: '90-d', label: '90 дней' },
  { value: '1-y', label: '1 год' }
];

// Мультипликаторы цен для разных периодов
const durationMultipliers = {
  '30-d': 1,
  '90-d': 2.5,
  '1-y': 8
};

const CartPage: React.FC<Props> = ({ className }) => {
  // Для демонстрации начнем с пустой корзины
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  
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

  // Обработчик изменения количества
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Обработчик прямого ввода количества
  const handleQuantityInputChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateQuantity(id, value);
    } else if (e.target.value === '') {
      // Позволяем временно оставить поле пустым при вводе
      setCartItems(prev => 
        prev.map(item => 
          item.product.id === id ? { ...item, quantity: 1 } : item
        )
      );
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

  // Обработчик изменения периода для привилегии
  const updateDuration = (id: number, duration: '30-d' | '90-d' | '1-y') => {
    setCartItems(prev => 
      prev.map(item => 
        item.product.id === id ? { ...item, duration } : item
      )
    );
    setDropdownOpen(null);
  };

  // Удаление товара из корзины
  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
  };

  // Очистка всей корзины
  const clearCart = () => {
    setCartItems([]);
  };

  // Добавление товара в корзину с учетом ограничений
  const addToCart = (product: Product, quantity: number = 1) => {
    // Проверяем, является ли продукт привилегией
    if (product.type === 'subscription') {
      // Если это привилегия, удаляем все другие привилегии и добавляем новую
      // По умолчанию устанавливаем период 30 дней
      setCartItems(prev => {
        const nonSubscriptions = prev.filter(item => item.product.type !== 'subscription');
        return [...nonSubscriptions, { product, quantity: 1, duration: '30-d' }];
      });
    } else if (product.type === 'key') {
      // Проверяем, есть ли уже такой ключ в корзине
      const existingKey = cartItems.find(item => item.product.id === product.id);
      
      if (existingKey) {
        // Если такой ключ уже есть, обновляем его количество
        setCartItems(prev => 
          prev.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          )
        );
      } else {
        // Проверяем, сколько разных ключей уже в корзине
        const keyCount = cartItems.filter(item => item.product.type === 'key').length;
        if (keyCount < 4) {
          // Если меньше 4, добавляем новый ключ
          setCartItems(prev => [...prev, { product, quantity }]);
        } else {
          // Здесь можно добавить уведомление о достижении лимита ключей
          console.warn('Достигнут лимит разных ключей в корзине (максимум 4)');
        }
      }
    }
  };

  // Демонстрационная функция добавления товаров для тестирования
  const addDemoProducts = () => {
    // Сбрасываем корзину перед добавлением демо-товаров
    setCartItems([]);
    
    // Добавляем одну привилегию
    addToCart(products[2]); // Titan с периодом 30 дней по умолчанию
    
    // Добавляем два разных ключа с разным количеством
    addToCart(products[4], 2); // Необычный ключ - 2 шт
    addToCart(products[6], 1); // Мифический ключ - 1 шт
  };

  // Проверяем состояние корзины при изменении элементов
  useEffect(() => {
    setIsCartEmpty(cartItems.length === 0);
  }, [cartItems]);

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
            <div className="bg-slate-700 rounded-full p-8 mb-6">
              <ShoppingCart size={64} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Ваша корзина пуста</h2>
            <p className="text-slate-300 mb-8 text-center max-w-md">
              Вы ещё не добавили товары в корзину. Посетите магазин, чтобы выбрать привилегии или ключи.
            </p>
            <Button 
              color="orange"
              text="Перейти в магазин" 
              className="w-64"
              // Примечание: в реальном проекте здесь должен быть переход на страницу магазина
              onClick={addDemoProducts} // Для демонстрации добавляем товары
            />
          </div>
        ) : (
          <div>
            <div className="bg-slate-700 p-4 rounded-lg mb-6 border-l-4 border-orange-400">
              <h2 className="text-2xl text-white font-bold">Товары в корзине</h2>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <div className="hidden md:grid grid-cols-12 gap-4 text-slate-300 border-b border-slate-700 pb-4 mb-4">
                <div className="col-span-6">Товар</div>
                <div className="col-span-2 text-center">Цена</div>
                <div className="col-span-2 text-center">Количество/срок</div>
                <div className="col-span-2 text-right">Сумма</div>
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
                  <div key={item.product.id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${index !== cartItems.length - 1 ? 'border-b border-slate-700 pb-4 mb-4' : ''}`}>
                    <div className="col-span-1 md:col-span-6 flex items-center">
                      {item.product.icon ? (
                        <Image
                          src="/api/placeholder/48/48"
                          alt={item.product.name}
                          width={48}
                          height={48}
                          className="mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-700 rounded-full mr-4 flex items-center justify-center">
                          <span className="text-orange-400 font-bold">{item.product.name.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-white">{item.product.name}</h3>
                        <p className="text-sm text-slate-400">{item.product.type === 'subscription' ? 'Привилегия' : 'Ключ'}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 text-left md:text-center">
                      <div className="md:hidden text-slate-400 mb-1">Цена:</div>
                      <div className="text-orange-400 font-bold">{item.product.price}</div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 text-left md:text-center">
                      {item.product.type === 'subscription' ? (
                        <>
                          <div className="md:hidden text-slate-400 mb-1">Срок:</div>
                          <div className="relative">
                            <button 
                              className="bg-slate-600 text-white w-full h-8 rounded flex items-center justify-between px-3 hover:bg-slate-500 focus:outline-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(dropdownOpen === item.product.id ? null : item.product.id);
                              }}
                            >
                              <span>
                                {durationOptions.find(opt => opt.value === item.duration)?.label || '30 дней'}
                              </span>
                              <ChevronDown size={16} className={`transition-transform ${dropdownOpen === item.product.id ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {/* Выпадающее меню с выбором периода */}
                            {dropdownOpen === item.product.id && (
                              <div className="absolute z-10 mt-1 w-full bg-slate-700 rounded shadow-lg overflow-hidden">
                                {durationOptions.map((option) => (
                                  <div 
                                    key={option.value}
                                    className={`px-3 py-2 cursor-pointer hover:bg-slate-600 text-white ${item.duration === option.value ? 'bg-slate-600' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateDuration(item.product.id, option.value as '30-d' | '90-d' | '1-y');
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
                          <div className="md:hidden text-slate-400 mb-1">Количество:</div>
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="bg-slate-700 text-white w-8 h-8 rounded-l flex items-center justify-center hover:bg-slate-600"
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              onChange={(e) => handleQuantityInputChange(item.product.id, e)}
                              onBlur={(e) => handleQuantityBlur(item.product.id, e)}
                              className="bg-slate-600 text-white w-10 h-8 text-center focus:outline-none focus:ring-1 focus:ring-orange-400 focus:bg-slate-500"
                              aria-label="Количество товара"
                            />
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="bg-slate-700 text-white w-8 h-8 rounded-r flex items-center justify-center hover:bg-slate-600"
                            >
                              +
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center">
                      <div>
                        <div className="md:hidden text-slate-400 mb-1">Сумма:</div>
                        <div className="text-white font-bold">{subtotal} ₽</div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-400 p-2"
                        aria-label="Удалить товар"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800 rounded-lg p-6">
              <button
                onClick={clearCart}
                className="flex items-center text-slate-300 hover:text-red-400 mb-4 md:mb-0"
              >
                <Trash2 size={20} className="mr-2" />
                Очистить корзину
              </button>
              
              <div className="w-full md:w-auto">
                <div className="flex justify-between md:justify-end items-center mb-4">
                  <div className="text-slate-300 mr-4">Итого:</div>
                  <div className="text-2xl font-bold text-white">{calculateTotal()} ₽</div>
                </div>
                <Button 
                  color="green"
                  text="Оформить заказ" 
                  className="w-full md:w-64" 
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