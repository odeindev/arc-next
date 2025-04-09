'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/ui';
import { Modal } from '@/components/shared';
import { signIn } from 'next-auth/react';

interface VerificationFormProps {
  isOpen: boolean;
  closeForm: () => void;
  email: string;
  initialCode?: string | null;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ 
  isOpen, 
  closeForm, 
  email,
  initialCode
}) => {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState(initialCode || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Если код был передан в пропсах (для режима разработки), автоматически заполняем поле
  useEffect(() => {
    if (initialCode) {
      setVerificationCode(initialCode);
    }
  }, [initialCode]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Отправляем запрос на верификацию email
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          code: verificationCode 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка верификации');
      }

      // Показываем сообщение об успехе
      setSuccess(true);
      
      // Автоматически входим в систему после верификации
      setTimeout(async () => {
        try {
          // Выполняем вход по credentials
          const signInResult = await signIn('credentials', {
            email,
            // Здесь можно передать пароль обратно, если он у вас сохранен в состоянии формы регистрации
            // Либо можно реализовать автоматический вход через одноразовый токен, сохраненный в сессии
            redirect: false,
            callbackUrl: '/account'
          });

          if (signInResult?.ok) {
            // Закрываем форму и перенаправляем на страницу аккаунта
            closeForm();
            router.push('/account');
          } else {
            // Если автовход не удался, перенаправляем на страницу входа
            closeForm();
            router.push('/auth/login');
          }
        } catch (signInError) {
          console.error('Ошибка автоматического входа:', signInError);
          closeForm();
          router.push('/auth/login');
        }
      }, 2000);
      
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || 'Ошибка верификации. Проверьте код и попробуйте снова.');
      } else {
        setError('Произошла неизвестная ошибка. Пожалуйста, попробуйте позже.');
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
      {success ? (
        <div className="text-center">
          <p className="text-green-400 mb-4">Email успешно подтвержден!</p>
          <p className="text-white">Переадресация на страницу аккаунта...</p>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div>
            <p className="text-white mb-4">
              Код подтверждения отправлен на email: <strong>{email}</strong>
            </p>
            <label htmlFor="verification-code" className="block text-sm font-medium leading-6 text-white">
              Код подтверждения
            </label>
            <div className="mt-2">
              <input
                id="verification-code"
                name="verification-code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
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
              text="Подтвердить"
              disabled={isSubmitting}
            />
          </div>
        </form>
      )}
    </Modal>
  );
};

export { VerificationForm };