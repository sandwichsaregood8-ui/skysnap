"use client";

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BackgroundGradient } from '@/components/background-gradient';
import { SignInForm } from '@/components/auth/sign-in-form';
import { Camera } from 'lucide-react';


export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If done loading and user exists, redirect
    if (!isUserLoading && user) {
        router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  // While loading or if user exists (and redirect is in progress), show a loading screen.
  if (isUserLoading || user) {
    return (
        <div className="min-h-screen w-full relative">
            <BackgroundGradient />
            <div className="w-full h-screen flex items-center justify-center px-6 relative z-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg animate-pulse">
                        <Camera className="text-white" />
                    </div>
                    <p className="text-on-surface-variant">Loading...</p>
                </div>
            </div>
        </div>
    );
  }

  // If not loading and no user, show the sign-in form.
  return (
    <div className="min-h-screen w-full relative">
      <BackgroundGradient />
      <main className="w-full h-screen flex items-center justify-center px-6 relative z-10">
        <SignInForm />
      </main>
    </div>
  );
}
