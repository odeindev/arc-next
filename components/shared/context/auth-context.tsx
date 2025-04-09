// @context/auth-context.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  tempPassword: string | null;
  setTempPassword: (password: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ tempPassword, setTempPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};