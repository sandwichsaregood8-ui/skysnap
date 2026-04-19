"use client";

import { useRouter } from 'next/navigation';

export function SetupButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/connect');
  };

  const orbs = [
    { color: "hsl(261, 100%, 86%)", d: 15 },
    { color: "hsl(243, 100%, 87%)", d: 20 },
  ];

  return (
    <>
      <button className="fusion-button" onClick={handleClick}>
        <div className="button-inner">
          <div className="orbs-container">
            {orbs.map((orb, idx) => (
              <div
                key={idx}
                className="orb"
                style={{
                  "--color": orb.color,
                  "--d": `${orb.d}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
          <span className="button-text">Set up or add new device</span>
        </div>
      </button>

      <style>{`
        .fusion-button {
          position: relative;
          padding: 1px;
          border: none;
          cursor: pointer;
          background: transparent;
          overflow: hidden;
          width: 100%;
          height: 200px;
          border-radius: 28px;
          transition: transform 0.2s ease;
        }

        .fusion-button:hover {
          transform: scale(1.03);
        }

        .fusion-button:active {
          transform: scale(0.99);
        }

        .fusion-button::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
                transparent,
                hsl(var(--primary) / 0.3),
                transparent 30%
            );
            animation: rotate-border 20s linear infinite;
            z-index: 1;
        }

        .button-inner {
          position: absolute;
          inset: 1px;
          background: rgba(34, 42, 62, 0.85); /* surface-container-high from theme */
          border-radius: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          overflow: hidden;
        }

        .orbs-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }

        .orb {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: var(--color);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform-origin: 0 0;
          mix-blend-mode: hard-light;
          filter: blur(50px);
          opacity: 0.25;
          animation: orb-move var(--d) linear infinite;
        }

        @keyframes orb-move {
          0% { transform: translate(-50%, -50%) rotate(0deg) translateX(60px); }
          100% { transform: translate(-50%, -50%) rotate(360deg) translateX(60px); }
        }

        .button-text {
          font-size: 18px;
          font-weight: 600;
          color: white;
          z-index: 1;
        }

        @keyframes rotate-border {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
