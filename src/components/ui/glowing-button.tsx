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
            {/* The gaseous gradient background */}
            <div className="absolute inset-0 animate-gassy-flow bg-[linear-gradient(45deg,#7C3AED,#D2BBFF,#7dd3fc,#c4b5fd,#7C3AED)] bg-[size:400%_400%]" />
            
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
