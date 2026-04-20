// SIGNIN FILE
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { auth, firestore } = initializeFirebase();
  const { toast } = useToast();

  const handleUserInFirestore = async (user: User, details?: { name?: string, isNewUser?: boolean }) => {
    const userRef = doc(firestore, `userProfiles/${user.uid}`);
    const data = {
      id: user.uid,
      email: user.email,
      displayName: details?.name || user.displayName,
      lastSignedInAt: serverTimestamp(),
      ...(details?.isNewUser && { createdAt: serverTimestamp() })
    };
    await setDoc(userRef, data, { merge: true });
  };
  
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleUserInFirestore(result.user, { isNewUser: true });
      router.push('/dashboard');
    } catch (error) {
      console.error("Google Sign-In Error: ", error);
      toast({ variant: "destructive", title: "Google Sign-In Failed", description: "Please try again." });
    }
  };

  const emailSignUp = async (name: string, email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await handleUserInFirestore(result.user, { name, isNewUser: true });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Email Sign-Up Error: ", error);
      toast({ variant: "destructive", title: "Account Creation Failed", description: error.message || "An account with this email may already exist." });
    }
  };
  
  const emailSignIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle user state, but we push for immediate navigation
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Email Sign-In Error: ", error);
      toast({ variant: "destructive", title: "Sign-in Failed", description: error.message || "Please check your credentials and try again." });
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const value = {
    user,
    loading,
    googleSignIn,
    emailSignUp,
    emailSignIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
