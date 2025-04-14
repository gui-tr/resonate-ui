import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { User, AuthResponse } from '../types/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  registrationStatus: 'pending' | 'verified' | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userType: 'artist' | 'fan', bio?: string) => Promise<void>;
  logout: () => void;
  resendVerificationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<'pending' | 'verified' | null>(null);

  useEffect(() => {
    // Check for existing token and validate it
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Implement token validation
      // For now, we'll just check if the token exists
      const userType = localStorage.getItem('userType');
      const userId = localStorage.getItem('userId');
      if (userType && userId) {
        setUser({
          userId,
          email: '', // We don't store email in localStorage for security
          userType: userType as 'artist' | 'fan'
        });
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('Attempting login...');
      const response = await apiService.login(email, password);
      console.log('Login response:', response);
      
      // Check if email is verified
      if (!response.emailVerified) {
        setError('Please verify your email before logging in');
        setRegistrationStatus('pending');
        throw new Error('Email not verified');
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      if (response.userType) {
        localStorage.setItem('userType', response.userType);
      }
      setUser({
        userId: response.userId,
        email,
        userType: response.userType || 'fan'
      });
      setRegistrationStatus('verified');
      console.log('Login successful, token stored:', localStorage.getItem('token'));
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    }
  };

  const register = async (email: string, password: string, userType: 'artist' | 'fan', bio?: string) => {
    try {
      setError(null);
      const response = await apiService.register(email, password, userType, bio);
      setRegistrationStatus('pending');
      // Don't automatically log in after registration
      setError('Please check your email to verify your account before logging in');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      throw err;
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      setError(null);
      await apiService.resendVerificationEmail(email);
      setError('Verification email has been resent. Please check your inbox.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    setUser(null);
    setRegistrationStatus(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      error, 
      registrationStatus,
      login, 
      register, 
      logout,
      resendVerificationEmail 
    }}>
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