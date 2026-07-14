import React, { useState, useEffect, useRef } from 'react';

export default function PartyTimer({ endsAt, onExpire }) {
  const [display, setDisplay] = useState('00:00:00');
  const firedRef = useRef(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setDisplay('00:00:00');
        if (!firedRef.current) {
          firedRef.current = true;
          onExpire?.();
        }
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setDisplay(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endsAt, onExpire]);

  const diff = new Date(endsAt).getTime() - Date.now();
  const isLow = diff < 3600000;

  return (
    <div className="text-center">
      <div
        className={`font-mono text-6xl font-black tabular-nums ${
          isLow ? 'text-[#FF2D78]' : 'text-[#00D4FF]'
        }`}
        style={{
          textShadow: isLow
            ? '0 0 20px rgba(255,45,120,0.6), 0 0 40px rgba(255,45,120,0.3)'
            : '0 0 20px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.3)',
        }}
      >
        {display}
      </div>
    </div>
  );
}