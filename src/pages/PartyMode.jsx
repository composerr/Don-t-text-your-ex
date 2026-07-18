const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ list:async()=>[], filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Phone, Power, Lock, Smartphone, Settings } from 'lucide-react';

import { useLang } from '@/lib/i18n';
import NeonButton from '@/components/NeonButton';
import PartyTimer from '@/components/PartyTimer';
import { useBlockedApps } from '@/lib/useBlockedApps';
import { usePartyMode } from '@/hooks/usePartyMode';

export default function PartyMode() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { isActive, session, endParty, loading: partyLoading } = usePartyMode();
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [msgIndex, setMsgIndex] = useState(0);
  const messages = t('partyMessages');
  const { enabledApps } = useBlockedApps();

  const isSosEnabled = localStorage.getItem('b44_enable_emergency_sos') !== 'false';
  const customSosName = localStorage.getItem('b44_sos_contact_name') || '';
  const customSosPhone = localStorage.getItem('b44_sos_contact_phone') || '';
  const customSosMsg = localStorage.getItem('b44_sos_message') || 'I am safe and sound!';

  const [showSosPicker, setShowSosPicker] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [sosContactId, setSosContactId] = useState(() => localStorage.getItem('b44_sos_bypass_contact_id') || '');
  const [sosExpiresAt, setSosExpiresAt] = useState(() => parseInt(localStorage.getItem('b44_sos_bypass_expires_at') || '0', 10));
  const [timeLeftStr, setTimeLeftStr] = useState('');
  const [sosSuccessMsg, setSosSuccessMsg] = useState(false);

  const activeBypass = !!(sosContactId && Date.now() < sosExpiresAt);
  const bypassedContact = sosContactId === 'custom_sos_contact'
    ? { id: 'custom_sos_contact', name: customSosName || 'SOS Contact', phoneNumber: customSosPhone, originalNotes: customSosMsg }
    : contacts.find((c) => c.id === sosContactId);

  useEffect(() => {
    if (!activeBypass) return;

    const tick = () => {
      const now = Date.now();
      const diff = sosExpiresAt - now;
      if (diff <= 0) {
        setSosContactId('');
        localStorage.removeItem('b44_sos_bypass_contact_id');
        localStorage.removeItem('b44_sos_bypass_expires_at');
        setTimeLeftStr('');
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeftStr(`${mins}m ${secs}s`);
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [sosExpiresAt, activeBypass]);

  const triggerSos = async (contact) => {
    const expires = Date.now() + 5 * 60 * 1000;
    setSosContactId(contact.id);
    setSosExpiresAt(expires);
    localStorage.setItem('b44_sos_bypass_contact_id', contact.id);
    localStorage.setItem('b44_sos_bypass_expires_at', expires.toString());
    setShowSosPicker(false);
    setSosSuccessMsg(true);
    setTimeout(() => setSosSuccessMsg(false), 5000);

    try {
      await db.entities.AccessAttemptLog.create({
        attemptedAction: `SOS: "I am safe" message sent to ${contact.name}`,
        attemptTimestamp: new Date().toISOString(),
        testPassed: true,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const contactList = await db.entities.HiddenContact.list('-created_date', 50);
        setContacts(contactList || []);
      } catch (e) {
        console.error(e);
      }
      setContactsLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const handleExpire = async () => {
    await endParty();
  };

  if (partyLoading || contactsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#2D1B69] border-t-[#FF2D78] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isActive || !session) {
    return (
      <div className="max-w-md mx-auto px-5 pt-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1A0533] border-2 border-[#00D4FF]/30 mb-6">
          <Shield className="text-[#00D4FF]" size={32} />
        </div>
        <h2 className="text-xl font-black text-white mb-2">{t('partyOver')}</h2>
        <NeonButton variant="blue" className="mt-6" onClick={() => navigate('/')}>
          {t('navHome')}
        </NeonButton>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <div className="text-center mb-6 flex flex-col items-center">
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border border-[#FF2D78]/20 bg-[#FF2D78]/5 animate-guard-pulse" />
          <div className="absolute inset-0 rounded-full border border-[#FF2D78]/40 animate-scan-radar" />
          <div className="absolute inset-[-12px] rounded-full border border-[#FF2D78]/20 animate-scan-radar" style={{ animationDelay: '1.2s' }} />
          <div className="relative z-10 w-16 h-16 rounded-full bg-[#1A0533] border border-[#FF2D78]/60 flex items-center justify-center text-[#FF2D78] shadow-[0_0_20px_rgba(255,45,120,0.3)] animate-shield-float">
            <Shield size={28} className="fill-[#FF2D78]/10" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/30 mb-4 animate-glow-border">
          <span className="w-2 h-2 rounded-full bg-[#FF2D78] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-[#FF2D78]">
            {t('partyModeActiveTitle')}
          </span>
        </div>

        <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">{t('timeRemaining')}</p>
        <PartyTimer endsAt={session.endsAt} onExpire={handleExpire} />
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-[#1A0533]/60 to-[#0A0A0F] border border-[#2D1B69]/50 p-5 mb-6 text-center min-h-[80px] flex items-center justify-center">
        <p className="text-[#FF6EC7] text-sm italic leading-relaxed transition-opacity">
          "{messages[msgIndex]}"
        </p>
      </div>

      {sosSuccessMsg && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold text-center animate-fadeIn shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          {t('emergencySosSuccess')}
        </div>
      )}

      {activeBypass && bypassedContact && (
        <div className="mb-6 rounded-2xl bg-red-950/20 border-2 border-red-500/50 p-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <div className="flex items-center justify-between mb-3 border-b border-red-500/20 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {t('emergencySosActive')}
            </span>
            <span className="text-xs font-mono text-red-400 font-bold">
              {t('emergencySosTimeRemaining')}: {timeLeftStr}
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-red-950/40 border border-red-500/30 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center text-red-400 font-black text-sm shrink-0">
              {bypassedContact.name ? bypassedContact.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-black text-sm truncate">{bypassedContact.name}</p>
              <p className="text-red-300 font-mono text-sm mt-0.5">{bypassedContact.phoneNumber}</p>
              {bypassedContact.originalNotes && (
                <p className="text-gray-400 text-xs mt-1 italic truncate">"{bypassedContact.originalNotes}"</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <a
              href={`tel:${bypassedContact.phoneNumber}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-xs py-3 tracking-wider transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)] text-center"
            >
              📞 Call Now
            </a>
            <a
              href={`https://wa.me/${bypassedContact.phoneNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(bypassedContact.originalNotes || 'I am safe.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black uppercase text-xs py-3 tracking-wider transition-colors shadow-[0_0_15px_rgba(37,211,102,0.3)] text-center"
            >
              💬 Message
            </a>
          </div>
        </div>
      )}

      {isSosEnabled && !activeBypass && (
        <div className="mb-6 rounded-2xl bg-red-950/10 border border-red-500/20 p-4">
          <NeonButton
            variant="danger"
            className="w-full py-3.5 text-red-200 border-red-500/40 hover:border-red-500 hover:text-white"
            onClick={() => {
              if (customSosPhone) {
                triggerSos({
                  id: 'custom_sos_contact',
                  name: customSosName || 'SOS Contact',
                  phoneNumber: customSosPhone,
                  originalNotes: customSosMsg,
                });
              } else if (contacts.length > 0) {
                setShowSosPicker(true);
              } else {
                alert("Please configure your Emergency SOS Contact in Settings first.");
              }
            }}
          >
            {t('emergencySosButton')}
          </NeonButton>
        </div>
      )}

      {showSosPicker && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#0A0A0F] border border-red-500/40 p-6 shadow-[0_0_50px_rgba(239,68,68,0.3)]">
            <div className="flex items-center justify-between mb-4 border-b border-red-500/20 pb-3">
              <h3 className="text-white font-black text-sm uppercase tracking-wide flex items-center gap-2">
                🚨 {t('emergencySosButton')}
              </h3>
              <button
                onClick={() => setShowSosPicker(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            
            <p className="text-gray-400 text-xs mb-4 leading-normal">
              {t('emergencySosPrompt')}
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => triggerSos(c)}
                  className="w-full flex items-center gap-3 rounded-xl bg-red-950/20 border border-red-500/20 p-3 hover:bg-red-950/40 hover:border-red-500 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center text-red-400 font-bold text-xs shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-bold text-sm truncate">{c.name}</p>
                    <p className="text-gray-500 text-xs font-mono truncate">{c.phoneNumber}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSosPicker(false)}
              className="w-full mt-4 py-2.5 rounded-xl border border-gray-800 text-gray-500 hover:text-white hover:border-gray-700 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {t('protectedContacts')}
          </span>
          <span className="text-xs font-mono text-[#00D4FF]">
            {contacts.length} {t('contactsProtected')}
          </span>
        </div>
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
                <p className="text-gray-600 text-xs font-mono flex items-center gap-1">
                  <Lock size={10} /> ••••••••••
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            <Smartphone size={14} /> {t('appGuardActive')}
          </span>
          <button
            onClick={() => navigate('/blocked-apps')}
            className="flex items-center gap-1 text-[#00D4FF] text-xs font-bold uppercase tracking-wider hover:text-[#0080FF] transition-colors"
          >
            <Settings size={12} /> {t('configureAppGuard')}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {enabledApps.map((app) => (
            <button
              key={app.id}
              onClick={() => navigate(`/anti-post?app=${app.id}`)}
              className="flex items-center gap-2 rounded-xl bg-[#1A0533]/40 border border-[#2D1B69]/50 px-3 py-3 hover:border-[#FF2D78]/40 transition-colors"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0"
                style={{ backgroundColor: app.color }}
              >
                {app.icon}
              </div>
              <span className="text-white text-xs font-bold truncate">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl bg-[#1A0533]/40 border border-[#FF2D78]/20 p-4">
          <p className="text-[#FF6EC7] text-xs text-center mb-3">{t('needContactDesc')}</p>
          <NeonButton variant="pink" className="w-full" onClick={() => navigate('/anti-simp?action=contact')}>
            <Phone size={16} className="inline mr-2" /> {t('needContact')}
          </NeonButton>
        </div>

        <div className="rounded-xl bg-[#1A0533]/40 border border-[#2D1B69]/50 p-4">
          <p className="text-gray-500 text-xs text-center mb-3">{t('deactivateDesc')}</p>
          <NeonButton variant="ghost" className="w-full" onClick={() => setShowDeactivateConfirm(true)}>
            <Power size={16} className="inline mr-2" /> {t('deactivateEarly')}
          </NeonButton>
        </div>
      </div>

      {showDeactivateConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-5 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[#0A0A0F] border border-[#FF2D78]/50 p-6 shadow-[0_0_50px_rgba(255,45,120,0.3)] text-center animate-scaleUp">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/40 mb-4 text-[#FF2D78] animate-shield-float">
              <Power size={32} />
            </div>
            
            <h3 className="text-white font-black text-lg uppercase tracking-wide mb-3">
              {t('confirmDeactivateTitle')}
            </h3>
            
            <p className="text-gray-400 text-xs leading-relaxed mb-6">
              {t('confirmDeactivateDesc')}
            </p>

            <div className="space-y-3">
              <NeonButton 
                variant="pink" 
                className="w-full py-3" 
                onClick={() => setShowDeactivateConfirm(false)}
              >
                {t('confirmDeactivateKeepSafe')}
              </NeonButton>
              
              <button
                onClick={() => {
                  setShowDeactivateConfirm(false);
                  navigate('/anti-simp?action=deactivate');
                }}
                className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400/80 hover:text-red-400 hover:border-red-500 hover:bg-red-950/20 text-xs font-bold uppercase tracking-wider transition-all"
              >
                {t('confirmDeactivateProceed')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}