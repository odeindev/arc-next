// @app/utils/highlightText.ts
import React from 'react';

// Определяем тип для результата - либо строка, либо массив элементов React
export type HighlightedText = string | (string | React.ReactElement)[];

export function highlightText(text: string, searchQuery: string): HighlightedText {
  if (!searchQuery) return text;
  
  // Возвращаем массив элементов React вместо JSX напрямую
  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
  return parts.map((part, i) => 
    part.toLowerCase() === searchQuery.toLowerCase() 
      ? React.createElement('mark', {
          key: i,
          className: "bg-orange-400/20 text-orange-100 px-1 rounded"
        }, part)
      : part
  );
}