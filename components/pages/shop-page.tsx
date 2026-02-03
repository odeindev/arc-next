// @components/pages/shop-page.tsx
'use client'

import React, { useState } from 'react';
import { cn } from '@/components/shared/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ContentSection } from '@/components/shared/ui';
import { SectionHeader } from '@/components/shared/ui/section-header';
import { Product, products } from '../../public/data/products';
import { ProductCard } from '../../components/entities/product/ui/product-card';
import { ProductModal } from '../../components/entities/product/ui/product-modal';
import { ShoppingCart, Package, Key } from 'lucide-react';
import Link from 'next/link';
import useCartStore from '../../components/store/useCartStore';

interface ShopPageProps {
  className?: string;
}

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

export const ShopPage: React.FC<ShopPageProps> = ({ className }) => {
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
      <div className="fixed top-22 right-2 z-10">
        <Link href="/cart">
          <div className="bg-slate-600 p-3 rounded-full shadow-lg hover:bg-slate-500 transition-colors relative">
            <ShoppingCart className="text-white" size={24} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {cartItemsCount}
              </span>
            )}
          </div>
        </Link>
      </div>
    
      <ContentSection 
        title="Магазин сервера"
        iconSrc="/icons/shop-icon.webm"
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

      {/* Модальное окно с деталями — используем новый компонент */}
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