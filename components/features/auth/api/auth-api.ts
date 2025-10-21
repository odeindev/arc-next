// ============================================
// features/auth/api/auth-api.ts
// ============================================
export const authApi = {
    register: async (email: string, password: string) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка регистрации');
      }
  
      return response.json();
    },
  
    verifyEmail: async (email: string, code: string) => {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка верификации');
      }
  
      return response.json();
    },
  
    resetPassword: async (email: string) => {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Ошибка сброса пароля');
      }
  
      return response.json();
    }
  };