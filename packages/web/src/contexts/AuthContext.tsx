'use client';

import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { id: string; name: string; email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state from cookie on mount
    const loggedIn = Cookies.get('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      // In a real app, you'd fetch user details from an API
      // Placeholder user, ensure it matches the User type
      setUser({ id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' });
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('https://api.storyblok-ai.example/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        setUser(data.user);
        Cookies.set('isLoggedIn', 'true', { expires: 7 });
        Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
        Cookies.set('token', data.token, { expires: 7 }); // Store JWT token
        if (data.refresh_token) {
          Cookies.set('refresh_token', data.refresh_token, { expires: 7 }); // Store refresh token
        }
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Network error');
    }
  };

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    Cookies.remove('isLoggedIn'); // Remove cookie
    router.push('/login');
  }, [router]);

  const value = useMemo(
    () => ({ isLoggedIn, user, login, logout }),
    [isLoggedIn, user, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
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
