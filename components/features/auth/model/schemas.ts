// ============================================
// features/auth/model/schemas.ts
// ============================================
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(1, 'Введите пароль')
});

export const registrationSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword']
});

export const verificationSchema = z.object({
  code: z.string().min(6, 'Код должен содержать 6 символов')
});

export const passwordResetSchema = z.object({
  email: z.string().email('Введите корректный email')
});