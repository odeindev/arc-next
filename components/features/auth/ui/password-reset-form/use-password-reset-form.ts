//components/features/auth/ui/password-reset-form/use-password-reset-form.ts

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { authApi } from '../../api/auth-api';
import { passwordResetSchema } from '../../model/schemas';
import type { PasswordResetFormData } from '../../model/types';

export const usePasswordResetForm = (onSuccess: () => void) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: PasswordResetFormData) => {
    setSuccessMessage(null);

    try {
      await authApi.resetPassword(data.email);
      
      const message = 'Инструкции по сбросу пароля отправлены на ваш email';
      setSuccessMessage(message);
      toast.success(message);
      form.reset();
      
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };

  return {
    form,
    successMessage,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: form.formState.isSubmitting
  };
};