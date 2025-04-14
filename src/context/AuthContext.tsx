import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { apiService } from '../services/api';
import { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userType: 'artist' | 'fan', bio?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Try to load user from localStorage on initial render
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    const userData = {
      userId: response.userId,
      email,
      userType: response.userType || 'fan'
    };
    setUser(userData);
  };

  const register = async (email: string, password: string, userType: 'artist' | 'fan', bio?: string) => {
    const response = await apiService.register(email, password, userType, bio);
    const userData = {
      userId: response.userId,
      email,
      userType: response.userType || userType,
      bio
    };
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 