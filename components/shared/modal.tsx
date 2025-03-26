'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  logoSrc?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  logoSrc = '/icons/logo.svg'
}) => {
  // Закрытие формы при нажатии на клавишу "Esc"
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.id === 'modal-overlay') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id='modal-overlay'
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? 'modal-enter' : 'modal-exit'
      }`}
      onClick={handleOverlayClick}
    >
      <div className="flex min-h-[320px] flex-col justify-center px-6 py-8 lg:px-10 rounded-xl bg-slate-800/95">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className='flex justify-end'>
            <X
              size={32}
              className='text-white transition-transform duration-300 cursor-pointer'
              onClick={onClose}
            />
          </div>
          <Image
            src={logoSrc}
            width={48}
            height={48}
            alt='Logo'
            className='mx-auto cursor-pointer'
          />
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            {title}
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;