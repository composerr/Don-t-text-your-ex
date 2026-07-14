import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Plus, Trash2, X, Shield } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { useBlockedApps } from '@/lib/useBlockedApps';
import { usePartyMode } from '@/hooks/usePartyMode';
import NeonButton from '@/components/NeonButton';

const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ list:async()=>[], filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

const POPULAR_APPS = [
  { id: 'tiktok', name: 'TikTok', nameEn: 'TikTok', nameUk: 'TikTok', packageName: 'com.zhiliaoapp.musically', color: '#010101' },
  { id: 'viber', name: 'Viber', nameEn: 'Viber', nameUk: 'Viber', packageName: 'com.viber.voip', color: '#7360F2' },
  { id: 'discord', name: 'Discord', nameEn: 'Discord', nameUk: 'Discord', packageName: 'com.discord', color: '#5865F2' },
  { id: 'twitter', name: 'X / Twitter', nameEn: 'X / Twitter', nameUk: 'X / Twitter', packageName: 'com.twitter.android', color: '#000000' },
  { id: 'youtube', name: 'YouTube', nameEn: 'YouTube', nameUk: 'YouTube', packageName: 'com.google.android.youtube', color: '#FF0000' },
  { id: 'snapchat', name: 'Snapchat', nameEn: 'Snapchat', nameUk: 'Snapchat', packageName: 'com.snapchat.android', color: '#FFFC00' },
  { id: 'reddit', name: 'Reddit', nameEn: 'Reddit', nameUk: 'Reddit', packageName: 'com.reddit.frontpage', color: '#FF4500' },
  { id: 'signal', name: 'Signal', nameEn: 'Signal', nameUk: 'Signal', packageName: 'org.thoughtcrime.securesms', color: '#3A76F0' },
  { id: 'slack', name: 'Slack', nameEn: 'Slack', nameUk: 'Slack', packageName: 'com.Slack', color: '#4A154B' },
  { id: 'skype', name: 'Skype', nameEn: 'Skype', nameUk: 'Skype', packageName: 'com.skype.raider', color: '#00AFF0' },
  { id: 'messenger', name: 'Messenger', nameEn: 'Facebook Messenger', nameUk: 'Facebook Messenger', packageName: 'com.facebook.orca', color: '#0084FF' },
  { id: 'pinterest', name: 'Pinterest', nameEn: 'Pinterest', nameUk: 'Pinterest', packageName: 'com.pinterest', color: '#E60023' },
  { id: 'linkedin', name: 'LinkedIn', nameEn: 'LinkedIn', nameUk: 'LinkedIn', packageName: 'com.linkedin.android', color: '#0A66C2' },
  { id: 'threads', name: 'Threads', nameEn: 'Threads', nameUk: 'Threads', packageName: 'com.instagram.barcelona', color: '#000000' },
  { id: 'tinder', name: 'Tinder', nameEn: 'Tinder', nameUk: 'Tinder', packageName: 'com.tinder', color: '#FF4458' },
  { id: 'badoo', name: 'Badoo', nameEn: 'Badoo', nameUk: 'Badoo', packageName: 'com.badoo.mobile', color: '#782AF6' },
  { id: 'bereal', name: 'BeReal', nameEn: 'BeReal', nameUk: 'BeReal', packageName: 'com.bereal.ft', color: '#000000' },
  { id: 'facebook', name: 'Facebook', nameEn: 'Facebook', nameUk: 'Facebook', packageName: 'com.facebook.katana', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', nameEn: 'Instagram', nameUk: 'Instagram', packageName: 'com.instagram.android', color: '#E4405F' },
  { id: 'telegram', name: 'Telegram', nameEn: 'Telegram', nameUk: 'Telegram', packageName: 'org.telegram.messenger', color: '#0088CC' },
  { id: 'whatsapp', name: 'WhatsApp', nameEn: 'WhatsApp', nameUk: 'WhatsApp', packageName: 'com.whatsapp', color: '#25D366' },
];

export default function BlockedApps() {
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const { apps, toggleApp, addCustomApp, removeApp } = useBlockedApps();
  const { isActive: isPartyModeActive } = usePartyMode();
  const [showForm, setShowForm] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState('custom');
  const [name, setName] = useState('');

  // Transliterate Ukrainian to Latin and sanitize for package name
  const getGeneratedPackage = (appName) => {
    let cleanName = appName.toLowerCase().trim()
      .replace(/[а-яіїєґ]/g, (char) => {
        const trans = {
          'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','є':'ye','ж':'zh','з':'z','и':'y','і':'i','ї':'yi','й':'y',
          'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts',
          'ч':'ch','ш':'sh','щ':'shch','ь':'','ю':'yu','я':'ya'
        };
        return trans[char] || '';
      })
      .replace(/[^a-z0-9]/g, '');
    if (!cleanName) {
      return '';
    }
    return 'com.custom.' + cleanName;
  };

  const sortedPopularApps = [...POPULAR_APPS].sort((a, b) => {
    const nameA = lang === 'uk' ? a.nameUk : a.nameEn;
    const nameB = lang === 'uk' ? b.nameUk : b.nameEn;
    return nameA.localeCompare(nameB, lang);
  });

  const selectedPopularApp = POPULAR_APPS.find(app => app.id === selectedAppId);

  // Determine current package name and app name
  const currentPackageName = selectedPopularApp 
    ? selectedPopularApp.packageName 
    : getGeneratedPackage(name);

  const currentAppName = selectedPopularApp 
    ? (lang === 'uk' ? selectedPopularApp.nameUk : selectedPopularApp.nameEn) 
    : name.trim();

  const isAlreadyBlocked = apps.some(app => app.packageName.toLowerCase() === currentPackageName.toLowerCase() && currentPackageName !== '');

  const handleAdd = () => {
    if (selectedAppId === 'custom') {
      if (!name.trim()) return;
      const pkg = currentPackageName || `com.custom.app_${Date.now()}`;
      addCustomApp(name.trim(), pkg);
      setName('');
      setShowForm(false);
    } else {
      if (!selectedPopularApp) return;
      const appName = lang === 'uk' ? selectedPopularApp.nameUk : selectedPopularApp.nameEn;
      addCustomApp(appName, selectedPopularApp.packageName, selectedPopularApp.color);
      setSelectedAppId('custom');
      setShowForm(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <div className="flex items-center gap-2 mb-1">
        <Smartphone className="text-[#FF2D78]" size={20} />
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">{t('blockedAppsPageTitle')}</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">{t('blockedAppsPageDesc')}</p>

      {isPartyModeActive && (
        <div className="mb-4 rounded-xl border border-[#FF2D78]/30 bg-[#FF2D78]/10 px-4 py-3 text-xs text-[#FF6EC7] font-bold leading-normal flex items-start gap-2.5">
          <Shield className="shrink-0 text-[#FF2D78] mt-0.5" size={14} />
          <span>{t('cannotModifyApps')}</span>
        </div>
      )}

      <div className="space-y-2 mb-6">
        {apps.map((app) => (
          <div
            key={app.id}
            className="flex items-center gap-3 rounded-xl bg-[#1A0533]/40 border border-[#2D1B69]/50 px-4 py-3"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black shrink-0"
              style={{ backgroundColor: app.color }}
            >
              {app.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">{app.name}</p>
              <p className="text-gray-600 text-xs font-mono truncate">{app.packageName}</p>
            </div>
            {app.custom && (
              <button
                onClick={() => !isPartyModeActive && removeApp(app.id)}
                disabled={isPartyModeActive}
                className={`p-2 rounded-lg transition-colors ${
                  isPartyModeActive
                    ? 'text-gray-800 cursor-not-allowed opacity-30'
                    : 'text-gray-600 hover:text-red-400 hover:bg-red-500/10'
                }`}
                title={isPartyModeActive ? t('cannotModifyApps') : ''}
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={() => !isPartyModeActive && toggleApp(app.id)}
              disabled={isPartyModeActive}
              className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
                isPartyModeActive
                  ? 'bg-gray-800/30 cursor-not-allowed opacity-40'
                  : app.enabled ? 'bg-[#FF2D78]' : 'bg-[#2D1B69]'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  app.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <NeonButton 
          variant="purple" 
          className="w-full" 
          onClick={() => !isPartyModeActive && setShowForm(true)}
          disabled={isPartyModeActive}
        >
          <Plus size={16} className="inline mr-1" /> {t('addCustomApp')}
        </NeonButton>
      ) : (
        <div className="rounded-2xl bg-[#1A0533]/60 border border-[#FF2D78]/30 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#FF2D78]">{t('addCustomApp')}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">
              {lang === 'uk' ? 'Оберіть додаток' : 'Select app'}
            </label>
            <select
              value={selectedAppId}
              onChange={(e) => {
                setSelectedAppId(e.target.value);
                setName('');
              }}
              className="w-full bg-[#0A0A0F] border border-[#2D1B69] rounded-lg px-4 py-3 text-white text-sm focus:border-[#FF2D78] focus:outline-none transition-colors cursor-pointer"
            >
              <option value="custom" className="bg-[#0A0A0F]">
                {lang === 'uk' ? '✍️ Інший додаток (ввести назву)...' : '✍️ Other app (enter name)...'}
              </option>
              {sortedPopularApps.map((app) => (
                <option key={app.id} value={app.id} className="bg-[#0A0A0F]">
                  {lang === 'uk' ? app.nameUk : app.nameEn}
                </option>
              ))}
            </select>
          </div>

          {selectedAppId === 'custom' ? (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">
                {lang === 'uk' ? 'Назва додатка' : 'App Name'}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0A0A0F] border border-[#2D1B69] rounded-lg px-4 py-3 text-white text-sm focus:border-[#FF2D78] focus:outline-none transition-colors"
                placeholder={lang === 'uk' ? 'Напр. Tinder чи інший' : 'e.g. Tinder or other'}
              />

              {name.trim() && (
                <div className="rounded-xl bg-[#0A0A0F]/80 border border-[#2D1B69]/30 p-3 flex items-center gap-3 mt-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black shrink-0 bg-[#FF2D78] text-xs"
                  >
                    {name.trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-xs truncate">{name.trim()}</p>
                    <p className="text-gray-600 text-[10px] font-mono truncate">{currentPackageName}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold px-1.5 py-0.5 rounded bg-[#2D1B69]/30 border border-[#2D1B69]/50 uppercase tracking-wider">
                    {lang === 'uk' ? 'Прев\'ю' : 'Preview'}
                  </div>
                </div>
              )}
            </div>
          ) : (
            selectedPopularApp && (
              <div className="rounded-xl bg-[#0A0A0F]/80 border border-[#2D1B69]/30 p-3 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black shrink-0 text-xs"
                  style={{ backgroundColor: selectedPopularApp.color }}
                >
                  {selectedPopularApp.nameEn.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-xs truncate">
                    {lang === 'uk' ? selectedPopularApp.nameUk : selectedPopularApp.nameEn}
                  </p>
                  <p className="text-gray-600 text-[10px] font-mono truncate">{selectedPopularApp.packageName}</p>
                </div>
                <div className="text-[10px] text-gray-500 font-bold px-1.5 py-0.5 rounded bg-[#2D1B69]/30 border border-[#2D1B69]/50 uppercase tracking-wider">
                  {lang === 'uk' ? 'Прев\'ю' : 'Preview'}
                </div>
              </div>
            )
          )}

          {isAlreadyBlocked && (
            <p className="text-xs text-[#FF2D78] font-bold mt-1">
              {lang === 'uk' 
                ? '⚠️ Цей додаток вже додано до списку блокування!' 
                : '⚠️ This app is already in the blocked list!'}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <NeonButton variant="ghost" className="flex-1" onClick={() => setShowForm(false)}>{t('cancel')}</NeonButton>
            <NeonButton 
              variant="pink" 
              className="flex-1" 
              onClick={handleAdd} 
              disabled={isAlreadyBlocked || (selectedAppId === 'custom' && !name.trim())}
            >
              {t('addApp')}
            </NeonButton>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl bg-[#1A0533]/30 border border-[#2D1B69]/40 p-4 flex items-start gap-3">
        <Shield className="text-[#00D4FF] shrink-0 mt-0.5" size={16} />
        <p className="text-gray-500 text-xs leading-relaxed">
          {t('blockedAppsNote')}
        </p>
      </div>
    </div>
  );
}
