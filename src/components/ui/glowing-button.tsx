"use client";

import { cn } from '@/lib/utils';
import React from 'react';

// This component creates a dynamic, blurred background effect with rotating orbs of color.
const GassyBackground = () => {
    // A curated list of "balls" with theme-approriate colors.
    // Durations and sizes are varied for a more organic, gaseous feel.
    const balls = [
        { color: 'hsl(var(--primary))', i: '12px', d: '3.4s' },
        { color: 'hsl(var(--accent))', i: '18px', d: '6.1s' },
        { color: '#3e3c8f', i: '10px', d: '2.9s' },
        { color: '#d2bbff', i: '16px', d: '7.8s' },
        { color: 'hsl(var(--primary))', i: '14px', d: '4.6s' },
        { color: 'hsl(var(--accent))', i: '11px', d: '3.3s' },
        { color: '#3e3c8f', i: '17px', d: '5.5s' },
        { color: '#d2bbff', i: '13px', d: '6.7s' },
    ];

    return (
        <>
            <div className="absolute inset-0 w-full h-full overflow-hidden rounded-full">
                {/* 
                  The container is scaled and positioned to ensure the blurred balls
                  fill the button's background area effectively.
                */}
                <div className="relative w-[300px] h-[300px] -translate-x-1/2 left-1/2 scale-75">
                    {balls.map((ball, index) => (
                        <div
                            key={index}
                            className="absolute rounded-full mix-blend-hard-light blur-[58px]"
                            style={{
                                '--color': ball.color,
                                '--i': ball.i,
                                '--d': ball.d,
                                width: 'calc(300px + var(--i))',
                                height: 'calc(300px + var(--i))',
                                backgroundColor: 'var(--color)',
                                animation: `move var(--d) linear infinite ${index % 2 === 0 ? 'reverse' : ''}`,
                                transformOrigin: '150px'
                            }}
                        />
                    ))}
                </div>
            </div>
            {/* 
              Keyframes are defined directly in a style block to keep the component
              self-contained and avoid modifying the global tailwind config.
            */}
            <style jsx>{`
                @keyframes move {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(359deg);
                    }
                }
            `}</style>
        </>
    );
}

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
            {/* Dark background for the blend-mode to work on */}
            <div className="absolute inset-0 bg-[#16141a]" />
            
            {/* The gaseous, moving background */}
            <GassyBackground />
            
            {/* Sheen and shadow effects for a premium feel */}
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
