'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui';
import { Modal } from '@/components/shared';
import { PasswordResetForm } from './password-reset-form';
import { signIn } from 'next-auth/react';

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
  const [isResetFormOpen, setIsResetFormOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Отключаем автоматический редирект для обработки ошибок
      });

      if (!result?.ok) {
        throw new Error(result?.error || 'Ошибка авторизации');
      }

      // Закрываем форму
      closeForm();
      if (setIsAnyFormOpen) {
        setIsAnyFormOpen(false);
      }
      
      // Перенаправляем на страницу аккаунта
      router.push('/account');
      router.refresh(); // Обновляем страницу для применения изменений состояния авторизации
      
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ошибка авторизации', error.message);
        
        // Обработка различных ошибок авторизации
        if (error.message === 'CredentialsSignin') {
          setError('Неверный email или пароль');
        } else {
          setError(error.message || 'Ошибка авторизации. Проверьте свои данные и попробуйте снова.');
        }
      } else {
        console.error('Неизвестная ошибка', error);
        setError('Произошла неизвестная ошибка. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleModalClose = () => {
    closeForm();
    if (setIsAnyFormOpen) {
      setIsAnyFormOpen(false);
    }
  };

  const openResetForm = () => {
    setIsResetFormOpen(true);
  };

  const closeResetForm = () => {
    setIsResetFormOpen(false);
  };

  // Если форма сброса пароля открыта, скрываем форму логина
  if (isResetFormOpen) {
    return (
      <PasswordResetForm 
        isOpen={isResetFormOpen} 
        closeForm={closeResetForm}
        setIsAnyFormOpen={setIsAnyFormOpen}
      />
    );
  }

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
                onClick={openResetForm}
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
            disabled={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export { LoginForm };