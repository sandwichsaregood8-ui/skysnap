'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '@/firebase/config';
import { useToast } from '@/hooks/use-toast';

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  googleSignIn: () => void;
  sendMagicLink: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that wraps the application to provide auth state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Effect hook to handle authentication state changes and magic link sign-in
  useEffect(() => {
    // This listener from Firebase handles user state changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // This part handles the magic link sign-in completion
    const handleMagicLinkSignIn = async () => {
      // Check if the current URL is a sign-in link
      if (isSignInWithEmailLink(auth, window.location.href)) {
        setLoading(true);
        // Get the user's email from local storage (set when the link was sent)
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // If email is not in local storage, prompt the user for it as a fallback
          email = window.prompt('Please provide your email for confirmation');
        }

        if (email) {
          try {
            // Sign in the user with the email and the magic link
            await signInWithEmailLink(auth, email, window.location.href);
            // Clean up by removing the stored email from local storage
            window.localStorage.removeItem('emailForSignIn');
            router.push('/dashboard');
          } catch (error: any) {
            console.error("Magic Link Sign-In Error:", error);
            toast({
              title: "Sign-in Error",
              description: "Failed to sign in with magic link. Please try again.",
              variant: "destructive",
            });
          }
        }
        setLoading(false);
      }
    };

    handleMagicLinkSignIn();

    // Cleanup the auth state listener when the component unmounts
    return () => unsubscribe();
  }, [router, toast]);

  // Function to sign in with Google using a popup
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    signInWithPopup(auth, provider)
      .then(() => {
        // On successful sign-in, redirect to the dashboard
        router.push('/dashboard');
      })
      .catch((error: any) => {
        console.error("Google Sign-In Error:", error);
        let description = error.message;
        if (error.code === 'auth/popup-blocked') {
          description = "Popup was blocked by the browser. Please allow popups for this site and try again.";
        } else if (error.code === 'auth/popup-closed-by-user') {
          description = "Sign-in was cancelled. Please try again.";
        }
        toast({
          title: "Sign-in Error",
          description: description,
          variant: "destructive",
        });
      })
      .finally(() => {
        // Set loading to false on failure to re-enable UI
        setLoading(false);
      });
  };
  
  // Function to send a magic sign-in link to the user's email
  const sendMagicLink = async (email: string) => {
    setLoading(true);
    // Configuration for the magic link
    const actionCodeSettings = {
      // URL to redirect back to after sign-in from email.
      url: window.location.origin + '/login',
      handleCodeInApp: true, // This must be true for web apps
    };

    try {
      // Send the sign-in link via email
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // Store the email in local storage to use upon return
      window.localStorage.setItem('emailForSignIn', email);
      toast({
        title: "Check your email",
        description: `A sign-in link has been sent to ${email}.`,
      });
    } catch (error: any) {
      console.error("Send Magic Link Error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to log the user out
  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    // After signing out, redirect to the login page for security
    router.push('/login');
  };
  
  // The value provided to the context consumers (the rest of the app)
  const value = {
    user,
    loading,
    googleSignIn,
    sendMagicLink,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
