'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AuroraButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const AuroraButton = React.forwardRef<HTMLButtonElement, AuroraButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative group w-full flex justify-center">
        {/* The background of the parent div should be dark navy/almost black. This is handled by the page this component is on. */}
        <div className="aurora-glow" />
        <button
          ref={ref}
          className={cn(
            'relative z-10 w-full px-8 py-4 font-bold text-white bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#38bdf8] rounded-full shadow-lg', // Using a purple-to-blue gradient for the button
            className
          )}
          {...props}
        >
          {children}
        </button>
        <style jsx>{`
          .aurora-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 250%; /* Large blob */
            padding-bottom: 250%;
            border-radius: 50%;
            background: linear-gradient(135deg, #7c3aed, #c4b5fd, #87ceeb);
            filter: blur(80px); /* Heavy blur */
            transform: translate(-50%, -50%);
            z-index: 0;
            opacity: 0.6;
            transition: opacity 0.5s;
            animation: aurora-animation 20s ease-in-out infinite;
          }

          @keyframes aurora-animation {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) scale(1);
            }
            25% {
              transform: translate(-45%, -55%) rotate(45deg) scale(1.1);
            }
            50% {
              transform: translate(-50%, -50%) rotate(90deg) scale(1.2);
              opacity: 0.7;
            }
            75% {
              transform: translate(-55%, -45%) rotate(135deg) scale(1.1);
            }
            100% {
              transform: translate(-50%, -50%) rotate(180deg) scale(1);
            }
          }
          .group:hover .aurora-glow {
            opacity: 0.9;
          }
        `}</style>
      </div>
    );
  }
);
AuroraButton.displayName = 'AuroraButton';

export { AuroraButton };
