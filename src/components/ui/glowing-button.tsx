"use client";

import { cn } from '@/lib/utils';
import React from 'react';

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
        { color: 'hsl(var(--primary))', i: '19px', d: '8.2s' },
        { color: 'hsl(var(--accent))', i: '15px', d: '9.1s' },
        { color: '#3e3c8f', i: '14px', d: '4.2s' },
        { color: '#d2bbff', i: '16px', d: '5.8s' },
        { color: 'hsl(var(--primary))', i: '10px', d: '7.3s' },
        { color: 'hsl(var(--accent))', i: '18px', d: '6.4s' },
        { color: '#3e3c8f', i: '20px', d: '10s' },
        { color: '#d2bbff', i: '12px', d: '3.7s' },
        { color: 'hsl(var(--primary))', i: '11px', d: '2.6s' },
        { color: 'hsl(var(--accent))', i: '17px', d: '6.9s' },
        { color: '#3e3c8f', i: '13px', d: '5.3s' },
        { color: '#d2bbff', i: '19px', d: '7.7s' },
    ];

    return (
        <>
            <div className="absolute inset-0 w-full h-full overflow-hidden rounded-full">
                <div className="container-loader">
                    {balls.map((ball, index) => (
                        <div
                            key={index}
                            className="ball"
                            style={{
                                '--color': ball.color,
                                '--i': ball.i,
                                '--d': ball.d,
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
            </div>
            
            <style jsx>{`
                .container-loader {
                    --size: 300px;
                    width: var(--size);
                    height: var(--size);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    zoom: 0.5;
                }

                .ball {
                    position: absolute;
                    width: calc(var(--size) + var(--i));
                    height: calc(var(--size) + var(--i));
                    background-color: var(--color);
                    border-radius: 50%;
                    animation: move 5s linear infinite;
                    transform-origin: var(--size);
                    mix-blend-mode: hard-light;
                    animation-duration: var(--d);
                    filter: blur(58px);
                }

                .container-loader :global(.ball:nth-child(even)) {
                    animation-direction: reverse;
                }

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
};

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function GlowingButton({ children, className, ...props }: GlowingButtonProps) {
    return (
        <button
            className={cn(
                "group relative w-full h-[48px] flex items-center justify-center rounded-full transition-transform active:scale-95 duration-200 overflow-hidden bg-black",
                className
            )}
            {...props}
        >
            <GassyBackground />
            <span
                className="relative z-10 text-white font-medium text-[16px] tracking-tight opacity-90 group-hover:opacity-100 transition-opacity"
            >
                {children}
            </span>
        </button>
    );
}
