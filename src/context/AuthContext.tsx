"use client";
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import { adminApi } from '../api/adminApi';
import { useRouter } from 'next/navigation';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* 🔄 Restore session on refresh and verify token */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        const userData = sessionStorage.getItem('userData');

        if (token && userData) {
          // Verify token with backend
          try {
            await adminApi.verifyToken();
            // Token is valid, restore user
            setUser(JSON.parse(userData));
          } catch (error) {
  sessionStorage.clear();
  setUser(null);
  // ❌ no redirect here
}

        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        sessionStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  
  /* 🔐 LOGIN */
const login = async (email: string, password: string) => {
  const response = await adminApi.login(email, password);

  if (!response.success || !response.data?.token) {
    throw new Error('Invalid credentials');
  }

  const user: AuthUser = {
    id: response.data.userId,
    name: response.data.name,
    email: response.data.email,
    role: response.data.role || 'USER',
  };

  sessionStorage.setItem('authToken', response.data.token);
  sessionStorage.setItem('userData', JSON.stringify(user));

  setUser(user);
};


  /* 🚪 LOGOUT */
  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    message.success('Logged out successfully');
    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
