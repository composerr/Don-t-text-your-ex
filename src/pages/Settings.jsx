import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, FileText, Smartphone, ChevronRight, Info, User, Phone, MessageSquare } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function Settings() {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();

  const [mathCount, setMathCount] = useState(() => {
    return parseInt(localStorage.getItem('b44_test_math_count') || '3', 10);
  });
  const [enableHold, setEnableHold] = useState(() => {
    return localStorage.getItem('b44_test_enable_hold') !== 'false';
  });
  const [enableEmergencySos, setEnableEmergencySos] = useState(() => {
    return localStorage.getItem('b44_enable_emergency_sos') !== 'false';
  });
  const [sosContactName, setSosContactName] = useState(() => {
    return localStorage.getItem('b44_sos_contact_name') || '';
  });
  const [sosContactPhone, setSosContactPhone] = useState(() => {
    return localStorage.getItem('b44_sos_contact_phone') || '';
  });
  const [sosMessage, setSosMessage] = useState(() => {
    return localStorage.getItem('b44_sos_message') || 'I am safe and sound!';
  });
  const [showLangGrid, setShowLangGrid] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  ];

  const getLanguageName = (code) => {
    switch (code) {
      case 'en': return 'English';
      case 'uk': return 'Українська';
      case 'es': return 'Español';
      case 'de': return 'Deutsch';
      case 'fr': return 'Français';
      case 'it': return 'Italiano';
      default: return 'English';
    }
  };

  const handleMathCountChange = (count) => {
    setMathCount(count);
    localStorage.setItem('b44_test_math_count', count.toString());
  };

  const handleEnableHoldChange = (enabled) => {
    setEnableHold(enabled);
    localStorage.setItem('b44_test_enable_hold', enabled ? 'true' : 'false');
  };

  const handleEnableEmergencySosChange = (enabled) => {
    setEnableEmergencySos(enabled);
    localStorage.setItem('b44_enable_emergency_sos', enabled ? 'true' : 'false');
  };

  const handleSosContactNameChange = (val) => {
    setSosContactName(val);
    localStorage.setItem('b44_sos_contact_name', val);
  };

  const handleSosContactPhoneChange = (val) => {
    setSosContactPhone(val);
    localStorage.setItem('b44_sos_contact_phone', val);
  };

  const handleSosMessageChange = (val) => {
    setSosMessage(val);
    localStorage.setItem('b44_sos_message', val);
  };

  const items = [
    {
      icon: Globe,
      title: t('settingsLanguage'),
      desc: getLanguageName(lang),
      action: () => setShowLangGrid(!showLangGrid),
      actionLabel: lang.toUpperCase(),
      id: 'lang',
    },
    {
      icon: FileText,
      title: t('settingsPrivacy'),
      desc: t('settingsPrivacyDesc'),
      action: () => navigate('/privacy-policy'),
    },
    {
      icon: Smartphone,
      title: t('settingsUsageAccess'),
      desc: t('settingsUsageAccessDesc'),
      action: () => navigate('/usage-access'),
    },
  ];

  return (
    <div className="max-w-md mx-auto px-5 pt-6 pb-20">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-1">{t('settingsTitle')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('settingsDesc')}</p>

      <div className="space-y-2 mb-8">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={i}>
              <button
                onClick={item.action}
                className="w-full flex items-center gap-3 rounded-xl bg-[#1A0533]/40 border border-[#2D1B69]/50 px-4 py-3.5 hover:border-[#FF2D78]/30 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2D1B69]/60 flex items-center justify-center text-[#FF6EC7] shrink-0">
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs truncate">{item.desc}</p>
                </div>
                {item.actionLabel ? (
                  <span className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider text-[#00D4FF] border border-[#00D4FF]/30">
                    {item.actionLabel}
                  </span>
                ) : (
                  <ChevronRight className="text-gray-600 shrink-0" size={18} />
                )}
              </button>

              {item.id === 'lang' && showLangGrid && (
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#1A0533]/20 border border-[#2D1B69]/30 mt-1 animate-fadeIn">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                      }}
                      className={`flex flex-col items-start px-3 py-2.5 rounded-xl border transition-all text-left ${
                        lang === l.code
                          ? 'bg-[#FF2D78]/20 border-[#FF2D78] text-white shadow-[0_0_10px_rgba(255,45,120,0.3)]'
                          : 'bg-[#1A0533]/40 border-[#2D1B69]/60 text-gray-400 hover:border-[#FF2D78]/30 hover:text-white'
                      }`}
                    >
                      <span className="font-bold text-sm">{l.nativeName}</span>
                      <span className="text-gray-500 text-xs font-medium">{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Test Customization Section */}
      <div className="mb-8">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3 px-1">
          {t('testSettingsTitle')}
        </h3>
        
        <div className="space-y-4 rounded-2xl bg-[#1A0533]/40 border border-[#2D1B69]/50 p-4">
          
          {/* Math Questions Count Setting */}
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-white font-bold text-sm">{t('testMathQuestionsCount')}</p>
                <p className="text-gray-500 text-xs leading-normal mt-0.5">{t('testMathQuestionsCountDesc')}</p>
              </div>
              <span className="text-[#00D4FF] font-black text-xs px-2.5 py-1 bg-[#00D4FF]/10 rounded-lg border border-[#00D4FF]/20 uppercase">
                {mathCount} {mathCount === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            
            <div className="grid grid-cols-5 gap-2 mt-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleMathCountChange(num)}
                  className={`py-2 rounded-xl text-sm font-black border transition-all ${
                    mathCount === num
                      ? 'bg-[#FF2D78]/20 border-[#FF2D78] text-white shadow-[0_0_10px_rgba(255,45,120,0.3)]'
                      : 'bg-[#1A0533]/40 border-[#2D1B69]/60 text-gray-400 hover:border-[#FF2D78]/30 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-[#2D1B69]/30 my-4" />

          {/* Enable Hold Test Setting */}
          <div className="flex items-center justify-between">
            <div className="pr-4">
              <p className="text-white font-bold text-sm">{t('testEnableHold')}</p>
              <p className="text-gray-500 text-xs leading-normal mt-0.5">{t('testEnableHoldDesc')}</p>
            </div>
            <button
              type="button"
              onClick={() => handleEnableHoldChange(!enableHold)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enableHold ? 'bg-[#FF2D78]' : 'bg-gray-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  enableHold ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-[#2D1B69]/30 my-4" />

          {/* Enable Emergency SOS Setting */}
          <div className="flex items-center justify-between">
            <div className="pr-4">
              <p className="text-white font-bold text-sm">{t('testEmergencySos')}</p>
              <p className="text-gray-500 text-xs leading-normal mt-0.5">{t('testEmergencySosDesc')}</p>
            </div>
            <button
              type="button"
              onClick={() => handleEnableEmergencySosChange(!enableEmergencySos)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enableEmergencySos ? 'bg-[#FF2D78]' : 'bg-gray-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  enableEmergencySos ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {enableEmergencySos && (
            <div className="mt-4 p-4 rounded-xl bg-[#1A0533]/40 border border-[#2D1B69]/60 space-y-3 animate-fadeIn">
              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User size={13} className="text-[#FF2D78]" />
                  {t('sosContactNameLabel')}
                </label>
                <input
                  type="text"
                  value={sosContactName}
                  onChange={(e) => handleSosContactNameChange(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#0A0A0F]/80 border border-[#2D1B69]/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF2D78] transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone size={13} className="text-[#FF2D78]" />
                  {t('sosContactPhoneLabel')}
                </label>
                <input
                  type="tel"
                  value={sosContactPhone}
                  onChange={(e) => handleSosContactPhoneChange(e.target.value)}
                  placeholder="+380991234567"
                  className="w-full bg-[#0A0A0F]/80 border border-[#2D1B69]/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF2D78] transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-[#FF2D78]" />
                  {t('sosMessageLabel')}
                </label>
                <textarea
                  value={sosMessage}
                  onChange={(e) => handleSosMessageChange(e.target.value)}
                  placeholder={t('sosMessagePlaceholder')}
                  rows={2}
                  className="w-full bg-[#0A0A0F]/80 border border-[#2D1B69]/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#FF2D78] transition-colors resize-none"
                />
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="rounded-xl bg-[#1A0533]/30 border border-[#2D1B69]/40 p-4 flex items-start gap-3">
        <Info className="text-[#00D4FF] shrink-0 mt-0.5" size={16} />
        <div>
          <p className="text-white text-xs font-bold mb-1">{t('appTitle')}</p>
          <p className="text-gray-500 text-xs leading-relaxed">{t('settingsAboutDesc')}</p>
        </div>
      </div>
    </div>
  );
}