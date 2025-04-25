'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/shared/ui';
import { Product } from '@/public/data/products';
import { ShoppingCart, MinusCircle, PlusCircle, Info } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  isInCart: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenModal,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
}) => {
  return (
    <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-yellow-500/5 transition-all border border-slate-700/50 transform hover:scale-[1.01] duration-300 group">
      {/* Badge для товара в корзине */}
      {isInCart && (
        <div className="absolute top-0 right-0 bg-green-500 text-white rounded-bl-lg px-3 py-1 text-sm font-bold z-10">
          <ShoppingCart size={16} />        
        </div>
      )}

      <div className="p-6 flex flex-col justify-between h-full">
        {/* Верхняя часть: иконка и информация */}
        <div className="flex items-center mb-5">
          {product.icon ? (
            <div className="relative mr-4">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-md"></div>
              <Image
                src="/api/placeholder/56/56"
                alt={product.name}
                width={56}
                height={56}
                className="rounded-lg relative z-10"
              />
            </div>
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mr-4 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-white/10 rounded-lg"></div>
              <span className="text-white font-bold text-xl">{product.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h3 className="font-bold text-white text-lg group-hover:text-yellow-400 transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-slate-400 flex items-center">
              {product.type === 'subscription' ? (
                <>
                  <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
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

        {/* Цена */}
        <div className="text-yellow-400 font-bold text-lg mb-3">{product.price}</div>

        {/* Описание */}
        <p className="text-slate-300 text-sm mb-6 line-clamp-2" title={product.description}>
          {product.description}
        </p>

        {/* Кнопки */}
        <div className="flex gap-2 items-center">
          <Button 
            color="blue" 
            className="flex-1 py-1 flex items-center justify-center gap-1 text-sm font-medium" 
            onClick={() => onOpenModal(product)}
            icon={<Info size={18} className="" />}
            text="Подробнее"
          />

          {isInCart ? (
            <Button 
              color="red" 
              className="p-1 rounded-lg flex-shrink-0" 
              onClick={onRemoveFromCart}
              icon={<MinusCircle size={20} />}
            />
          ) : (
            <Button 
              color="green" 
              className="p-1 rounded-lg flex-shrink-0" 
              onClick={onAddToCart}
              icon={<PlusCircle size={20} />}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;