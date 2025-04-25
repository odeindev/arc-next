// @components/entities/product/ui/product-modal.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/shared/ui';
import { Product } from '@/public/data/products';
import { X } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isInCart: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ 
  product, 
  onClose, 
  isInCart, 
  onAddToCart, 
  onRemoveFromCart 
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280);
  }, [onClose]);
  
  useEffect(() => {
    if (product && !mounted) {
      setMounted(true);
      setIsClosing(false);
    }
    
    if (!product && mounted) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
        setMounted(false);
      }, 300); // Соответствует длительности анимации
      return () => clearTimeout(timer);
    }
  }, [product, mounted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (product) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
    };
  }, [product, handleClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!product || !mounted) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/75 flex items-center justify-center z-50 backdrop-blur-sm ${
        isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-slate-800 text-white p-6 rounded-lg max-w-md w-full relative shadow-2xl border border-slate-700 ${
          isClosing ? 'modal-exit' : 'modal-enter'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
          onClick={handleClose}
          aria-label="Close modal"
        >
         <X size={24} />
        </button>
        
        <div className="flex items-center mb-4">
          {product.icon ? (
            <Image
              src="/api/placeholder/64/64"
              alt={product.name}
              width={64}
              height={64}
              className="mr-4"
            />
          ) : (
            <div className="w-16 h-16 bg-slate-700 rounded-full mr-4 flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-2xl">{product.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold">{product.name}</h3>
            <p className="text-yellow-400 font-bold">{product.price}</p>
          </div>
        </div>
        
        <div className="border-t border-b border-slate-700 py-4 my-4">
          <p className="mb-4">{product.description}</p>
          
          {product.benefits && (
            <div className="mt-4">
              <h4 className="text-lg font-bold mb-2">Преимущества:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="text-slate-300">{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex justify-around mt-6 items-center">
          {isInCart ? (
            <Button 
              color="red"
              text="Убрать из корзины" 
              className="w-2/3" 
              onClick={onRemoveFromCart} 
            />
          ) : (
            <Button 
              color="green"
              text="Добавить в корзину" 
              className="w-2/3" 
              onClick={onAddToCart} 
            />
          )}
        </div>
      </div>
    </div>
  );
};