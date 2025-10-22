import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulación de usuarios del sistema
    const users: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@eame.mil.bo',
        role: 'administrador',
        nombre_completo: 'Administrador del Sistema',
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '2',
        username: 'jefe_eval',
        email: 'jefe.evaluaciones@eame.mil.bo',
        role: 'jefe_evaluaciones',
        nombre_completo: 'Jefe de Evaluaciones',
        activo: true,
        creado_en: new Date().toISOString()
      },
      {
        id: '3',
        username: 'comandante',
        email: 'comandante@eame.mil.bo',
        role: 'comandante',
        nombre_completo: 'Comandante EAME',
        activo: true,
        creado_en: new Date().toISOString()
      }
    ];

    const foundUser = users.find(u => u.email === email);
    
    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};