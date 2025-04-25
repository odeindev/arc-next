// components/entities/cart/ui/cart-item.tsx

import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
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

// Максимальное количество для покупки товара
const MAX_QUANTITY = 999;

// Компонент для отрисовки выпадающего меню через портал
const DropdownPortal = ({ 
  isOpen, 
  buttonRef, 
  children,
  onClose 
}: { 
  isOpen: boolean, 
  buttonRef: React.RefObject<HTMLButtonElement | null>, 
  children: React.ReactNode,
  onClose: () => void 
}) => {
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Обновление позиции при прокрутке и при изменении размеров окна
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    // Функция для обновления позиции выпадающего списка
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width
        });
      }
    };

    // Инициализация позиции
    updatePosition();

    // Добавляем слушатели событий
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    // Очистка слушателей при размонтировании
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, buttonRef]);

  // Обработка клика вне дропдауна и клавиши Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;
  
  // Вычисляем корректное положение дропдауна относительно viewport
  const adjustPosition = () => {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    let adjustedLeft = dropdownPosition.left;
    
    // Проверяем, не выходит ли дропдаун за правый край экрана
    if (dropdownPosition.left + dropdownPosition.width > viewport.width - 10) {
      adjustedLeft = viewport.width - dropdownPosition.width - 10;
    }
    
    // Важная часть: используем только top из getBoundingClientRect() для фиксированного позиционирования
    // без добавления window.scrollY
    return {
      top: `${dropdownPosition.top}px`,
      left: `${adjustedLeft}px`,
      width: `${dropdownPosition.width}px`,
    };
  };
  
  return ReactDOM.createPortal(
    <div 
      ref={dropdownRef}
      className="fixed bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700 z-50"
      style={adjustPosition()}
      role="listbox"
      aria-orientation="vertical"
    >
      {children}
    </div>,
    document.body
  );
};

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Обработчик прямого ввода количества
  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= MAX_QUANTITY) {
      onQuantityChange(item.product.id, value);
    }
  };

  // Обработчик для подтверждения ввода при потере фокуса
  const handleQuantityBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      // Если введено некорректное значение, устанавливаем 1
      onQuantityChange(item.product.id, 1);
    } else if (value > MAX_QUANTITY) {
      // Если введено значение выше максимального, устанавливаем максимум
      onQuantityChange(item.product.id, MAX_QUANTITY);
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
            <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-md"></div>
            <Image
              src="/api/placeholder/56/56"
              alt={item.product.name}
              width={56}
              height={56}
              className="mr-4 rounded-lg relative z-10"
            />
          </div>
        ) : (
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mr-4 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-white/10 rounded-lg"></div>
            <span className="text-white font-bold text-xl">{item.product.name.charAt(0)}</span>
          </div>
        )}
        <div>
          <h3 className="font-bold text-white text-lg">{item.product.name}</h3>
          <p className="text-sm text-slate-400 flex items-center">
            {item.product.type === 'subscription' ? (
              <>
                <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                <span>Привилегия</span>
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                <span>Ключ</span>
              </>
            )}
          </p>
        </div>
      </div>
      
      <div className="col-span-1 md:col-span-2 text-left md:text-center">
        <div className="md:hidden text-slate-400 text-sm mb-1">Цена:</div>
        <div className="text-yellow-400 font-bold">{item.product.price}</div>
      </div>
      
      <div className="col-span-1 md:col-span-2 text-left md:text-center">
        {item.product.type === 'subscription' ? (
          <>
            <div className="md:hidden text-slate-400 text-sm mb-1">Срок:</div>
            <div className="relative">
              <button 
                ref={buttonRef}
                className="bg-slate-700 text-white w-full h-10 rounded-lg flex items-center justify-between px-3 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onDropdownToggle(dropdownOpen === item.product.id ? null : item.product.id);
                }}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen === item.product.id}
                aria-label="Выбрать период подписки"
              >
                <span>
                  {durationOptions.find(opt => opt.value === item.duration)?.label || '30 дней'}
                </span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${dropdownOpen === item.product.id ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Выпадающее меню через портал */}
              <DropdownPortal 
                isOpen={dropdownOpen === item.product.id} 
                buttonRef={buttonRef}
                onClose={() => onDropdownToggle(null)}
              >
                {durationOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`px-4 py-3 cursor-pointer hover:bg-slate-700 text-white transition-colors ${item.duration === option.value ? 'bg-yellow-500/20 font-medium' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDurationChange(item.product.id, option.value as '30-d' | '90-d' | '1-y');
                      onDropdownToggle(null);
                    }}
                    role="option"
                    aria-selected={item.duration === option.value}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onDurationChange(item.product.id, option.value as '30-d' | '90-d' | '1-y');
                        onDropdownToggle(null);
                      }
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </DropdownPortal>
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
                disabled={item.quantity <= 1}
                aria-label="Уменьшить количество"
              >
                -
              </button>
              <input
                type="text"
                value={item.quantity}
                onChange={handleQuantityInputChange}
                onBlur={handleQuantityBlur}
                className="bg-slate-800 text-white w-12 h-10 text-center focus:outline-none focus:ring-2 focus:ring-yellow-400/50 border-x border-slate-600"
                aria-label="Количество товара"
                max={MAX_QUANTITY}
                min={1}
                role="spinbutton"
                aria-valuemin={1}
                aria-valuemax={MAX_QUANTITY}
                aria-valuenow={item.quantity}
              />
              <button
                onClick={() => item.quantity < MAX_QUANTITY && onQuantityChange(item.product.id, item.quantity + 1)}
                className={`bg-slate-700 text-white w-10 h-10 rounded-r-lg flex items-center justify-center ${
                  item.quantity < MAX_QUANTITY ? 'hover:bg-slate-600 active:bg-slate-500' : 'opacity-50 cursor-not-allowed'
                } transition-colors`}
                disabled={item.quantity >= MAX_QUANTITY}
                aria-label="Увеличить количество"
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
        <button 
          onClick={() => onRemove(item.product.id)}
          className="text-slate-400 hover:text-red-400 p-2 rounded-full hover:bg-slate-700 transition-colors"
          aria-label="Удалить товар"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;