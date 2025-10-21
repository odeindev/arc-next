//components/features/auth/ui/login-form/login-form.tsx

'use client';

import React from 'react';
import { Button } from '@/components/shared/ui';
import { useLoginForm } from './use-login-form';

interface LoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess,
  onForgotPassword
}) => {
  const { form, error, onSubmit, isLoading } = useLoginForm(onSuccess);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
          Электронный адрес
        </label>
        <div className="mt-2">
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register('email')}
            className="px-2 bg-amber-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-red-400">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
            Пароль
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-semibold text-indigo-300 hover:text-gray-400"
          >
            Забыли пароль?
          </button>
        </div>
        <div className="mt-2">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register('password')}
            className="px-2 bg-amber-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        {form.formState.errors.password && (
          <p className="mt-1 text-sm text-red-400">
            {form.formState.errors.password.message}
          </p>
        )}
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
  );
};