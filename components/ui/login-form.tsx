'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal } from '../shared/index';

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
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  
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
        // Если ошибка сервера (500), перенаправляем на страницу ошибки
        if (response.status === 500) {
          router.replace('/500');
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка авторизации');
      }
  
      const { token } = await response.json();
      
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
        setError(error.message || 'Ошибка авторизации. Проверьте свои данные и попробуйте снова.');
      } else {
        console.error('Неизвестная ошибка', error);
        router.replace('/500');
      }
    }
  };
  
  const handleModalClose = () => {
    closeForm();
    if (setIsAnyFormOpen) {
      setIsAnyFormOpen(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleModalClose} 
      title="Войдите в свой аккаунт"
    >
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
          {error && (
            <p className="text-[rgba(239,68,68,0.6)] px-4 py-1 text-center text-sm bg-slate-900 rounded-md transition-all duration-300 ease-in-out hover:bg-slate-700 hover:text-white">
              {error}
            </p>
          )}
        <div className="flex justify-around">
          <Button
            color="green"
            text="Войти в аккаунт"
          />
        </div>
      </form>
    </Modal>
  );
};

export { LoginForm };