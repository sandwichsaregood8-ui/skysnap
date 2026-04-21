'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Mock User type, so we don't have to import from firebase
type User = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  googleSignIn: () => Promise<void>;
  emailSignUp: (name: string, email: string, password: string) => Promise<void>;
  emailSignIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Start with no user to allow visiting login page first.
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
     setUser({
        uid: 'mock-user',
        displayName: 'Test User',
        email: 'test@example.com',
        photoURL: null
    });
    router.push('/dashboard');
  }

  const googleSignIn = async () => {
    console.log("Google Sign In clicked");
    handleLogin();
  };

  const emailSignUp = async (name: string, email: string, password: string) => {
    console.log("Email Sign up clicked");
    handleLogin();
  };
  
  const emailSignIn = async (email: string, password: string) => {
    console.log("Email Sign in clicked");
    handleLogin();
  };

  const logout = async () => {
    setUser(null);
    router.push('/login');
  };
  
  const value = {
    user,
    loading,
    googleSignIn,
    emailSignUp,
    emailSignIn,
    logout,
  };

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
