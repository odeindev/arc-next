// /src/widgets/hero/ui/server-info-card.tsx

'use client';

import { cn } from '@/components/shared/lib/utils';
import { Check, Copy, Server } from 'lucide-react';
import { ServerInfoProps } from '../model/types';

export const ServerInfoCard = ({ 
  serverVersion, 
  serverIp, 
  onCopy, 
  copied 
}: ServerInfoProps) => {
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-slate-900/80 to-slate-700/50 backdrop-blur-lg rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(74,144,226,0.3)] max-w-lg mx-auto mt-4 transition-all duration-1000 delay-500 border border-slate-600/30'
      )}
    >
      <div className="relative p-8">
        {/* Блики на стекле */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Информация о версии */}
        <div className="flex items-center justify-center gap-4 mb-6 relative">
          <Server className="text-cyan-400" size={24} />
          <span className="font-semibold text-white/90 text-lg">
            Версия сервера:{' '}
            <span className="bg-gradient-to-r from-teal-400 to-blue-400 text-transparent bg-clip-text font-bold">
              {serverVersion}
            </span>
          </span>
        </div>

        {/* Копирование IP */}
        <div className="bg-slate-800/70 backdrop-blur-sm px-6 py-4 rounded-xl mb-2 relative overflow-hidden group">
          {/* Анимированный фон при наведении */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="text-center text-slate-300 mb-2 font-medium">
            Нажми, чтобы скопировать адрес:
          </div>
          <div
            className="flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-700/50 p-3 rounded-lg transition-all duration-300 group relative"
            onClick={onCopy}
            role="button"
            aria-label="Скопировать IP адрес"
          >
            <span className="font-semibold text-white text-lg">IP:</span>
            <span className="font-bold bg-gradient-to-r from-cyan-300 to-blue-400 text-transparent bg-clip-text mr-2 text-lg tracking-wide">
              {serverIp}
            </span>
            <div className="relative">
              {copied ? (
                <Check size={20} className="text-green-400" />
              ) : (
                <Copy size={20} className="text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Уведомление о копировании */}
      {copied && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-xl animate-fadeIn z-50 backdrop-blur-sm flex items-center gap-2">
          <Check size={18} />
          IP-адрес скопирован!
        </div>
      )}
    </div>
  );
};