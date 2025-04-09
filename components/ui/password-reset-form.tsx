'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal } from '../shared/index';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface PasswordResetFormProps {
  isOpen: boolean;
  closeForm: () => void;
  setIsAnyFormOpen?: (isOpen: boolean) => void;
}

// Схема валидации для формы
const resetSchema = z.object({
  email: z.string().email('Введите корректный email')
});

type ResetFormValues = z.infer<typeof resetSchema>;

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  isOpen,
  closeForm,
  setIsAnyFormOpen
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email })
      });

      if (!response.ok) {
        // Если ошибка сервера (500), перенаправляем на страницу ошибки
        if (response.status === 500) {
          router.replace('/500');
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при запросе сброса пароля');
      }

      setSuccessMessage('Инструкции по сбросу пароля отправлены на ваш email');
      toast.success('Инструкции отправлены на ваш email');
      reset(); // Очищаем форму
      
      // Закрываем форму через 3 секунды после успешной отправки
      setTimeout(() => {
        handleModalClose();
      }, 3000);
      
    } catch (error) {
      if (error instanceof Error) {
        console.error('Ошибка сброса пароля', error.message);
        toast.error(error.message || 'Произошла ошибка при отправке запроса');
      } else {
        console.error('Неизвестная ошибка', error);
        router.replace('/500');
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
    // Сбрасываем состояние формы при закрытии
    reset();
    setSuccessMessage(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Восстановление пароля"
    >
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              {...register('email')}
              className="px-2 bg-amber-50 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">
              {errors.email.message}
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
    </Modal>
  );
};

export { PasswordResetForm };