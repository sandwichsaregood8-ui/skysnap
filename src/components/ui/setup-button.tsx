"use client";

import { useRouter } from 'next/navigation';

export function SetupButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/connect');
  };

  return (
    <div className="button-88-wrapper">
      <style>{`
        .button-88-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .button-88 {
          position: relative;
          padding: 2px;
          border: none;
          cursor: pointer;
          background: transparent;
          width: 100%;
          height: 200px;
          border-radius: 28px;
          transition: transform 0.2s ease;
        }

        .button-88:hover {
          transform: scale(1.03);
        }

        .button-88:active {
          transform: scale(0.99);
        }

        .button-88::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
                transparent,
                hsl(var(--primary) / 0.6),
                transparent 30%
            );
            animation: rotate-border-88 20s linear infinite;
        }

        .button-88-inner {
          position: absolute;
          inset: 2px;
          background: hsl(var(--background));
          border-radius: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          overflow: hidden;
        }

        .button-88-orbs-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }

        .button-88-orb {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: var(--color);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform-origin: center center;
          filter: blur(50px);
          opacity: 0.25;
          animation: orb-pulse-88 var(--d) ease-in-out infinite;
        }

        @keyframes orb-pulse-88 {
          0% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.25;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.35;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0.25;
          }
        }

        .button-88-text {
          font-size: 18px;
          font-weight: 600;
          color: white;
          z-index: 1;
        }

        @keyframes rotate-border-88 {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
      <button className="button-88" onClick={handleClick}>
        <div className="button-88-inner">
          <div className="button-88-orbs-container">
            <div
              className="button-88-orb"
              style={{
                "--color": "hsl(var(--primary))",
                "--d": "15s",
              } as React.CSSProperties}
            />
            <div
              className="button-88-orb"
              style={{
                "--color": "hsl(var(--secondary))",
                "--d": "20s",
              } as React.CSSProperties}
            />
          </div>
          <span className="button-88-text">Set up or add new device</span>
        </div>
      </button>
    </div>
  );
}
