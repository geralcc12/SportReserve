import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useApi } from '../hooks/useApi';
import { API_BASE_URL } from '@/config/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { request } = useApi<{ user: any; token: string }>();

  useEffect(() => {
    // Simular verificación de sesión
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simular login
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user'
    };
    const result:any = await request(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(mockUser);
    localStorage.setItem('token', result?.token);
    localStorage.setItem('userApi', JSON.stringify(result));
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (name: string, email: string, password: string) => {
    // Simular registro
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user'
    };
    const result:any = await request(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    setUser(mockUser);
    localStorage.setItem('token', result?.token);
    localStorage.setItem('userApi', JSON.stringify(result));
    localStorage.setItem('user', JSON.stringify(mockUser));
  };
  const getAuth=()=>{
    return localStorage.getItem('userApi') || null;
  }
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 