// components/shop/ProductCard.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/shared';
import { Product } from '../../public/data/products';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenModal }) => {
  return (
    <div className="bg-slate-900 rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4">
        <div className="flex items-center mb-3">
          {product.icon ? (
            <Image
              src="/api/placeholder/48/48"
              alt={product.name}
              width={48}
              height={48}
              className="mr-3"
            />
          ) : (
            <div className="w-12 h-12 bg-slate-600 rounded-full mr-3 flex items-center justify-center">
              <span className="text-orange-400 font-bold">{product.name.charAt(0)}</span>
            </div>
          )}
          <h3 className="text-xl text-white font-bold">{product.name}</h3>
        </div>
        <div className="text-orange-400 font-bold text-xl mb-2">{product.price}</div>
      </div>
      <div className="p-4">
        <p className="text-slate-300 mb-4 h-16 overflow-hidden line-clamp-2">{product.description}</p>
        <div className="flex justify-between gap-2">
          <Button 
            color="blue" 
            text="Подробнее" 
            className="w-full py-2 mt-2" 
            onClick={() => onOpenModal(product)} 
          />
          <Button 
            color="green"
            text="🛒" 
            className="w-1/3 py-2 mt-2" 
          />
        </div>
      </div>
    </div>
  );
};
