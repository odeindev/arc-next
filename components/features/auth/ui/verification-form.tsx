// verification-form.tsx (вероятный путь)
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useAuth } from '@/components/shared/context/auth-context';
import { Button } from '@/components/shared/ui';
import { Modal } from '@/components/shared/';

interface VerificationFormProps {
  isOpen: boolean;
  closeForm: () => void;
  email: string;
  initialCode: string | null;
}

const VerificationForm: React.FC<VerificationFormProps> = ({
  isOpen,
  closeForm,
  email,
  initialCode
}) => {
  const router = useRouter();
  const { tempPassword } = useAuth(); // Получаем временный пароль из контекста
  const [code, setCode] = React.useState(initialCode || '');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Отправляем запрос на верификацию
      const verifyResponse = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code })
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'Ошибка верификации');
      }

      const verifyData = await verifyResponse.json();
      
      if (verifyData.success) {
        // После успешной верификации выполняем автоматический вход
        const result = await signIn('credentials', {
          email,
          password: tempPassword,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(`Ошибка входа: ${result.error}`);
        }

        // Успешный вход, закрываем форму и перенаправляем на страницу аккаунта
        closeForm();
        router.push('/account');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={closeForm} 
      title="Подтверждение email"
    >
      <form className="space-y-6" onSubmit={handleFormSubmit}>
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
              name="verification-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
            text={isSubmitting ? "Проверка..." : "Подтвердить"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </Modal>
  );
};

export { VerificationForm };