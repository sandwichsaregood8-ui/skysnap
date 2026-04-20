"use client";

import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Check, ArrowRight, Cloud, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { 
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getAdditionalUserInfo
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" {...props}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
    </svg>
);


export function SignInForm() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Start true to check for redirect
    const { toast } = useToast();
    const auth = useAuth();
    const firestore = useFirestore();

    useEffect(() => {
        if (!auth || !firestore) {
            setIsLoading(false);
            return;
        };

        const processRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    // User signed in via redirect.
                    const user = result.user;
                    const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
                    const userRef = doc(firestore, `userProfiles/${user.uid}`);
                    
                    await setDoc(userRef, {
                        id: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        lastSignedInAt: serverTimestamp(),
                        ...(isNewUser && { createdAt: serverTimestamp() })
                    }, { merge: true });
                    
                    toast({
                        title: isNewUser ? "Account Created!" : "Signed In Successfully!",
                        description: `Welcome, ${user.displayName}!`,
                    });
                    // The redirect to /dashboard is handled by page.tsx
                }
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Google Sign-In Failed",
                    description: error.message || "An unexpected error occurred.",
                });
            } finally {
                setIsLoading(false);
            }
        };

        processRedirectResult();
    }, [auth, firestore, toast]);

    const handleGoogleSignIn = async () => {
        if (!auth) return;
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth || !firestore) return;

        setIsLoading(true);
        if (isSignUp) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const userRef = doc(firestore, `userProfiles/${user.uid}`);
                
                await setDoc(userRef, {
                    id: user.uid,
                    displayName: name,
                    email: email,
                    createdAt: serverTimestamp(),
                    lastSignedInAt: serverTimestamp()
                });

                toast({
                    title: "Account Created!",
                    description: "You have been signed in.",
                });
                // No router.push, page.tsx will handle the redirect.
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    title: "Sign Up Failed",
                    description: error.message,
                });
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                // On success, onAuthStateChanged will fire and page.tsx will redirect.
                if (auth.currentUser) {
                    const userRef = doc(firestore, `userProfiles/${auth.currentUser.uid}`);
                    await setDoc(userRef, {
                        lastSignedInAt: serverTimestamp()
                    }, { merge: true });
                }

            } catch (error: any) {
                let description = "An unexpected error occurred.";
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    description = "Account not found or password incorrect. Please create an account to sign in.";
                } else {
                    description = error.message;
                }
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: description,
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="w-full max-w-sm relative">
            <div className="glass-card chromatic-border rounded-[2rem] p-10 ambient-glow">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg flex-shrink-0">
                            <Cloud className="text-white text-xl" fill="white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold tracking-tight bg-gradient-to-br from-primary via-on-surface to-secondary bg-clip-text text-transparent font-headline">SkySnap</span>
                                <span className="text-on-surface-variant/30 text-xs">|</span>
                                <h2 className="text-xl font-semibold text-on-surface">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
                            </div>
                            <p className="text-xs text-on-surface-variant mt-0.5">{isSignUp ? 'Create a new account.' : 'welcome back.'}</p>
                        </div>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        {isSignUp && (
                             <div className="space-y-2 group">
                                <Label className="text-xs font-medium text-on-surface-variant/70 ml-1" htmlFor="name">Name</Label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-lg" />
                                    <Input 
                                        className="w-full bg-surface-container-lowest/30 border-0 rounded-xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline-variant/40 focus:ring-0 focus:outline-none transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0" 
                                        id="name" 
                                        placeholder="Jane Doe" 
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} 
                                        disabled={isLoading} />
                                </div>
                            </div>
                        )}
                        <div className="space-y-2 group">
                            <Label className="text-xs font-medium text-on-surface-variant/70 ml-1" htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-lg" />
                                <Input 
                                    className="w-full bg-surface-container-lowest/30 border-0 rounded-xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline-variant/40 focus:ring-0 focus:outline-none transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0" 
                                    id="email" 
                                    placeholder="name@company.com" 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading} />
                            </div>
                        </div>
                        <div className="space-y-2 group">
                            <Label className="text-xs font-medium text-on-surface-variant/70 ml-1" htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors text-lg" />
                                <Input 
                                    className="w-full bg-surface-container-lowest/30 border-0 rounded-xl py-3.5 pl-12 pr-12 text-on-surface placeholder:text-outline-variant/40 focus:ring-0 focus:outline-none transition-all duration-300 focus-visible:ring-0 focus-visible:ring-offset-0" 
                                    id="password" 
                                    placeholder="••••••••" 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading} />
                                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors h-auto w-auto p-1 hover:bg-transparent" type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {!isSignUp && (
                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                               <div className="relative flex items-center justify-center w-4 h-4 rounded border border-outline-variant/30 bg-surface-container-lowest group-hover:border-primary/50 transition-colors">
                                    <input className="sr-only peer" type="checkbox" id="keep-signed-in" />
                                    <Check className="h-3 w-3 text-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-xs text-on-surface-variant/80">Keep me signed in</span>
                            </label>
                            <a className="text-xs text-primary/80 hover:text-primary transition-colors font-medium" href="#">Forgot password?</a>
                        </div>
                    )}
                    
                    <Button type="submit" className="w-full group rounded-xl bg-primary-container text-white py-4 h-auto font-semibold tracking-wide hover:bg-primary-container/90 transition-all duration-300 shadow-lg shadow-primary-container/20 flex items-center justify-center gap-2" disabled={isLoading}>
                        {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        {!isLoading && <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />}
                    </Button>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-outline-variant/10"></div>
                        <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-on-surface-variant/40">or</span>
                        <div className="flex-grow border-t border-outline-variant/10"></div>
                    </div>
                    
                    <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-3 px-4 py-3.5 h-auto rounded-xl border-outline-variant/20 bg-surface-container-lowest/30 hover:bg-surface-container-lowest/50 transition-all duration-300 group" onClick={handleGoogleSignIn} disabled={isLoading}>
                        <GoogleIcon />
                        <span className="text-sm font-medium text-on-surface">Sign in with Google</span>
                    </Button>
                </form>

                <div className="mt-10 pt-6 border-t border-outline-variant/10 text-center">
                     <p className="text-sm text-on-surface-variant/70">
                        {isSignUp ? 'Already have an account?' : 'New here?'}
                        <button 
                            type="button" 
                            onClick={() => setIsSignUp(!isSignUp)} 
                            className="text-primary hover:underline font-medium ml-1 bg-transparent border-none p-0"
                            disabled={isLoading}
                        >
                            {isSignUp ? 'Sign In' : 'Create Account'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
