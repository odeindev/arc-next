"use client";

import React, { useState } from "react";
import { cn } from "@/components/shared/lib/utils";
import { LucideIcon } from "lucide-react";
import { ContentSection } from "@/components/shared/ui";
import { SectionHeader } from "@/components/shared/ui/section-header";
import { Product, products } from "../../public/data/products";
import { ProductCard } from "../../components/entities/product/ui/product-card";
import { ProductModal } from "../../components/entities/product/ui/product-modal";
import { ShoppingCart, Package, Key } from "lucide-react";
import Link from "next/link";
import useCartStore from "../../components/store/useCartStore";

interface ShopPageProps {
  className?: string;
}

const ProductSection: React.FC<{
  title: string;
  description: string;
  icon: LucideIcon;
  products: Product[];
  onOpenModal: (product: Product) => void;
  isInCart: (id: number) => boolean;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (id: number) => void;
}> = ({
  title,
  description,
  icon,
  products,
  onOpenModal,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
}) => {
  return (
    <div className="mb-12">
      <SectionHeader
        title={title}
        icon={icon}
        extraContent={<p className="text-slate-300">{description}</p>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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

  const { items, addItem, removeItem, isInCart, _hasHydrated } = useCartStore();

  const openModal = (product: Product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  const handleAddToCartFromModal = () => {
    if (selectedProduct) {
      addItem(selectedProduct);
      closeModal();
    }
  };

  const handleRemoveFromCartFromModal = () => {
    if (selectedProduct) {
      removeItem(selectedProduct.id);
      closeModal();
    }
  };

  const subscriptionProducts = products.filter(
    (p) => p.type === "subscription",
  );
  const keyProducts = products.filter((p) => p.type === "key");
  const cartItemsCount = items.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  return (
    <div className={cn("relative min-h-screen flex flex-col", className)}>
      {_hasHydrated && (
        <div className="fixed top-24 right-2 z-50">
          <Link href="/cart" className="relative block">
            <div className="bg-slate-600 p-3 rounded-full shadow-lg hover:bg-slate-500 transition-colors">
              <ShoppingCart className="text-white" size={24} />
            </div>
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold pointer-events-none">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>
      )}

      <ContentSection
        title="Магазин сервера"
        iconSrc="/icons/shop-icon.webm"
        iconAlt="Shop Icon"
        className="flex-grow"
      >
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
