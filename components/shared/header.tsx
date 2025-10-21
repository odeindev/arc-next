// components/shared/header.tsx
'use client';

import { cn } from '@/components/shared/lib/utils';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Container, Button } from '@/components/shared/ui';
import { AuthModal, useAuthModal } from '@/components/widgets/auth-modal';
import { navLinks } from '@/public/data/links';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Используем хук для управления модальным окном
  const authModal = useAuthModal();

  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleOpenLogin = useCallback(() => {
    authModal.open('login');
    setIsMenuOpen(false);
  }, [authModal]);

  const handleOpenRegister = useCallback(() => {
    authModal.open('register');
    setIsMenuOpen(false);
  }, [authModal]);

  // Отслеживание скролла для изменения фона
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideMenu = !menuRef.current?.contains(event.target as Node);

      if (isOutsideMenu) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen]);

  const renderNavLinks = (isMobile = false) => (
    <ul className={cn(
      "flex flex-col list-none text-white font-semibold",
      isMobile ? "gap-8 items-center" : "md:flex-row gap-6"
    )}>
      {navLinks.map((link, index) => {
        const isActive = pathname === link.href;
        return (
          <li key={index}>
            <a 
              href={link.href} 
              className={cn(
                'text-white text-base font-bold relative transition-colors duration-300',
                'after:absolute after:bottom-[-2px] after:h-[2px] after:bg-teal-400',
                'after:transition-all after:duration-300 hover:text-teal-200',
                isActive 
                  ? 'after:w-full after:left-0 text-teal-300' 
                  : 'after:w-0 after:right-0 hover:after:w-full hover:after:left-0'
              )}
            >
              {link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
  
  const renderAuthButtons = (isMobile = false) => {
    const buttonClassName = isMobile ? 'w-full' : '';
    return (
      <div className={cn('flex space-x-2', isMobile && 'flex-col space-x-0 space-y-2')}>
        <Button 
          color='green' 
          text='Войти' 
          className={cn(
            buttonClassName,
            'transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20 hover:scale-105'
          )} 
          onClick={handleOpenLogin}
        />
        <Button 
          color='blue' 
          text='Регистрация' 
          className={cn(
            buttonClassName,
            'transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105'
          )} 
          onClick={handleOpenRegister}
        />
      </div>
    );
  };

  return (
    <>
      <header 
        className={cn(
          'font-[Mulish] top-0 left-0 right-0 w-full z-50 transition-all duration-300',
          isScrolled 
            ? 'backdrop-blur-md bg-gray-900/90 shadow-xl' 
            : 'bg-gradient-to-b from-gray-900/90 to-slate-800/80 shadow-lg',
          className
        )}
      >
        <Container className='py-4 px-4 lg:px-16'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 group">
              <div className="relative overflow-hidden">
                <Image 
                  src='/icons/logo.svg' 
                  width={48} 
                  height={48} 
                  alt='Logo' 
                  className='transition-all duration-500 ease-in-out group-hover:rotate-12 group-hover:scale-110' 
                />
              </div>
              <h1 className="font-[Chakra_Petch] text-white font-semibold text-xl hidden sm:block transition-all duration-300 group-hover:text-teal-300">
                Arcadia Craft
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className='hidden md:flex space-x-6'>
              {renderNavLinks()}
            </nav>

            {/* Authentication Buttons */}
            <div className='hidden md:flex space-x-2'>
              {renderAuthButtons()}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className='md:hidden text-white p-1 rounded-md transition-all duration-300 hover:bg-white/10' 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {isMenuOpen ? (
                <X size={28} className='transition-transform duration-300 rotate-90' />
              ) : (
                <Menu size={28} className='transition-transform duration-300' />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden" aria-hidden="true" />
          )}
          <nav 
            ref={menuRef}
            className={cn(
              'mt-4 p-6 md:hidden flex flex-col items-center gap-4 bg-gray-800 rounded-lg shadow-xl',
              'transition-all duration-300 ease-in-out',
              isMenuOpen 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-4 pointer-events-none absolute'
            )}
          >
            {renderNavLinks(true)}
            <div className='mt-6 w-full'>
              {renderAuthButtons(true)}
            </div>
          </nav>
        </Container>
      </header>

      {/* Auth Modal - рендерится отдельно */}
      <AuthModal
        isOpen={authModal.isOpen}
        view={authModal.view}
        verificationData={authModal.verificationData}
        onClose={authModal.close}
        onSwitchToLogin={authModal.switchToLogin}
        onSwitchToRegister={authModal.switchToRegister}
        onSwitchToReset={authModal.switchToReset}
        onSwitchToVerification={authModal.switchToVerification}
      />
    </>
  );
};