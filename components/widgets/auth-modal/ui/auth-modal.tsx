//components/widgets/auth-modal/ui/auth-modal.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/shared';
import {
  LoginForm,
  RegistrationForm,
  PasswordResetForm,
  VerificationForm
} from '@/components/features/auth';

interface AuthModalProps {
  isOpen: boolean;
  view: 'login' | 'register' | 'reset' | 'verify';
  verificationData: {
    email: string;
    password: string;
    devCode?: string;
  } | null;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSwitchToRegister: () => void;
  onSwitchToReset: () => void;
  onSwitchToVerification: (data: {
    email: string;
    password: string;
    devCode?: string;
  }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  view,
  verificationData,
  onClose,
  onSwitchToReset,
  onSwitchToVerification
}) => {
  const router = useRouter();

  const handleLoginSuccess = () => {
    onClose();
    router.push('/account');
    router.refresh();
  };

  const handleRegistrationSuccess = (data: { 
    email: string; 
    password: string;
    devCode?: string;
  }) => {
    onSwitchToVerification(data);
  };

  const handleVerificationSuccess = () => {
    onClose();
    router.push('/account');
    router.refresh();
  };

  const handleResetSuccess = () => {
    onClose();
  };

  const getTitle = () => {
    switch (view) {
      case 'login': return 'Войдите в свой аккаунт';
      case 'register': return 'Регистрация аккаунта';
      case 'reset': return 'Восстановление пароля';
      case 'verify': return 'Подтверждение email';
      default: return '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      {view === 'login' && (
        <LoginForm
          onSuccess={handleLoginSuccess}
          onForgotPassword={onSwitchToReset}
        />
      )}
      
      {view === 'register' && (
        <RegistrationForm onSuccess={handleRegistrationSuccess} />
      )}
      
      {view === 'reset' && (
        <PasswordResetForm onSuccess={handleResetSuccess} />
      )}
      
      {view === 'verify' && verificationData && (
        <VerificationForm
          email={verificationData.email}
          password={verificationData.password}
          initialCode={verificationData.devCode}
          onSuccess={handleVerificationSuccess}
        />
      )}
    </Modal>
  );
};