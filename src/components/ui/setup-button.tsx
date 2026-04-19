"use client";

import { useRouter } from 'next/navigation';

export function SetupButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/connect');
  };

  const orbs = [
    { color: "hsl(var(--primary))", d: 15 },
    { color: "hsl(var(--secondary))", d: 20 },
  ];

  return (
    <button className="button-88" onClick={handleClick}>
      <div className="button-88-inner">
        <div className="button-88-orbs-container">
          {orbs.map((orb, idx) => (
            <div
              key={idx}
              className="button-88-orb"
              style={{
                "--color": orb.color,
                "--d": `${orb.d}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
        <span className="button-88-text">Set up or add new device</span>
      </div>
    </button>
  );
}
