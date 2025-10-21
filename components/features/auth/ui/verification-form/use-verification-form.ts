//components/features/auth/ui/verification-form/use-verification-form.ts

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { authApi } from '../../api/auth-api';
import { verificationSchema } from '../../model/schemas';
import type { VerificationFormData } from '../../model/types';

export const useVerificationForm = (
  email: string,
  password: string,
  onSuccess: () => void
) => {
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: ''
    }
  });

  const onSubmit = async (data: VerificationFormData) => {
    setError(null);

    try {
      const result = await authApi.verifyEmail(email, data.code);
      
      if (result.success) {
        // Автоматический вход после верификации
        const signInResult = await signIn('credentials', {
          email,
          password,
          redirect: false
        });

        if (signInResult?.error) {
          throw new Error(`Ошибка входа: ${signInResult.error}`);
        }

        onSuccess();
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
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