"use client";

import { useRouter } from 'next/navigation';

export function SetupButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/connect');
  };

  return (
    <>
      <button className="fusion-button" onClick={handleClick}>
        <div className="orbs-container">
          {[
            { color: "#7c3aed", i: 12, d: 15.4 },
            { color: "#2563eb", i: 18, d: 18.1 },
            { color: "#0891b2", i: 10, d: 20.9 },
            { color: "#6d28d9", i: 16, d: 12.8 },
            { color: "#1d4ed8", i: 14, d: 16.6 },
            { color: "#0e7490", i: 11, d: 21.3 },
          ].map((orb, idx) => (
            <div
              key={idx}
              className={`orb ${idx % 2 === 0 ? "reverse" : ""}`}
              style={{
                "--color": orb.color,
                "--i": `${orb.i}px`,
                "--d": `${orb.d}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="button-inner">
          <span className="gradient-text">Set up or add new device</span>
        </div>
      </button>

      <style>{`
        .fusion-button {
          position: relative;
          padding: 3px;
          border: none;
          cursor: pointer;
          border-radius: 32px;
          background: transparent;
          overflow: hidden;
          width: 280px;
          height: 240px;
          transition: transform 0.2s ease;
        }

        .fusion-button:hover {
          transform: scale(1.03);
        }

        .fusion-button:active {
          transform: scale(0.99);
        }

        .orbs-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 32px;
        }

        .orb {
          position: absolute;
          width: calc(100% + var(--i));
          height: calc(100% + var(--i));
          background-color: var(--color);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
          mix-blend-mode: hard-light;
          filter: blur(35px);
          opacity: 0.6;
          animation: orb-move var(--d) linear infinite;
        }

        .orb.reverse {
          animation-direction: reverse;
        }

        @keyframes orb-move {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(60px); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(60px); }
        }

        .button-inner {
          position: absolute;
          inset: 3px;
          background: rgba(5, 5, 20, 0.85);
          border-radius: 29px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .gradient-text {
          font-size: 18px;
          font-weight: bold;
          color: transparent;
          background: conic-gradient(
            from 0deg,
            #7c3aed, #2563eb, #0891b2, #6d28d9, #1d4ed8, #0e7490, #7c3aed
          );
          background-clip: text;
          -webkit-background-clip: text;
          filter: hue-rotate(0deg);
        }

        .fusion-button:hover .gradient-text {
          animation: hue-rotating 6s linear infinite;
        }

        @keyframes hue-rotating {
          to { filter: hue-rotate(360deg); }
        }
      `}</style>
    </>
  );
}
