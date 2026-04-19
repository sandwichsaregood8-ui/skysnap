"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function ConfigureWifiPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="sine-bg min-h-screen flex flex-col items-center justify-center p-6 relative">
            <div className="filament-border w-full max-w-md z-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="glass-card rounded-[1.4rem] p-8 md:p-10 flex flex-col">
                    <header className="mb-10 text-center">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-[-0.04em] text-on-surface mb-2 font-headline uppercase">
                            Configure&nbsp;&nbsp;&nbsp;Wi-Fi
                        </h1>
                        <p className="text-on-surface-variant font-label text-xs tracking-[0.08em] uppercase font-bold">
                            Step 2 of 2
                        </p>
                    </header>
                    
                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-3">
                            <label className="block text-on-surface font-label text-xs tracking-[0.08em] uppercase font-bold px-1" htmlFor="ssid">
                                Wi-Fi Network Name (SSID)
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface group-focus-within:text-primary transition-colors">router</span>
                                <input className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" id="ssid" placeholder="Enter network name" type="text" />
                            </div>
                            <p className="text-[10px] text-on-surface-variant/60 font-medium px-1">Case Sensitive</p>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="block text-on-surface font-label text-xs tracking-[0.08em] uppercase font-bold px-1" htmlFor="password">
                                Wi-Fi Password
                            </label>
                            <div className="relative group">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface group-focus-within:text-primary transition-colors">lock</span>
                                <input className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" id="password" placeholder="••••••••" type={showPassword ? "text" : "password"} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                            <p className="text-[10px] text-on-surface-variant/60 font-medium px-1">Case Sensitive</p>
                        </div>

                        <div className="pt-4 flex flex-col gap-6 items-center">
                            <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-extrabold py-4 rounded-xl shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)] active:scale-[0.98] transition-all uppercase tracking-wider text-sm">
                                Done
                            </button>
                            <a className="text-on-surface-variant hover:text-primary font-label text-[10px] tracking-[0.08em] uppercase font-bold transition-colors" href="#" onClick={(e) => {e.preventDefault(); router.back()}}>
                                Cancel Setup
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
