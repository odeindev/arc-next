// @app/rules/ShopPage.tsx
'use client';

import React, { useState } from 'react';
import { cn } from '@/components/shared/lib/utils';
import Image from 'next/image';
import { Button, ContentSection } from '@/components/shared/ui';
import { Product, products } from '../../public/data/products';
import { ProductCard } from '../../components/entities/product/ui/product-card';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import useCartStore from '../../components/store/useCartStore';

interface Props {
  className?: string;
}

const ShopPage: React.FC<Props> = ({ className }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Получаем доступ к состоянию и методам корзины
  const { items, addItem, removeItem, isInCart } = useCartStore();
  
  // Функции для открытия/закрытия модального окна
  const openModal = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };
  
  // Обработчик добавления товара в корзину из модального окна
  const handleAddToCartFromModal = () => {
    if (selectedProduct) {
      addItem(selectedProduct);
      closeModal();
    }
  };

  const subscriptionProducts = products.filter(p => p.type === 'subscription');
  const keyProducts = products.filter(p => p.type === 'key');
  
  // Количество товаров в корзине
  const cartItemsCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className={cn('relative min-h-screen flex flex-col', className)}>
      {/* Иконка корзины с индикатором количества товаров */}
      <div className="fixed top-6 right-6 z-10">
        <Link href="/cart">
          <div className="bg-slate-800 p-3 rounded-full shadow-lg hover:bg-slate-700 transition-colors relative">
            <ShoppingCart className="text-white" size={24} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {cartItemsCount}
              </span>
            )}
          </div>
        </Link>
      </div>
    
      <ContentSection 
        title="Магазин сервера"
        iconSrc="/icons/shop-icon.gif"
        iconAlt="Shop Icon"
        className="flex-grow"
      >
        <div className="mb-12">
          <div className="bg-slate-700 p-4 rounded-lg mb-6 border-l-4 border-orange-400">
            <h2 className="text-2xl text-white font-bold mb-2">Привилегии</h2>
            <p className="text-slate-300">Получите дополнительные возможности и преимущества на сервере с нашими привилегиями</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onOpenModal={openModal}
                isInCart={isInCart(product.id)}
                onAddToCart={() => addItem(product)}
                onRemoveFromCart={() => removeItem(product.id)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="bg-slate-700 p-4 rounded-lg mb-6 border-l-4 border-orange-400">
            <h2 className="text-2xl text-white font-bold mb-2">Ключи к кейсам</h2>
            <p className="text-slate-300">Откройте уникальные предметы и ресурсы с помощью наших ключей</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onOpenModal={openModal}
                isInCart={isInCart(product.id)}
                onAddToCart={() => addItem(product)}
                onRemoveFromCart={() => removeItem(product.id)}
              />
            ))}
          </div>
        </div>
      </ContentSection>

      {/* Модальное окно с деталями */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 backdrop-blur-sm">
          <div className="bg-slate-800 text-white p-6 rounded-lg max-w-md w-full relative shadow-2xl animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="flex items-center mb-4">
              {selectedProduct.icon ? (
                <Image
                  src="/api/placeholder/64/64"
                  alt={selectedProduct.name}
                  width={64}
                  height={64}
                  className="mr-4"
                />
              ) : (
                <div className="w-16 h-16 bg-slate-700 rounded-full mr-4 flex items-center justify-center">
                  <span className="text-orange-400 font-bold text-2xl">{selectedProduct.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold">{selectedProduct.name}</h3>
                <p className="text-orange-400 font-bold">{selectedProduct.price}</p>
              </div>
            </div>
            
            <div className="border-t border-b border-slate-700 py-4 my-4">
              <p className="mb-4">{selectedProduct.description}</p>
              
              {selectedProduct.benefits && (
                <div className="mt-4">
                  <h4 className="text-lg font-bold mb-2">Преимущества:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedProduct.benefits.map((benefit, index) => (
                      <li key={index} className="text-slate-300">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex justify-around mt-6 items-center">
              {isInCart(selectedProduct.id) ? (
                <Button 
                  color="red"
                  text="Убрать из корзины" 
                  className="w-2/3" 
                  onClick={() => {
                    removeItem(selectedProduct.id);
                    closeModal();
                  }} 
                />
              ) : (
                <Button 
                  color="green"
                  text="Добавить в корзину" 
                  className="w-2/3" 
                  onClick={handleAddToCartFromModal} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;