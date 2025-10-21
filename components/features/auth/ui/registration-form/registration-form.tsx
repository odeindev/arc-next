//components/features/auth/ui/registration-form/registration-form.tsx

'use client';

import React from 'react';
import { Button } from '@/components/shared/ui';
import { useRegistrationForm } from './use-registration-form';

interface RegistrationFormProps {
  onSuccess: (data: { 
    email: string; 
    password: string;
    devCode?: string 
  }) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  onSuccess
}) => {
  const { form, error, onSubmit, isLoading } = useRegistrationForm(onSuccess);

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
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
          Пароль
        </label>
        <div className="mt-2">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
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

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-white">
          Подтвердите пароль
        </label>
        <div className="mt-2">
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            {...form.register('confirmPassword')}
            className="px-2 bg-amber-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-400">
            {form.formState.errors.confirmPassword.message}
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
          color="blue"
          text="Зарегистрироваться"
          disabled={isLoading}
        />
      </div>
    </form>
  );
};