"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function ConnectionSuccessPage() {
    const router = useRouter();

    return (
        <div className="sine-bg min-h-screen flex flex-col items-center justify-center p-6 relative text-on-surface">
            <div className="w-full max-w-md text-center">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                        <CheckCircle2 className="relative text-primary h-24 w-24" strokeWidth={1.5} />
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3 leading-tight">
                    Connection Successful!
                </h1>
                <p className="text-on-surface-variant/70 body-md leading-relaxed max-w-sm mx-auto mb-10">
                    Your SkySnap Node has been successfully configured and is now connected to your Wi-Fi network.
                </p>

                <div className="flex flex-col gap-4 items-center">
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-extrabold py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)] active:scale-[0.98] transition-all uppercase tracking-wider text-sm"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/connect')}
                        className="text-on-surface-variant hover:text-primary font-label text-[10px] tracking-[0.08em] uppercase font-bold transition-colors"
                    >
                        Add Another Device
                    </button>
                </div>
            </div>
        </div>
    );
}
