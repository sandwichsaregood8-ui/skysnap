'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  User,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithCredential,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useGoogleOneTapLogin } from '@react-oauth/google';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  googleSignIn: () => Promise<void>;
  emailSignUp: (name: string, email: string, password: string) => Promise<void>;
  emailSignIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const OneTapHandler = () => {
  const { toast } = useToast();
  const { auth, firestore } = initializeFirebase();
  const router = useRouter();
  const pathname = usePathname();

  const handleUserInFirestore = async (user: User) => {
    const userRef = doc(firestore, `userProfiles/${user.uid}`);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        createdAt: serverTimestamp(),
        lastSignedInAt: serverTimestamp(),
      });
    } else {
      await setDoc(userRef, { lastSignedInAt: serverTimestamp() }, { merge: true });
    }
  };

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      if (!credentialResponse.credential) {
        throw new Error('One Tap sign-in failed: no credential returned.');
      }
      try {
        const googleCredential = GoogleAuthProvider.credential(credentialResponse.credential);
        const result = await signInWithCredential(auth, googleCredential);
        await handleUserInFirestore(result.user);
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Google One Tap Sign-In Error:', error);
        toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: 'Please try again.' });
      }
    },
    onError: () => {
      console.error('Google One Tap login failed.');
      toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: 'An error occurred during One Tap sign-in.' });
    },
    disabled: pathname !== '/login',
  });

  return null;
};


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
  
  // This function is now a placeholder as One Tap is automatic.
  // The button on the login page will call this, but the primary sign-in
  // method is the automatic One Tap prompt.
  const googleSignIn = async () => {
    console.log("The 'Sign in with Google' button was clicked, but Google One Tap is the primary sign-in method and appears automatically.");
    toast({
      title: "Google Sign-In",
      description: "Please use the automatic Google One Tap prompt to sign in.",
    });
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

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
      {!user && <OneTapHandler />}
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
