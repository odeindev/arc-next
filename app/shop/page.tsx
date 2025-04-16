// @app/rules/ShopPage.tsx
'use client';

import React, { useState } from 'react';
import { cn } from '@/components/shared/lib/utils';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';
import { Button, ContentSection } from '@/components/shared/ui';
import { SectionHeader } from '@/components/shared/ui/section-header';
import { Product, products } from '../../public/data/products';
import { ProductCard } from '../../components/entities/product/ui/product-card';
import { ShoppingCart, Package, Key } from 'lucide-react';
import Link from 'next/link';
import useCartStore from '../../components/store/useCartStore';

interface Props {
  className?: string;
}

// Выносим модальное окно в отдельный компонент для лучшей организации кода
const ProductModal: React.FC<{
  product: Product | null;
  onClose: () => void;
  isInCart: boolean;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
}> = ({ product, onClose, isInCart, onAddToCart, onRemoveFromCart }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 backdrop-blur-sm">
      <div className="bg-slate-800 text-white p-6 rounded-lg max-w-md w-full relative shadow-2xl animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
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
              <span className="text-orange-400 font-bold text-2xl">{product.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold">{product.name}</h3>
            <p className="text-orange-400 font-bold">{product.price}</p>
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

// Компонент для отображения группы продуктов
const ProductSection: React.FC<{
  title: string;
  description: string;
  icon: LucideIcon;

  products: Product[];
  onOpenModal: (product: Product) => void;
  isInCart: (id: number) => boolean;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (id: number) => void;
}> = ({ title, description, icon, products, onOpenModal, isInCart, onAddToCart, onRemoveFromCart }) => {
  return (
    <div className="mb-12">
      <SectionHeader 
        title={title}
        icon={icon}
        extraContent={
          <p className="text-slate-300">{description}</p>
        }
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onOpenModal={onOpenModal}
            isInCart={isInCart(product.id)}
            onAddToCart={() => onAddToCart(product)}
            onRemoveFromCart={() => onRemoveFromCart(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

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

  // Обработчик удаления товара из корзины из модального окна
  const handleRemoveFromCartFromModal = () => {
    if (selectedProduct) {
      removeItem(selectedProduct.id);
      closeModal();
    }
  };

  // Фильтруем продукты по типам
  const subscriptionProducts = products.filter(p => p.type === 'subscription');
  const keyProducts = products.filter(p => p.type === 'key');
  
  // Количество товаров в корзине
  const cartItemsCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className={cn('relative min-h-screen flex flex-col', className)}>
      {/* Иконка корзины с индикатором количества товаров */}
      <div className="fixed top-20 right-4 z-10">
        <Link href="/cart">
          <div className="bg-slate-700 p-3 rounded-full shadow-lg hover:bg-slate-600 transition-colors relative">
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
        {/* Секция привилегий с использованием SectionHeader */}
        <ProductSection
          title="Привилегии"
          description="Получите дополнительные возможности и преимущества на сервере с нашими привилегиями"
          icon={Package}
          products={subscriptionProducts}
          onOpenModal={openModal}
          isInCart={isInCart}
          onAddToCart={addItem}
          onRemoveFromCart={removeItem}
        />

        {/* Секция ключей с использованием SectionHeader */}
        <ProductSection
          title="Ключи к кейсам"
          description="Откройте уникальные предметы и ресурсы с помощью наших ключей"
          icon={Key}
          products={keyProducts}
          onOpenModal={openModal}
          isInCart={isInCart}
          onAddToCart={addItem}
          onRemoveFromCart={removeItem}
        />
      </ContentSection>

      {/* Модальное окно с деталями */}
      <ProductModal
        product={selectedProduct}
        onClose={closeModal}
        isInCart={selectedProduct ? isInCart(selectedProduct.id) : false}
        onAddToCart={handleAddToCartFromModal}
        onRemoveFromCart={handleRemoveFromCartFromModal}
      />
    </div>
  );
};

export default ShopPage;