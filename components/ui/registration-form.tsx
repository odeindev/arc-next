'use client';

import React from 'react';
import { Button, Modal } from '../shared/index';

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
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
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
        throw new Error('Ошибка регистрации');
      }

      const { token } = await response.json();
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }

      closeForm();
      setIsAnyFormOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ошибка регистрации', error.message);
        setError('Ошибка регистрации. Проверьте свои данные и попробуйте снова.');
      } else {
        console.error('Неизвестная ошибка', error);
        setError('Произошла неизвестная ошибка.');
      }
    }
  };

  const handleModalClose = () => {
    closeForm();
    setIsAnyFormOpen(false);
  };

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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-around">
          <Button
            color="blue"
            text="Зарегистрироваться"
          />
        </div>
      </form>
    </Modal>
  );
};

export { RegistrationForm };