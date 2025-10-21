//components/widgets/auth-modal/model/use-auth-modal.ts

import { useState } from 'react';

type AuthView = 'login' | 'register' | 'reset' | 'verify';

interface VerificationData {
  email: string;
  password: string;
  devCode?: string;
}

export const useAuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>('login');
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);

  const open = (initialView: AuthView = 'login') => {
    setView(initialView);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTimeout(() => {
      setView('login');
      setVerificationData(null);
    }, 300);
  };

  const switchToLogin = () => setView('login');
  const switchToRegister = () => setView('register');
  const switchToReset = () => setView('reset');
  
  const switchToVerification = (data: VerificationData) => {
    setVerificationData(data);
    setView('verify');
  };

  return {
    isOpen,
    view,
    verificationData,
    open,
    close,
    switchToLogin,
    switchToRegister,
    switchToReset,
    switchToVerification
  };
};