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
            { color: "#ff6347", i: 12, d: 3.4 },
            { color: "#00ced1", i: 18, d: 6.1 },
            { color: "#adff2f", i: 10, d: 2.9 },
            { color: "#9370db", i: 16, d: 7.8 },
            { color: "#ff1493", i: 14, d: 4.6 },
            { color: "#00bfff", i: 11, d: 3.3 },
            { color: "#7fff00", i: 17, d: 5.5 },
            { color: "#dc143c", i: 13, d: 6.7 },
            { color: "#8a2be2", i: 19, d: 8.2 },
            { color: "#48d1cc", i: 15, d: 9.1 },
            { color: "#ff4500", i: 14, d: 4.2 },
            { color: "#00ff7f", i: 16, d: 5.8 },
            { color: "#ba55d3", i: 10, d: 7.3 },
            { color: "#1e90ff", i: 18, d: 6.4 },
            { color: "#ffa500", i: 20, d: 10 },
            { color: "#ff69b4", i: 12, d: 3.7 },
            { color: "#00fa9a", i: 11, d: 2.6 },
            { color: "#9400d3", i: 17, d: 6.9 },
            { color: "#ffb6c1", i: 13, d: 5.3 },
            { color: "#20b2aa", i: 19, d: 7.7 },
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
          border-radius: 24px;
          background: transparent;
          overflow: hidden;
          width: 100%;
          height: 120px;
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
          border-radius: 24px;
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
          filter: blur(45px);
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
          border-radius: 21px;
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
            #ff6b6b, #4ecdc4, #45b7d1,
            #96ceb4, #feca57, #ff9ff3, #ff6b6b
          );
          background-clip: text;
          -webkit-background-clip: text;
          filter: hue-rotate(0deg);
        }

        .fusion-button:hover .gradient-text {
          animation: hue-rotating 2s linear infinite;
        }

        @keyframes hue-rotating {
          to { filter: hue-rotate(360deg); }
        }
      `}</style>
    </>
  );
}
