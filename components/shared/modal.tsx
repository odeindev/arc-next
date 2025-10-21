//components/shared/ui/modal.tsx

'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  logoSrc?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  logoSrc = '/icons/logo.svg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        className="relative flex min-h-[320px] w-full max-w-md flex-col justify-center px-6 py-8 lg:px-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-xl modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-end">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer transition-colors"
              onClick={onClose}
              aria-label="Закрыть"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex justify-center">
            <div className="border border-gray-500 rounded-full bg-gradient-to-br from-gray-700 to-slate-600 p-2 shadow-xl">
              <Image
                src={logoSrc}
                width={48}
                height={48}
                alt="Logo"
                className="mx-auto"
              />
            </div>
          </div>
          
          <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            {title}
          </h2>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
};