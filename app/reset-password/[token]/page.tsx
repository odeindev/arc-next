// app/reset-password/[token]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Button } from '@/components/shared';

// Схема валидации для формы нового пароля
const newPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Пароль должен содержать заглавные, строчные буквы и цифры'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword']
});

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  // Проверяем валидность токена при загрузке страницы
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/validate-reset-token?token=${params.token}`);
        
        if (response.ok) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          toast.error('Недействительная или истекшая ссылка для сброса пароля');
        }
      } catch (error) {
        console.error('Ошибка при проверке токена', error);
        setIsValidToken(false);
        toast.error('Произошла ошибка при проверке ссылки');
      }
    };

    validateToken();
  }, [params.token]);

  const onSubmit = async (data: NewPasswordFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: params.token,
          password: data.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при установке нового пароля');
      }

      toast.success('Пароль успешно изменен');
      setIsSuccess(true);
      
      // Редирект на главную страницу через 3 секунды
      setTimeout(() => {
        router.replace('/');
      }, 3000);

    } catch (error) {
      if (error instanceof Error) {
        console.error('Ошибка при обновлении пароля', error.message);
        toast.error(error.message);
      } else {
        console.error('Неизвестная ошибка', error);
        toast.error('Произошла неизвестная ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Показываем загрузку пока проверяем токен
  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-800">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  // Если токен недействителен
  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-800">
        <div className="p-8 bg-slate-900 rounded-xl max-w-md w-full text-center">
          <Image
            src="/icons/logo.svg"
            width={48}
            height={48}
            alt="Logo"
            className="mx-auto"
          />
          <h1 className="mt-6 text-2xl font-bold text-white">Недействительная ссылка</h1>
          <p className="mt-2 text-gray-300">
            Эта ссылка для сброса пароля недействительна или срок ее действия истек.
          </p>
          <Button
            color="purple"
            text="Вернуться на главную"
            onClick={() => router.push('/')}
          />
        </div>
      </div>
    );
  }

  // Если пароль успешно обновлен
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-800">
        <div className="p-8 bg-slate-900 rounded-xl max-w-md w-full text-center">
          <Image
            src="/icons/logo.svg"
            width={48}
            height={48}
            alt="Logo"
            className="mx-auto"
          />
          <h1 className="mt-6 text-2xl font-bold text-white">Пароль изменен</h1>
          <p className="mt-2 text-gray-300">
            Ваш пароль был успешно изменен. Сейчас вы будете перенаправлены на страницу входа.
          </p>
        </div>
      </div>
    );
  }

  // Основная форма установки нового пароля
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800">
      <div className="p-8 bg-slate-900 rounded-xl max-w-md w-full">
        <div className="flex justify-center">
          <Image
            src="/icons/logo.svg"
            width={48}
            height={48}
            alt="Logo"
            className="mx-auto"
          />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-center text-white">
          Создание нового пароля
        </h1>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Новый пароль
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register('password')}
              className="px-2 bg-amber-50 block w-full rounded-md border-0 py-1.5 mt-1 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
              Подтвердите пароль
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register('confirmPassword')}
              className="px-2 bg-amber-50 block w-full rounded-md border-0 py-1.5 mt-1 text-gray-900 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              className="p-8"
              color="green"
              text={isLoading ? "Сохранение..." : "Сохранить новый пароль"}
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}