import React from 'react';

export default function CyberSlider({ value, onChange, min = 1, max = 12, step = 1 }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="relative">
        <div className="h-2 rounded-full bg-[#1A0533] border border-[#2D1B69]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF2D78] to-[#00D4FF] transition-all"
            style={{ width: `${pct}%`, boxShadow: '0 0 10px rgba(255,45,120,0.5)' }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="cyber-range absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FF2D78] border-2 border-white pointer-events-none transition-all"
          style={{
            left: `calc(${pct}% - 14px)`,
            boxShadow: '0 0 12px #FF2D78, 0 0 24px rgba(255,45,120,0.4)',
          }}
        />
      </div>
    </div>
  );
}