'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: 'parent' | 'school' | 'admin';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isParent: boolean;
  isSchool: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      // Decode JWT to get user info (simple decode, not verification)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Note: In real app, you'd validate the token with the backend
        // For now, we'll just trust the stored token
        setUser({
          id: payload.sub || 'unknown',
          email: payload.sub || 'unknown',
          role: 'parent', // Default role, should come from backend
          created_at: new Date().toISOString(),
        });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      
      // Decode token to get user info
      const payload = JSON.parse(atob(access_token.split('.')[1]));
      
      // Note: In a real app, you'd call an endpoint to get full user data
      // For now, we'll create a user object from the token
      const userData: User = {
        id: payload.sub || 'unknown',
        email: email,
        role: 'parent', // Default, should come from backend
        created_at: new Date().toISOString(),
      };
      
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  };

  const register = async (email: string, password: string, role: string) => {
    try {
      await authAPI.register({ email, password, role });
      // After registration, automatically log in
      await login(email, password);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isParent = user?.role === 'parent';
  const isSchool = user?.role === 'school';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isParent,
        isSchool,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}