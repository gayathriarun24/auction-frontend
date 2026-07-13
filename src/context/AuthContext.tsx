import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  contactInfo: string;
  role: 'buyer' | 'seller';
  sellerRating?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (name: string, email: string, password: string, contactInfo: string, role: 'buyer' | 'seller') => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          // Targets your precise profile controller router route
          const res = await api.get('/auth/profile');
          setUser(res.data);
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const register = async (name: string, email: string, password: string, contactInfo: string, role: 'buyer' | 'seller') => {
    const res = await api.post('/auth/register', { name, email, password, contactInfo, role });
    const { token: newToken, ...userData } = res.data;
    
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData as User);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, ...userData } = res.data;
    
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData as User);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};