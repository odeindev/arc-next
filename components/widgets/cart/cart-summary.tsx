// components/cart/CartSummary.tsx

import React from "react";
import Link from "next/link";
import { Trash2, PackageCheck, Undo } from "lucide-react";
import { Button } from "@/components/shared/ui";

interface CartSummaryProps {
  total: number;
  onClearCart: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ total, onClearCart }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 md:mb-0">
        <Link href="/shop">
          <button className="flex items-center text-slate-300 hover:text-red-400 hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors">
            <Undo size={20} className="mr-2" />
            Вернуться назад
          </button>
        </Link>
        <button
          onClick={onClearCart}
          className="flex items-center text-slate-300 hover:text-red-400 hover:bg-slate-700/50 px-4 py-2 rounded-lg transition-colors"
        >
          <Trash2 size={20} className="mr-2" />
          Очистить корзину
        </button>
      </div>
      <div className="w-full md:w-auto">
        <div className="flex justify-between md:justify-end items-center mb-4">
          <div className="text-slate-300 mr-4 font-medium">Итого:</div>
          <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            {total} ₽
          </div>
        </div>
        <Button
          color="green"
          text="Оформить заказ"
          icon={<PackageCheck className="" />}
          className="w-full md:w-64 group relative overflow-hidden shadow-lg shadow-green-500/10"
        />
      </div>
    </div>
  );
};

export default CartSummary;
