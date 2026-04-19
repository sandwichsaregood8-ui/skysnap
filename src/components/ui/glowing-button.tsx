"use client";

import { cn } from '@/lib/utils';
import React from 'react';

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function GlowingButton({ children, className, ...props }: GlowingButtonProps) {
    return (
        <button
            className={cn(
                "group relative w-full h-[48px] flex items-center justify-center rounded-full p-[1.5px] transition-transform active:scale-95 duration-200 overflow-hidden",
                className
            )}
            {...props}
        >
            {/* The rotating gradient for the border */}
            <div className="absolute inset-[-200%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(120,110,255,0.2)_0%,rgba(255,255,255,0.8)_50%,rgba(120,110,255,0.2)_100%)]" />

            {/* The inner part of the button, masking the center of the gradient */}
            <div
                className="relative w-full h-full rounded-full bg-[#211E33] overflow-hidden flex items-center justify-center"
            >
                <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,110,255,0.4)_0%,transparent_70%)]"
                ></div>
                <div
                    className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"
                ></div>
                <div
                    className="absolute inset-0 rounded-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.1),inset_0_-2px_10px_rgba(0,0,0,0.5)]"
                ></div>
                <span
                    className="relative z-10 text-white font-medium text-[16px] tracking-tight opacity-90 group-hover:opacity-100 transition-opacity"
                >
                    {children}
                </span>
            </div>
        </button>
    );
}
