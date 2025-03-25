'use client';

import React from 'react';
import Image from 'next/image';
import Button from './button';
import { X } from 'lucide-react';

interface LoginFormProps {
  isOpen: boolean;
  closeForm: () => void; 
  setIsAnyFormOpen?: (isOpen: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  isOpen, 
  closeForm, 
  setIsAnyFormOpen 
}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  
  // Закрытие формы при нажатии на клавишу "Esc"
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeForm();
        if (setIsAnyFormOpen) {
          setIsAnyFormOpen(false);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeForm, setIsAnyFormOpen]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }
  
      const { token } = await response.json();
      
      // Безопасное сохранение токена (только на клиенте)
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
  
      closeForm();
      if (setIsAnyFormOpen) {
        setIsAnyFormOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ошибка авторизации', error.message);
        setError('Ошибка авторизации. Проверьте свои данные и попробуйте снова.');
      } else {
        console.error('Неизвестная ошибка', error);
        setError('Произошла неизвестная ошибка.');
      }
    }
  };
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target && (e.target as HTMLElement).id === 'login') {
      closeForm();
      if (setIsAnyFormOpen) {
        setIsAnyFormOpen(false);
      }
    }
  };
  
  const handleCloseButtonClick = () => {
    closeForm();
    if (setIsAnyFormOpen) {
      setIsAnyFormOpen(false);
    }
  };

  return (
    <>
      {/* Модальная форма логина */}
      <div
        id="login"
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          isOpen ? 'modal-enter' : 'modal-exit'
        }`}
        onClick={handleOverlayClick}
      >
      <div className={`flex min-h-[320px] flex-col justify-center px-6 py-8 lg:px-10 rounded-xl bg-slate-800/95`}>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className='flex justify-end'>
              <X
                size={32}
                className='text-white transition-transform duration-300 cursor-pointer'
                onClick={handleCloseButtonClick}
              />
            </div>
            <Image
              src='/icons/logo.svg'
              width={48}
              height={48}
              alt='Logo'
              className='mx-auto cursor-pointer'
            />
            <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-white">
              Войдите в свой аккаунт
            </h2>
          </div>

          <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                  Электронный адрес
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="px-2 bg-amber-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                    Пароль
                  </label>
                  <div className="text-sm">
                    <button
                      type="button"
                      className="font-semibold text-indigo-300 hover:text-gray-400"
                    >
                      Забыли пароль?
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="px-2 bg-amber-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-around">
                <Button
                  color="green"
                  text="Войти в аккаунт"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
