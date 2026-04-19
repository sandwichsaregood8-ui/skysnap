"use client";

import { useRouter } from 'next/navigation';

export function NextButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/connect/configure');
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq">
          <feColorMatrix
            values="1 0 0 0 0              0 1 0 0 0              0 0 1 0 0              0 0 0 9 0"
          ></feColorMatrix>
        </filter>
        <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq2">
          <feColorMatrix
            values="1 0 0 0 0              0 1 0 0 0              0 0 1 0 0              0 0 0 3 0"
          ></feColorMatrix>
        </filter>
        <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq3">
          <feColorMatrix
            values="1 0 0 0.2 0              0 1 0 0.2 0              0 0 1 0.2 0              0 0 0 2 0"
          ></feColorMatrix>
        </filter>
      </svg>
      <button onClick={handleClick} className="real-button"></button>
      <div className="backdrop"></div>
      <div className="button-container">
        <div className="spin spin-blur"></div>
        <div className="spin spin-intense"></div>
        <div className="backdrop"></div>
        <div className="button-border">
          <div className="spin spin-inside"></div>
          <div className="button">Next</div>
        </div>
      </div>
    </div>
  );
}
