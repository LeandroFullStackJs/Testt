import React, { createContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import mockUsers from '../data/mockUsers';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inicializa la lista de usuarios en localStorage si no existe
    const storedUsers = localStorage.getItem('fleteshare_users');
    if (!storedUsers) {
      localStorage.setItem('fleteshare_users', JSON.stringify(mockUsers));
    }
    // Check if user is logged in
    const storedUser = localStorage.getItem('fleteshare_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Buscar en usuarios guardados
      const storedUsers = JSON.parse(localStorage.getItem('fleteshare_users') || '[]');
      const matchedUser = storedUsers.find((u: any) => u.email === email);
      if (!matchedUser) {
        throw new Error('Usuario no encontrado');
      }
      setUser(matchedUser);
      localStorage.setItem('fleteshare_user', JSON.stringify(matchedUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const storedUsers = JSON.parse(localStorage.getItem('fleteshare_users') || '[]');
      // Evitar duplicados
      if (storedUsers.some((u: any) => u.email === email)) {
        throw new Error('El email ya está registrado');
      }
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone: '',
        role,
        rating: 0,
        ratingsCount: 0,
        createdAt: new Date().toISOString(),
      };
      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem('fleteshare_users', JSON.stringify(updatedUsers));
      setUser(newUser);
      localStorage.setItem('fleteshare_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fleteshare_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};