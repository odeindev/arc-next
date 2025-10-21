// ============================================
// features/auth/model/types.ts
// ============================================
export interface LoginFormData {
    email: string;
    password: string;
  }
  
  export interface RegistrationFormData {
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface VerificationFormData {
    code: string;
  }
  
  export interface PasswordResetFormData {
    email: string;
  }