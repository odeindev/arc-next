'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal } from '../shared/index';

interface VerificationFormProps {
  isOpen: boolean;
  closeForm: () => void;
  email: string;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ 
  isOpen, 
  closeForm, 
  email 
}) => {
  const router = useRouter();
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
  
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }) // Исправлено с verificationCode на code
      });

      if (!response.ok) {
        // Если ошибка сервера (500), перенаправляем на страницу ошибки
        if (response.status === 500) {
          router.replace('/500');
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка верификации');
      }

      // Успешная верификация, перенаправляем на страницу входа
      router.replace('/login?verified=true');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ошибка верификации', error.message);
        setError(error.message || 'Ошибка верификации. Проверьте код и попробуйте снова.');
      } else {
        console.error('Неизвестная ошибка', error);
        router.replace('/500');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setIsResending(true);
    
    try {
      const response = await fetch('/api/auth/resend-code', { // Исправлен путь API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        if (response.status === 500) {
          router.replace('/500');
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при отправке кода');
      }

      // Показываем сообщение об успешной отправке
      setError('Новый код отправлен на вашу почту');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ошибка при повторной отправке', error.message);
        setError(error.message || 'Не удалось отправить код. Попробуйте позже.');
      } else {
        console.error('Неизвестная ошибка', error);
        router.replace('/500');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={closeForm} 
      title="Подтверждение аккаунта"
    >
      <div className="space-y-4">
        <p className="text-white text-sm text-center">
          Мы отправили код подтверждения на адрес <span className="font-medium">{email}</span>. 
          Пожалуйста, проверьте вашу электронную почту и введите код ниже.
        </p>

        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div>
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
                placeholder="Введите код"
                className="px-2 bg-amber-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && (
            <p className={`text-sm px-4 py-1 text-center bg-slate-900 rounded-md transition-all duration-300 ease-in-out hover:bg-slate-700 hover:text-white ${error.includes('Новый код') ? 'text-green-400' : 'text-[rgba(239,68,68,0.6)]'}`}>
              {error}
            </p>
          )}

          <div className="flex flex-col space-y-3">
            <Button
              color="blue"
              text="Подтвердить"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors self-center cursor-pointer"
            >
              {isResending ? 'Отправка...' : 'Отправить код повторно'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export { VerificationForm };