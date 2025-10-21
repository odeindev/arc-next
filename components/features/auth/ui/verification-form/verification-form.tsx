//components/features/auth/ui/verification-form/verification-form.tsx

'use client';

import React from 'react';
import { Button } from '@/components/shared/ui';
import { useVerificationForm } from './use-verification-form';

interface VerificationFormProps {
  email: string;
  password: string;
  initialCode?: string;
  onSuccess: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  email,
  password,
  initialCode,
  onSuccess
}) => {
  const { form, error, onSubmit, isLoading } = useVerificationForm(
    email,
    password,
    onSuccess
  );

  React.useEffect(() => {
    if (initialCode) {
      form.setValue('code', initialCode);
    }
  }, [initialCode, form]);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <p className="text-sm text-gray-300 mb-4">
          Мы отправили код подтверждения на адрес {email}.
          Пожалуйста, введите его ниже для завершения регистрации.
        </p>
        <label htmlFor="verification-code" className="block text-sm font-medium leading-6 text-white">
          Код подтверждения
        </label>
        <div className="mt-2">
          <input
            id="verification-code"
            type="text"
            {...form.register('code')}
            className="px-2 bg-amber-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        {form.formState.errors.code && (
          <p className="mt-1 text-sm text-red-400">
            {form.formState.errors.code.message}
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
          text={isLoading ? "Проверка..." : "Подтвердить"}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};