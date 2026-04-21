'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';

// This is the sign-up page. Since we use passwordless authentication (Google and Magic Link),
// this page is very similar to the login page. It provides the same two methods for
// creating an account or signing in.
export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const { googleSignIn, sendMagicLink, user, loading } = useAuth();
  const router = useRouter();

  // Effect to redirect if the user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Handler for Magic Link form submission
  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await sendMagicLink(email);
  };

  // Handler for Google Sign-In button
  const handleGoogleSignIn = () => {
    googleSignIn();
  };

  // While loading, show a simple loading indicator
  if (loading && !user) {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg animate-pulse">
                    <Camera className="text-white" />
                </div>
                <p className="text-on-surface-variant">Loading...</p>
            </div>
        </div>
    );
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8 rounded-lg bg-card p-8 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-foreground">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter your email to receive a magic link, or use Google.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleMagicLinkSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              disabled={loading}
            />
          </div>
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
            {loading ? 'Redirecting...' : 'Sign up with Google'}
          </Button>
        </div>
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
