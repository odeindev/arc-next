//components/features/auth/ui/password-reset-form/password-reset-form.tsx

'use client';

import React from 'react';
import { Button } from '@/components/shared/ui';
import { usePasswordResetForm } from './use-password-reset-form';

interface PasswordResetFormProps {
  onSuccess: () => void;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSuccess
}) => {
  const { form, successMessage, onSubmit, isLoading } = usePasswordResetForm(onSuccess);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium leading-6 text-white"
        >
          Электронный адрес
        </label>
        <div className="mt-2">
          <input
            id="email"
            type="email"
            autoComplete="email"
            disabled={isLoading}
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

      {successMessage && (
        <p className="text-green-400 px-4 py-2 text-center text-sm bg-slate-800 rounded-md">
          {successMessage}
        </p>
      )}

      <div className="flex justify-around">
        <Button
          color="green"
          text={isLoading ? "Отправка..." : "Восстановить пароль"}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};