// shared/ui/quantity-input/QuantityInput.tsx

"use client";

import React, { useState } from "react";

interface QuantityInputProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  min = 1,
  max = 999,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(String(value));
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!/^\d*$/.test(raw)) return;
    setInputValue(raw);
    setError(null);

    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= min && parsed <= max) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed < min) {
      setInputValue(String(min));
      onChange(min);
    } else if (parsed > max) {
      setInputValue(String(max));
      onChange(max);
      setError(`Нельзя купить более ${max} ключей одного типа за раз`);
    } else {
      setInputValue(String(parsed));
    }
  };

  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value >= max) {
      setError(`Нельзя купить более ${max} ключей одного типа за раз`);
      return;
    }
    onChange(value + 1);
  };

  const btnBase =
    "flex h-10 w-10 items-center justify-center bg-slate-700 text-white transition-colors";

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= min}
          aria-label="Уменьшить количество"
          className={`${btnBase} rounded-l-lg ${
            value <= min
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-slate-600 active:bg-slate-500"
          }`}
        >
          −
        </button>

        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label="Количество товара"
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className="h-10 w-12 border-x border-slate-600 bg-slate-800 text-center text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />

        <button
          type="button"
          onClick={increment}
          disabled={value >= max}
          aria-label="Увеличить количество"
          className={`${btnBase} rounded-r-lg ${
            value >= max
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-slate-600 active:bg-slate-500"
          }`}
        >
          +
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
