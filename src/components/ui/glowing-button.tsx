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
                "w-full h-[48px] flex items-center justify-center rounded-full bg-transparent border border-primary text-white font-medium text-[16px] tracking-tight transition-transform active:scale-95 duration-200",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
