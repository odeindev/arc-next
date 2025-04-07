'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal } from '../shared/index';
import { VerificationForm } from './verification-form';

interface RegistrationFormProps {
  isOpen: boolean;
  closeForm: () => void;
  setIsAnyFormOpen: (isOpen: boolean) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  isOpen, 
  closeForm, 
  setIsAnyFormOpen 
}) => {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showVerification, setShowVerification] = React.useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
  
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await fetch('/api/auth/register', {
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
        throw new Error(errorData.error || 'Ошибка регистрации');
      }

      // Успешная регистрация, показываем форму верификации
      setShowVerification(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ошибка регистрации', error.message);
        setError(error.message || 'Ошибка регистрации. Проверьте свои данные и попробуйте снова.');
      } else {
        console.error('Неизвестная ошибка', error);
        router.replace('/500');
      }
    } finally {
      setIsSubmitting(true);
    }
  };

  const handleModalClose = () => {
    closeForm();
    setIsAnyFormOpen(false);
  };

  // Закрыть форму верификации и форму регистрации
  const handleVerificationClose = () => {
    setShowVerification(false);
    closeForm();
    setIsAnyFormOpen(false);
  };

  // Если показываем форму верификации, то рендерим её вместо формы регистрации
  if (showVerification) {
    return (
      <VerificationForm 
        isOpen={showVerification}
        closeForm={handleVerificationClose}
        email={email}
      />
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleModalClose} 
      title="Регистрация аккаунта"
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
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
            Пароль
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-2 bg-amber-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-white">
            Подтвердите пароль
          </label>
          <div className="mt-2">
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            color="blue"
            text="Зарегистрироваться"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Modal>
  );
};

export { RegistrationForm };