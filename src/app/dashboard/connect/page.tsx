"use client";

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AddDevicePage() {
    const router = useRouter();
    const { toast } = useToast();

    return (
        <div className="sine-bg min-h-screen flex flex-col items-center justify-center p-6 relative">
             <header className="fixed top-0 left-0 w-full z-50">
                <div className="flex items-center justify-start px-6 h-20 w-full max-w-md mx-auto">
                    <button onClick={() => router.back()} className="hover:bg-primary/10 transition-colors active:scale-95 duration-200 p-2 rounded-full">
                        <span className="material-symbols-outlined text-primary">arrow_back</span>
                    </button>
                </div>
            </header>

            <main className="w-full max-w-md z-10">
                <div className="flex flex-col items-center text-center px-4">
                    <p className="text-on-surface-variant font-label text-xs tracking-[0.08em] uppercase font-bold mb-4">
                        Step 1 of 2
                    </p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-3 leading-tight">
                        Connect to SkySnap Node
                    </h1>
                    <p className="text-on-surface-variant/70 body-md leading-relaxed max-w-sm">
                        Follow the steps below to connect your device
                    </p>
                </div>

                <div className="my-10 space-y-5 px-2">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary/20 bg-surface-container text-primary font-bold text-sm">1</div>
                        <p className="text-on-surface-variant pt-1">Plug in your SkySnap Node and wait for the LED to pulse slowly.</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary/20 bg-surface-container text-primary font-bold text-sm">2</div>
                        <p className="text-on-surface-variant pt-1">Open your phone or computer WiFi settings.</p>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary/20 bg-surface-container text-primary font-bold text-sm">3</div>
                        <p className="text-on-surface-variant pt-1">Connect to the network named <span className="font-bold text-on-surface">SkySnap-Setup</span>.</p>
                    </div>
                </div>

                <div className="my-8 flex justify-center">
                    <span className="material-symbols-outlined text-6xl text-primary/30">wifi</span>
                </div>

                <div className="flex flex-col gap-6 items-center">
                    <button onClick={() => router.push('/dashboard/connect/configure')} className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-extrabold py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)] active:scale-[0.98] transition-all uppercase tracking-wider text-sm">
                        I'm Connected to SkySnap-Setup
                    </button>
                    <button onClick={() => router.back()} className="text-on-surface-variant hover:text-primary font-label text-[10px] tracking-[0.08em] uppercase font-bold transition-colors">
                        Cancel Setup
                    </button>
                </div>
            </main>
        </div>
    );
}
