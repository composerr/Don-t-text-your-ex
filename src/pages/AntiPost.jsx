import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertOctagon, ArrowLeft } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { getGuardedApp } from '@/lib/guardedApps';
import NeonButton from '@/components/NeonButton';

export default function AntiPost() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const appId = params.get('app') || 'generic';
  const app = getGuardedApp(appId);

  const messageKey = `antiPost${appId.charAt(0).toUpperCase()}${appId.slice(1)}`;
  const message = t(messageKey) !== messageKey ? t(messageKey) : t('antiPostGeneric');

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500 mb-8 animate-pulse"
          style={{ boxShadow: '0 0 30px rgba(239,68,68,0.4)' }}
        >
          <AlertOctagon className="text-red-500" size={44} />
        </div>

        {app && (
          <div className="mb-6">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-2 font-black text-xl text-white"
              style={{ backgroundColor: app.color }}
            >
              {app.icon}
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-wider">{app.name}</p>
          </div>
        )}

        <h1
          className="text-3xl font-black uppercase tracking-tight text-red-500 mb-8"
          style={{ textShadow: '0 0 20px rgba(239,68,68,0.5)' }}
        >
          {t('antiPostTitle')}
        </h1>

        <div className="min-h-[120px] flex items-center justify-center mb-10">
          <p className="text-white text-base font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <div className="space-y-3">
          <NeonButton
            variant="pink"
            className="w-full py-4"
            onClick={() => navigate(`/sobriety-test?action=app&app=${appId}`)}
          >
            {t('passSobrietyTest')}
          </NeonButton>
          <NeonButton
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/party-mode')}
          >
            <ArrowLeft size={16} className="inline mr-2" /> {t('goBackToSafety')}
          </NeonButton>
        </div>
      </div>
    </div>
  );
}