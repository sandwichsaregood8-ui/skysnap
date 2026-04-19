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
                "group relative w-full h-[48px] flex items-center justify-center rounded-full transition-transform active:scale-95 duration-200 overflow-hidden",
                className
            )}
            {...props}
        >
            {/* The rotating gradient background, now inside the button */}
            <div className="absolute inset-[-100%] w-[300%] h-[300%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#7C3AED_0%,#D2BBFF_50%,#7C3AED_100%)]" />
            
            {/* Dark overlay to tone it down and provide the base color */}
            <div className="absolute inset-0 bg-black/70" />
            
            {/* Sheen and shadow effects */}
            <div
                className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"
            ></div>
            <div
                className="absolute inset-0 rounded-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.1),inset_0_-2px_10px_rgba(0,0,0,0.5)]"
            ></div>

            {/* Text content */}
            <span
                className="relative z-10 text-white font-medium text-[16px] tracking-tight opacity-90 group-hover:opacity-100 transition-opacity"
            >
                {children}
            </span>
        </button>
    );
}
