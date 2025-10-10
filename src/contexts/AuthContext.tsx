import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing session
        const storedUser = localStorage.getItem('siteforge_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('siteforge_user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const userData: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('siteforge_user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const userData: User = {
        id: '1',
        email,
        name,
        createdAt: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('siteforge_user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem('siteforge_user');
      localStorage.removeItem('isAuthenticated');
      sessionStorage.clear();
      
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, this would send reset email
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error('Failed to send reset email. Please try again.');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('siteforge_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
