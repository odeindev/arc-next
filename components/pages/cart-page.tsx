// components/pages/cart-page.tsx
import React, { useEffect } from 'react';
import { cn } from '@/components/shared/lib/utils';
import { ContentSection } from '@/components/shared/ui';
import useCartStore from '@/components/store/useCartStore';
import { useCartCalculations } from '@/components/entities/cart/model/useCartCalculations';
import CartEmpty from '@/components/widgets/cart/cart-empty';
import CartList from '@/components/widgets/cart/cart-list';
import CartSummary from '@/components/widgets/cart/cart-summary';

interface Props {
  className?: string;
}

const CartPage: React.FC<Props> = ({ className }) => {
  const { 
    items: cartItems, 
    updateQuantity, 
    removeItem, 
    updateDuration, 
    clearCart,
    fetchCart
  } = useCartStore();
  
  const { isCartEmpty, total } = useCartCalculations(cartItems);
  
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  
  return (
    <div className={cn('relative min-h-screen flex flex-col', className)}>
      <ContentSection title="Корзина" className="flex-grow">
        {isCartEmpty ? (
          <CartEmpty />
        ) : (
          <div>
            <CartList 
              items={cartItems}
              onQuantityChange={updateQuantity}
              onDurationChange={updateDuration}
              onRemove={removeItem}
            />
            <CartSummary
              total={total}
              onClearCart={clearCart}
            />
          </div>
        )}
      </ContentSection>
    </div>
  );
};

export default CartPage;
