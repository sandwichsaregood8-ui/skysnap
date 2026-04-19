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
                "group w-full h-[48px] flex items-center justify-center rounded-full transition-transform active:scale-95 duration-200 bg-transparent border border-primary",
                className
            )}
            {...props}
        >
            <span
                className="relative z-10 text-white font-medium text-[16px] tracking-tight"
            >
                {children}
            </span>
        </button>
    );
}
