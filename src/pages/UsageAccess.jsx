import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Check } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { guardedApps } from '@/lib/guardedApps';
import NeonButton from '@/components/NeonButton';

export default function UsageAccess() {
  const { t } = useLang();
  const navigate = useNavigate();

  const steps = [
    { num: 1, title: t('usageAccessStep1'), desc: t('usageAccessStep1Desc') },
    { num: 2, title: t('usageAccessStep2'), desc: t('usageAccessStep2Desc') },
    { num: 3, title: t('usageAccessStep3'), desc: t('usageAccessStep3Desc') },
    { num: 4, title: t('usageAccessStep4'), desc: t('usageAccessStep4Desc') },
  ];

  return (
    <div className="max-w-md mx-auto px-5 pt-6 pb-10">
      <div className="flex items-center gap-2 mb-1">
        <Settings className="text-[#00D4FF]" size={20} />
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">{t('usageAccessTitle')}</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">{t('usageAccessDesc')}</p>

      <div className="space-y-3 mb-8">
        {steps.map((step) => (
          <div
            key={step.num}
            className="flex gap-4 rounded-2xl bg-[#1A0533]/40 border border-[#2D1B69]/50 p-4"
          >
            <div className="shrink-0 w-8 h-8 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF] font-black text-sm">
              {step.num}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-1">{step.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#1A0533]/40 border border-[#2D1B69]/50 p-5 mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{t('appGuardActive')}</h3>
        <div className="grid grid-cols-2 gap-3">
          {guardedApps.map((app) => (
            <div
              key={app.id}
              className="flex items-center gap-2 rounded-xl bg-[#0A0A0F]/50 border border-[#2D1B69]/30 px-3 py-2"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0"
                style={{ backgroundColor: app.color }}
              >
                {app.icon}
              </div>
              <span className="text-white text-xs font-bold">{app.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <NeonButton variant="blue" className="w-full" onClick={() => navigate('/party-mode')}>
          <Check size={16} className="inline mr-2" /> {t('usageAccessEnabled')}
        </NeonButton>
        <NeonButton variant="ghost" className="w-full" onClick={() => navigate('/party-mode')}>
          {t('usageAccessSkip')}
        </NeonButton>
      </div>
    </div>
  );
}