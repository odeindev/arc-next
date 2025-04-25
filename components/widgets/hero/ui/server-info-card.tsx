'use client';

import { cn } from '@/components/shared/lib/utils';
import { Check, Copy, Server } from 'lucide-react';
import { ServerInfoProps } from '../model/types';
import { useState } from 'react';

export const ServerInfoCard = ({ 
  serverVersion, 
  serverIp, 
  onCopy, 
  copied 
}: ServerInfoProps) => {
  const [copyFeedback, setCopyFeedback] = useState<'idle' | 'copied'>('idle');
  
  const handleCopy = () => {
    onCopy();
    setCopyFeedback('copied');
    setTimeout(() => setCopyFeedback('idle'), 2000);
  };

  return (
    <div
      className={cn(
        'relative px-6 py-8 rounded-xl overflow-hidden',
        'border border-slate-700',
        'bg-gradient-to-t from-slate-800/70 to-slate-900/70',
        'shadow-xl max-w-lg mx-auto mt-4 transition-all duration-300',
        'backdrop-blur-sm'
      )}
    >
      {/* Декоративные элементы фона */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Информация о версии */}
      <div className="relative flex items-center justify-center gap-4 mb-6">
        <div className="border border-blue-500/50 rounded-full bg-gradient-to-br from-blue-700/30 to-blue-600/30 p-2.5 shadow-lg shadow-blue-900/20 animate-pulse">
          <Server className="text-blue-400" size={22} />
        </div>
        <span className="font-bold text-white text-lg">
          Версия сервера:{' '}
          <span className="text-blue-400 relative">
            {serverVersion}
            <span className="absolute bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></span>
          </span>
        </span>
      </div>

      {/* Копирование IP */}
      <div 
        className="bg-gradient-to-t from-slate-700/90 to-slate-800/90 px-6 py-4 rounded-lg mb-2 border border-slate-700/50 shadow-inner"
      >
        <div className="text-center text-slate-300 mb-3 font-medium">
          Нажми, чтобы скопировать адрес:
        </div>
        <button
          className="relative flex items-center justify-center gap-3 w-full cursor-pointer p-3 rounded-lg group transition-all duration-300 overflow-hidden"
          onClick={handleCopy}
          aria-label="Скопировать IP адрес"
          tabIndex={0}
        >
          {/* Интерактивный фон с hover-эффектом */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 
                          group-hover:from-blue-500/30 group-hover:to-blue-600/30 
                          border border-blue-500/30 rounded-lg transition-all duration-300
                          group-focus:ring-2 group-focus:ring-blue-500/50">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg
                          bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)]
                          [transform-origin:center] group-hover:scale-150"></div>
          </div>
          
          <span className="font-semibold text-white text-lg relative z-10">IP:</span>
          <span className="font-bold text-blue-400 mr-2 text-lg tracking-wide relative z-10 group-hover:text-blue-300 transition-colors duration-300">
            {serverIp}
          </span>
          <div className="relative z-10 transition-transform group-hover:scale-110 duration-300">
            {copied || copyFeedback === 'copied' ? (
              <span className="flex items-center text-green-400 gap-1">
                <Check size={20} className="animate-in fade-in slide-in-from-bottom-2 duration-300" />
                <span className="text-sm animate-in fade-in slide-in-from-bottom-1 duration-300">Скопировано</span>
              </span>
            ) : (
              <Copy size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
            )}
          </div>
        </button>
      </div>
      
      {/* Шейдер эффект на фоне */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
    </div>
  );
};