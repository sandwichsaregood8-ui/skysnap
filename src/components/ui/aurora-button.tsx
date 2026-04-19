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
            'relative z-10 w-full px-8 py-4 text-slate-900 bg-gradient-to-r from-violet-200 via-cyan-200 to-violet-200 rounded-full',
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
            background: linear-gradient(135deg, #a855f7, #7dd3fc, #c4b5fd);
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
            50% {
              transform: translate(-52%, -48%) rotate(180deg) scale(1.1);
              opacity: 0.7;
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg) scale(1);
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
