import React, { useState, useEffect, useRef } from 'react';

const DURATION = 5000;

export default function SteadyHoldTest({ onPass }) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const passedRef = useRef(false);

  useEffect(() => {
    if (!holding) return;
    const jitter = setInterval(() => {
      setOffset({
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
      });
    }, 450);
    return () => clearInterval(jitter);
  }, [holding]);

  useEffect(() => {
    if (!holding) return;
    const tick = setInterval(() => {
      setProgress((p) => {
        const next = p + 100;
        if (next >= DURATION && !passedRef.current) {
          passedRef.current = true;
          onPass();
          return DURATION;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(tick);
  }, [holding, onPass]);

  const handleStart = (e) => {
    e.preventDefault();
    passedRef.current = false;
    setHolding(true);
    setProgress(0);
  };

  const handleEnd = () => {
    if (progress < DURATION) {
      setHolding(false);
      setProgress(0);
      setOffset({ x: 0, y: 0 });
    }
  };

  const pct = (progress / DURATION) * 100;
  const secondsLeft = ((DURATION - progress) / 1000).toFixed(1);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-72 h-72 flex items-center justify-center rounded-full border border-[#2D1B69]/50 bg-[#0A0A0F]/50">
        <button
          onPointerDown={handleStart}
          onPointerUp={handleEnd}
          onPointerLeave={handleEnd}
          onPointerCancel={handleEnd}
          className="w-24 h-24 rounded-full bg-[#00D4FF]/20 border-2 border-[#00D4FF] flex items-center justify-center transition-transform duration-300 ease-out touch-none select-none"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            boxShadow: '0 0 15px rgba(0,212,255,0.4), 0 0 30px rgba(0,212,255,0.2)',
          }}
        >
          <span className="text-[#00D4FF] text-[10px] font-black uppercase tracking-wider">
            {holding ? secondsLeft + 's' : 'HOLD'}
          </span>
        </button>
      </div>

      <div className="w-72 h-3 bg-[#1A0533] rounded-full overflow-hidden border border-[#2D1B69]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#FF2D78] transition-all duration-100"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-[#FF6EC7] text-sm text-center max-w-xs">
        {holding
          ? `Hold steady... ${secondsLeft}s left`
          : 'Press and hold the button. Follow it. Do not let go for 5 seconds.'}
      </p>
    </div>
  );
}