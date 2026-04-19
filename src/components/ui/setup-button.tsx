"use client";

import { useRouter } from 'next/navigation';

export function SetupButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/connect');
  };

  return (
    <button className="gradient-button" onClick={handleClick}>
        <span className="gradient-text">Set up or add new device</span>
    </button>
  );
}
