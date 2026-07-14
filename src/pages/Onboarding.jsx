import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, Brain, MessageSquareWarning } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import NeonButton from '@/components/NeonButton';

export default function Onboarding() {
  const { t } = useLang();
  const navigate = useNavigate();

  const steps = [
    { icon: Shield, title: t('onboardingStep1Title'), desc: t('onboardingStep1Desc'), color: '#FF2D78' },
    { icon: Clock, title: t('onboardingStep2Title'), desc: t('onboardingStep2Desc'), color: '#00D4FF' },
    { icon: Brain, title: t('onboardingStep3Title'), desc: t('onboardingStep3Desc'), color: '#FF6EC7' },
    { icon: MessageSquareWarning, title: t('onboardingStep4Title'), desc: t('onboardingStep4Desc'), color: '#0080FF' },
  ];

  return (
    <div className="max-w-md mx-auto px-5 pt-8 pb-10">
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FF2D78]/10 border-2 border-[#FF2D78] mb-5"
          style={{ boxShadow: '0 0 30px rgba(255,45,120,0.3)' }}
        >
          <Shield className="text-[#FF2D78]" size={32} />
        </div>
        <h1
          className="text-3xl font-black uppercase tracking-tight text-white mb-2"
          style={{ textShadow: '0 0 20px rgba(255,255,255,0.15)' }}
        >
          {t('onboardingTitle')}
        </h1>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">{t('onboardingDesc')}</p>
      </div>

      <div className="space-y-3 mb-10">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className="flex gap-4 rounded-2xl bg-[#1A0533]/40 border border-[#2D1B69]/50 p-4"
            >
              <div
                className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}40` }}
              >
                <Icon size={20} style={{ color: step.color }} />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <NeonButton variant="pink" className="w-full py-4" onClick={() => navigate('/')}>
        {t('getStarted')}
      </NeonButton>
    </div>
  );
}