'use client';

import { cn } from '@/components/shared/lib/utils';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { Container, Button } from '@/components/shared/ui';
import { LoginForm, RegistrationForm } from '../features/auth/ui';
import { navLinks } from '@/public/data/links'; // Обновленный импорт

type FormType = 'login' | 'register' | null;

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
    setActiveForm(null);
  }, []);

  const openForm = useCallback((form: FormType) => {
    setActiveForm(prev => prev === form ? null : form);
    setIsMenuOpen(false);
  }, []);

  const closeForm = useCallback(() => {
    setActiveForm(null);
  }, []);

  // Закрытие при клике вне форм/меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideMenu = !menuRef.current?.contains(event.target as Node);
      const isOutsideForm = !formRef.current?.contains(event.target as Node);

      if (isOutsideMenu && isOutsideForm) {
        setIsMenuOpen(false);
        setActiveForm(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderNavLinks = (isMobile = false) => (
    <ul className={cn(
      "flex flex-col list-none text-white font-semibold",
      isMobile ? "gap-8 items-center" : "md:flex-row gap-6"
    )}>
      {navLinks.map((link, index) => (
        <li key={index}>
          <a 
            href={link.href} 
            className='text-white text-base font-bold relative after:absolute after:right-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-teal-500 after:transition-[width,left] after:duration-500 after:ease-in-out hover:after:w-full hover:after:left-0'
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
  

  const renderAuthButtons = (isMobile = false) => {
    const buttonClassName = isMobile ? 'w-full' : '';
    return (
      <div className={cn('flex space-x-2', isMobile && 'flex-col space-x-0 space-y-2')}>
        <Button 
          color='green' 
          text='Вход' 
          className={buttonClassName} 
          onClick={() => openForm('login')} 
        />
        <Button 
          color='blue' 
          text='Регистрация' 
          className={buttonClassName} 
          onClick={() => openForm('register')} 
        />
      </div>
    );
  };

  return (
    <header 
      className={cn(
        'font-[Mulish] shadow-lg bg-gradient-to-t from-gray-900 to-slate-800', 
        className
      )}
    >
      <Container className='py-4 px-4 md:px-16'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 group">
            <Image 
              src='/icons/logo.svg' 
              width={48} 
              height={48} 
              alt='Logo' 
              className='transition-transform duration-300 group-hover:rotate-16' 
            />
          <h1 className="font-[Chakra_Petch] text-white font-semibold text-xl hidden lg:block transition-colors duration-300">
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
            className='md:hidden text-white' 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isMenuOpen ? (
              <X size={32} className='transition-transform duration-300' />
            ) : (
              <Menu size={32} className='transition-transform duration-300' />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav 
            ref={menuRef} 
            className='mt-4 p-4 md:hidden flex flex-col items-center gap-4'
          >
            {renderNavLinks(true)}
            <div className='mt-4 w-full'>
              {renderAuthButtons(true)}
            </div>
          </nav>
        )}

        {/* Forms */}
        <div ref={formRef}>
        {activeForm === 'login' && (
          <LoginForm 
            isOpen={true} 
            closeForm={closeForm} 
            setIsAnyFormOpen={() => setActiveForm(null)}
          />
        )}
        {activeForm === 'register' && (
          <RegistrationForm 
            isOpen={true} 
            closeForm={closeForm} 
            setIsAnyFormOpen={() => setActiveForm(null)}
          />
        )}
        </div>
      </Container>
    </header>
  );
};