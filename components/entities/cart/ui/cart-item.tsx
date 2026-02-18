// entities/cart/ui/CartItem.tsx

import React from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { QuantityInput } from "@/components/shared";
import { CartItemModel, Duration } from "../model/types";
import { MAX_QUANTITY } from "../model/duration";
import { DurationSelect } from "./duration-select";

interface CartItemProps {
  item: CartItemModel;
  subtotal: number;
  isLast?: boolean;
  onQuantityChange: (id: number, quantity: number) => void;
  onDurationChange: (id: number, duration: Duration) => void;
  onRemove: (id: number) => void;
}

const ProductBadge: React.FC<{ type: CartItemModel["product"]["type"] }> = ({
  type,
}) => {
  const isSubscription = type === "subscription";
  return (
    <p className="flex items-center text-sm text-slate-400">
      <span
        className={`mr-2 inline-block h-2 w-2 rounded-full ${
          isSubscription ? "bg-amber-400" : "bg-blue-400"
        }`}
      />
      {isSubscription ? "Привилегия" : "Ключ"}
    </p>
  );
};

const ProductAvatar: React.FC<{ name: string; icon?: string }> = ({
  name,
  icon,
}) => {
  if (icon) {
    return (
      <div className="relative mr-4 flex-shrink-0">
        <div className="absolute inset-0 rounded-lg bg-amber-400/20 blur-md" />
        <Image
          src={icon}
          alt={name}
          width={56}
          height={56}
          className="relative z-10 rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className="relative mr-4 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600">
      <div className="absolute inset-0 rounded-lg bg-white/10" />
      <span className="relative z-10 text-xl font-bold text-white">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

export const CartItem: React.FC<CartItemProps> = ({
  item,
  subtotal,
  isLast = false,
  onQuantityChange,
  onDurationChange,
  onRemove,
}) => {
  const { product, quantity, duration } = item;

  return (
    <div
      className={`grid grid-cols-1 items-center gap-4 p-6 transition-colors hover:bg-slate-700/30 md:grid-cols-12 ${
        !isLast ? "border-b border-slate-700/50" : ""
      }`}
    >
      {/* Продукт */}
      <div className="col-span-1 flex items-center md:col-span-6">
        <ProductAvatar name={product.name} icon={product.icon} />
        <div>
          <h3 className="text-lg font-bold text-white">{product.name}</h3>
          <ProductBadge type={product.type} />
        </div>
      </div>

      {/* Цена за единицу */}
      <div className="col-span-1 text-left md:col-span-2 md:text-center">
        <div className="mb-1 text-sm text-slate-400 md:hidden">Цена:</div>
        <div className="font-bold text-amber-400">{product.price} ₽</div>
      </div>

      {/* Срок / Количество */}
      <div className="col-span-1 text-left md:col-span-2 md:text-center">
        {product.type === "subscription" ? (
          <>
            <div className="mb-1 text-sm text-slate-400 md:hidden">Срок:</div>
            <DurationSelect
              value={duration}
              onChange={(newDuration) =>
                onDurationChange(product.id, newDuration)
              }
            />
          </>
        ) : (
          <>
            <div className="mb-1 text-sm text-slate-400 md:hidden">
              Количество:
            </div>
            <QuantityInput
              value={quantity}
              max={MAX_QUANTITY}
              onChange={(newQty: number) =>
                onQuantityChange(product.id, newQty)
              }
            />
          </>
        )}
      </div>

      {/* Итого + удаление */}
      <div className="col-span-1 flex items-center justify-between md:col-span-2 md:justify-end">
        <div>
          <div className="mb-1 text-sm text-slate-400 md:hidden">Сумма:</div>
          <div className="font-bold text-white">{subtotal} ₽</div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label="Удалить товар"
          className="ml-4 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-red-400"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};
