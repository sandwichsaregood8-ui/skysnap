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
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
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

  const handleUserInFirestore = async (user: User, details?: { name?: string }) => {
    const userRef = doc(firestore, `userProfiles/${user.uid}`);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // It's a new user, create the document
      const data = {
        id: user.uid,
        email: user.email,
        displayName: details?.name || user.displayName,
        createdAt: serverTimestamp(),
        lastSignedInAt: serverTimestamp(),
      };
      await setDoc(userRef, data);
    } else {
      // It's an existing user, just update the sign-in time
      await setDoc(userRef, { lastSignedInAt: serverTimestamp() }, { merge: true });
    }
  };
  
  const googleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error("Google Sign-In Error: ", error);
      toast({ variant: "destructive", title: "Google Sign-In Failed", description: "Please try again." });
      setLoading(false);
    }
  };

  const emailSignUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await handleUserInFirestore(result.user, { name });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Email Sign-Up Error: ", error);
      toast({ variant: "destructive", title: "Account Creation Failed", description: error.message || "An account with this email may already exist." });
    } finally {
        setLoading(false);
    }
  };
  
  const emailSignIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await handleUserInFirestore(result.user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Email Sign-In Error: ", error);
      toast({ variant: "destructive", title: "Sign-in Failed", description: error.message || "Please check your credentials and try again." });
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  useEffect(() => {
  let redirectHandled = false;

  const handleRedirect = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        redirectHandled = true;
        await handleUserInFirestore(result.user);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Redirect result error:', error);
    }
  };

  handleRedirect().then(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!redirectHandled) {
        setUser(currentUser);
        setLoading(false);
        if (currentUser) {
          router.push('/dashboard');
        }
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  });
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
