// @app/components/shared/ui/search-field.tsx
'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/components/shared/lib/utils';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  autoFocus?: boolean;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  placeholder = "Поиск...",
  className,
  debounceMs = 300,
  autoFocus = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Синхронизация внешнего значения с локальным
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Автофокус при необходимости
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Применяем дебаунс для уменьшения числа обновлений при быстром вводе
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');
    
    // Фокус на поле после очистки для удобства пользователя
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onChange]);

  // Обработчик клавиш, в частности Escape для очистки
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="text-slate-400" size={20} />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3 bg-slate-800/80 text-white rounded-lg border border-slate-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all"
        value={localValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label={placeholder}
      />
      
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Очистить поиск"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};