//components/features/auth/ui/login-form/use-login-form.ts

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { loginSchema } from '../../model/schemas';
import type { LoginFormData } from '../../model/types';

export const useLoginForm = (onSuccess: () => void) => {
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (!result?.ok) {
        throw new Error(result?.error || 'Ошибка авторизации');
      }

      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message === 'CredentialsSignin' 
          ? 'Неверный email или пароль' 
          : err.message
        );
      }
    }
  };

  return {
    form,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting
  };
};