import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { usePartyMode } from '@/hooks/usePartyMode';
import { useLang } from '@/lib/i18n';

export default function PartyModeIndicator() {
  const { isActive, timeLeftStr } = usePartyMode();
  const navigate = useNavigate();
  const { t } = useLang();

  if (!isActive) return null;

  return (
    <button
      onClick={() => navigate('/party-mode')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/40 hover:bg-[#FF2D78]/20 transition-all cursor-pointer select-none group relative shadow-[0_0_15px_rgba(255,45,120,0.15)] overflow-hidden"
      title={t('partyModeActiveTitle') || 'Party Mode Active'}
    >
      {/* Outer subtle glow indicator */}
      <span className="absolute inset-0 bg-[#FF2D78]/5 animate-pulse rounded-full" />
      
      {/* Pulsing core badge dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2D78] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2D78]"></span>
      </span>

      <Shield size={14} className="text-[#FF2D78] fill-[#FF2D78]/15 relative z-10 animate-shield-float" />
      
      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF2D78] font-mono relative z-10">
        {timeLeftStr || 'ON'}
      </span>
    </button>
  );
}
