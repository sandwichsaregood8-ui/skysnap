"use client";

import { useRouter } from 'next/navigation';

export function SetupButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/connect');
  };

  return (
    <button className="button-88" onClick={handleClick}>
        <span className="button-88-text">Set up or add new device</span>
    </button>
  );
}
