const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ list:async()=>[], filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, AlertTriangle, ChevronRight, BookOpen } from 'lucide-react';

import { useLang } from '@/lib/i18n';
import NeonButton from '@/components/NeonButton';
import CyberSlider from '@/components/CyberSlider';
import { useBlockedApps } from '@/lib/useBlockedApps';
import { usePartyMode } from '@/hooks/usePartyMode';

export default function Home() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { isActive, session: activeSession, startParty: triggerStart, loading: partyLoading } = usePartyMode();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(4);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const { enabledApps } = useBlockedApps();

  useEffect(() => {
    const load = async () => {
      try {
        const contactList = await db.entities.HiddenContact.list('-created_date', 50);
        setContacts(contactList || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, []);

  const startParty = async () => {
    if (contacts.length === 0 && enabledApps.length === 0) {
      setError(t('addContactOrAppFirst'));
      setTimeout(() => setError(''), 3000);
      return;
    }
    setStarting(true);
    try {
      await triggerStart(duration);
      navigate('/party-mode');
    } catch (e) {
      console.error(e);
      setStarting(false);
    }
  };

  if (loading || partyLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#2D1B69] border-t-[#FF2D78] rounded-full animate-spin" />
      </div>
    );
  }

  if (activeSession) {
    return (
      <div className="max-w-md mx-auto px-5 pt-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#2D1B69] to-[#1A0533] border border-[#FF2D78]/30 p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF2D78]/10 border-2 border-[#FF2D78] mb-4 animate-pulse">
            <Shield className="text-[#FF2D78]" size={28} />
          </div>
          <h2 className="text-xl font-black uppercase tracking-wider text-[#FF2D78] mb-2"
            style={{ textShadow: '0 0 12px rgba(255,45,120,0.5)' }}>
            {t('partyModeActive')}
          </h2>
          <p className="text-gray-400 text-sm mb-6">{t('partyActiveDesc')}</p>
          <NeonButton variant="blue" className="w-full" onClick={() => navigate('/party-mode')}>
            {t('goToPartyMode')}
          </NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <h1
        className="text-3xl font-black uppercase tracking-tight text-white mb-1"
        style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}
      >
        {t('appTitle')}
      </h1>
      <p className="text-gray-500 text-sm mb-8">{t('selectDuration')}</p>

      <div className="rounded-2xl bg-[#1A0533]/60 border border-[#2D1B69] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="flex items-center gap-2 text-[#FF6EC7] text-sm font-bold uppercase tracking-wider">
            <Clock size={16} /> {t('duration')}
          </span>
          <span className="text-3xl font-black text-[#00D4FF] font-mono">
            {duration}
            <span className="text-sm text-gray-500 ml-1">{t('hours')}</span>
          </span>
        </div>
        <CyberSlider value={duration} onChange={setDuration} min={1} max={12} />
        <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-mono">
          <span>1h</span><span>6h</span><span>12h</span>
        </div>
      </div>

      <NeonButton
        variant="pink"
        className="w-full py-5 text-lg mb-3 animate-pulse"
        onClick={startParty}
        disabled={starting}
      >
        {starting ? '...' : t('startPartyMode')}
      </NeonButton>

      {error && (
        <div className="flex items-center gap-2 text-[#FF2D78] text-sm mb-4 justify-center">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
            {t('protectedContacts')}
          </h3>
          <span className="text-xs font-mono text-[#00D4FF]">{contacts.length}</span>
        </div>

        {contacts.length === 0 ? (
          <button
            onClick={() => navigate('/vault')}
            className="w-full rounded-xl border border-dashed border-[#2D1B69] p-6 text-center hover:border-[#FF2D78]/50 transition-colors"
          >
            <p className="text-gray-500 text-sm font-bold mb-1">{t('noContactsYet')}</p>
            <p className="text-gray-600 text-xs">{t('noContactsDesc')}</p>
          </button>
        ) : (
          <div className="space-y-2">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-xl bg-[#1A0533]/40 border border-[#2D1B69]/50 px-4 py-3"
              >
                <div className="w-9 h-9 rounded-full bg-[#2D1B69] flex items-center justify-center text-[#FF6EC7] font-black text-sm">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">{c.name}</p>
                  <p className="text-gray-600 text-xs font-mono">••••••••••</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate('/vault')}
              className="flex items-center justify-center gap-1 w-full text-[#FF6EC7] text-xs font-bold uppercase tracking-wider pt-2 hover:text-[#FF2D78] transition-colors"
            >
              {t('goToVault')} <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
            {t('navApps')}
          </h3>
          <button
            onClick={() => navigate('/blocked-apps')}
            className="flex items-center gap-1 text-[#00D4FF] text-xs font-bold uppercase tracking-wider hover:text-[#0080FF] transition-colors"
          >
            {t('configureAppGuard')} <ChevronRight size={14} />
          </button>
        </div>
        {enabledApps.length === 0 ? (
          <button
            onClick={() => navigate('/blocked-apps')}
            className="w-full rounded-xl border border-dashed border-[#2D1B69] p-4 text-center hover:border-[#FF2D78]/50 transition-colors"
          >
            <p className="text-gray-600 text-xs">{t('blockedAppsPageDesc')}</p>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {enabledApps.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-2 rounded-xl bg-[#1A0533]/40 border border-[#2D1B69]/50 px-3 py-2.5"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0"
                  style={{ backgroundColor: app.color }}
                >
                  {app.icon}
                </div>
                <span className="text-white text-xs font-bold truncate">{app.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* App Guide Section */}
      <div className="mt-8 pb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
          {t('settingsOnboarding')}
        </h3>
        <button
          onClick={() => navigate('/onboarding')}
          className="w-full flex items-center gap-4 rounded-2xl bg-[#1A0533]/40 border border-[#2D1B69]/50 p-4 hover:border-[#FF2D78]/30 hover:bg-[#1A0533]/60 transition-all text-left group"
        >
          <div className="shrink-0 w-11 h-11 rounded-xl bg-[#2D1B69]/60 flex items-center justify-center text-[#FF6EC7] group-hover:text-[#FF2D78] transition-colors">
            <BookOpen size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm mb-0.5">{t('settingsOnboarding')}</p>
            <p className="text-gray-500 text-xs leading-relaxed">{t('settingsOnboardingDesc')}</p>
          </div>
          <ChevronRight className="text-gray-600 group-hover:text-white transition-colors shrink-0" size={18} />
        </button>
      </div>
    </div>
  );
}