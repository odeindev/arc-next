'use client';

import { cn } from '@/components/shared/lib/utils';
import { Check, Copy, Server } from 'lucide-react';
import { ServerInfoProps } from '../model/types';
import { useState, useRef, useEffect } from 'react';

export const ServerInfoCard = ({ 
  serverVersion, 
  serverIp, 
  onCopy, 
  copied 
}: ServerInfoProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const copyBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (copyBtnRef.current) {
        const rect = copyBtnRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    if (isHovered) {
      window.addEventListener('mousemove', updateMousePosition);
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, [isHovered]);

  return (
    <div
      className={cn(
        'relative px-6 py-8 rounded-xl overflow-hidden',
        'border border-slate-700',
        'bg-gradient-to-t from-slate-800/70 to-slate-900/70',
        'shadow-xl max-w-lg mx-auto mt-4 transition-all duration-300'
      )}
    >
      {/* Информация о версии */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="border border-blue-500/50 rounded-full bg-gradient-to-br from-blue-700/30 to-blue-600/30 p-2 shadow-lg">
          <Server className="text-blue-400" size={20} />
        </div>
        <span className="font-bold text-white text-lg">
          Версия сервера:{' '}
          <span className="text-blue-400">
            {serverVersion}
          </span>
        </span>
      </div>

      {/* Копирование IP */}
      <div 
        className="bg-gradient-to-t from-slate-700/90 to-slate-800/90 px-6 py-4 rounded-lg mb-2 border border-slate-700/50"
      >
        <div className="text-center text-slate-300 mb-3 font-medium">
          Нажми, чтобы скопировать адрес:
        </div>
        <div
          ref={copyBtnRef}
          className="relative flex items-center justify-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-300 overflow-hidden"
          onClick={onCopy}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="button"
          aria-label="Скопировать IP адрес"
          style={{
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
          } as React.CSSProperties}
        >
          <span className="font-semibold text-white text-lg relative z-10">IP:</span>
          <span className="font-bold text-blue-400 mr-2 text-lg tracking-wide relative z-10">
            {serverIp}
          </span>
          <div className="relative z-10">
            {copied ? (
              <Check size={20} className="text-green-400" />
            ) : (
              <Copy size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
            )}
          </div>
          
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            style={{
              background: `radial-gradient(
                circle 100px at var(--mouse-x) var(--mouse-y), 
                rgba(59, 130, 246, 0.6), 
                transparent 60%
              )`,
            }}
          />
          <div 
            className={`absolute inset-0 transition-opacity duration-300 bg-gradient-to-r 
              from-blue-500/20 to-blue-600/20 
              hover:from-blue-500/30 hover:to-blue-600/30 
              border border-blue-500/30
              ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>
    </div>
  );
};