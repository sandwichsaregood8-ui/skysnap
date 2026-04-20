"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";

export default function ConfigureWifiPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

        try {
            const response = await fetch('http://192.168.4.1/configure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ssid, password }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                router.push('/dashboard/connect/success');
            } else {
                setError("Could not reach SkySnap Node — make sure you're connected to SkySnap-Setup WiFi");
            }
        } catch (err) {
            clearTimeout(timeoutId);
            setError("Could not reach SkySnap Node — make sure you're connected to SkySnap-Setup WiFi");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleRetry = () => {
        setError(null);
    }

    return (
        <div className="sine-bg min-h-screen flex flex-col items-center justify-center p-6 relative">
            <div className="card w-full max-w-md z-10">
                <div className="card__border"></div>
                <div className="card_title__container">
                    <span className="card_title">Configure Wi-Fi</span>
                    <p className="card_paragraph">
                        Step 2 of 2
                    </p>
                </div>
                <hr className="line" />
                
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <label className="block text-on-surface font-label text-xs tracking-[0.08em] uppercase font-bold px-1" htmlFor="ssid">
                            Wi-Fi Network Name (SSID)
                        </label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface group-focus-within:text-primary transition-colors">router</span>
                            <input 
                                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                                id="ssid" 
                                placeholder="Enter network name" 
                                type="text" 
                                value={ssid}
                                onChange={(e) => setSsid(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <p className="text-[10px] text-on-surface-variant/60 font-medium px-1">Case Sensitive</p>
                    </div>
                    
                    <div className="space-y-3">
                        <label className="block text-on-surface font-label text-xs tracking-[0.08em] uppercase font-bold px-1" htmlFor="password">
                            Wi-Fi Password
                        </label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface group-focus-within:text-primary transition-colors">lock</span>
                            <input 
                                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl py-4 pl-12 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                                id="password" 
                                placeholder="••••••••" 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" disabled={isLoading}>
                                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                        <p className="text-[10px] text-on-surface-variant/60 font-medium px-1">Case Sensitive</p>
                    </div>

                    {error && (
                        <div className="bg-destructive/20 border border-destructive/50 text-white p-4 rounded-xl text-center space-y-3">
                            <p className="text-sm">{error}</p>
                            <button
                                type="button"
                                onClick={handleRetry}
                                className="bg-destructive/50 hover:bg-destructive/70 text-white font-bold py-2 px-4 rounded-lg transition-colors text-xs uppercase tracking-wider"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    <div className="pt-4 flex flex-col gap-6 items-center">
                        <button 
                            type="submit"
                            className="button bg-surface-container-high !text-on-surface"
                            disabled={isLoading || !ssid}
                        >
                            {isLoading ? (
                                <div className='flex items-center justify-center'>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Connecting...
                                </div>
                            ) : (
                               "Done"
                            )}
                        </button>
                        <a className={"text-on-surface-variant hover:text-primary font-label text-[10px] tracking-[0.08em] uppercase font-bold transition-colors " + (isLoading ? "pointer-events-none opacity-50" : "")} href="#" onClick={(e) => {e.preventDefault(); if(!isLoading) router.back()}}>
                            Cancel Setup
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
