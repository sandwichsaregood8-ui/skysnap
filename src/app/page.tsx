"use client";

import { BackgroundGradient } from '@/components/background-gradient';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function Home() {
  return (
    <div className="min-h-screen w-full relative">
      <BackgroundGradient />
      <main className="w-full h-screen flex items-center justify-center px-6 relative z-10">
        <SignInForm />
      </main>
    </div>
  );
}
