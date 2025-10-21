//components/features/auth/ui/registration-form/use-registration-form.ts

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '../../api/auth-api';
import { registrationSchema } from '../../model/schemas';
import type { RegistrationFormData } from '../../model/types';

interface RegistrationResult {
  email: string;
  password: string;
  devCode?: string;
}

export const useRegistrationForm = (
  onSuccess: (result: RegistrationResult) => void
) => {
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setError(null);

    try {
      const result = await authApi.register(data.email, data.password);
      
      onSuccess({
        email: data.email,
        password: data.password,
        devCode: result.devCode
      });
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