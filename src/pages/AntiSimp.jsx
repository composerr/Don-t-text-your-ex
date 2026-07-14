import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Ban, ArrowLeft } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import NeonButton from '@/components/NeonButton';

export default function AntiSimp() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const action = params.get('action') || 'contact';
  const [msgIndex, setMsgIndex] = useState(0);
  const messages = t('antiSimpMessages');

  useEffect(() => {
    setMsgIndex(Math.floor(Math.random() * messages.length));
  }, [messages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#FF2D78]/10 border-2 border-[#FF2D78] mb-8 animate-pulse"
          style={{ boxShadow: '0 0 30px rgba(255,45,120,0.3)' }}
        >
          <Ban className="text-[#FF2D78]" size={44} />
        </div>

        <h1
          className="text-4xl font-black uppercase tracking-tight text-[#FF2D78] mb-8"
          style={{ textShadow: '0 0 20px rgba(255,45,120,0.5)' }}
        >
          {t('antiSimpTitle')}
        </h1>

        <div className="min-h-[120px] flex items-center justify-center mb-10">
          <p
            key={msgIndex}
            className="text-white text-lg font-medium leading-relaxed transition-opacity duration-300"
            style={{ textShadow: '0 0 10px rgba(255,255,255,0.1)' }}
          >
            {messages[msgIndex]}
          </p>
        </div>

        <div className="space-y-3">
          <NeonButton
            variant="pink"
            className="w-full py-4"
            onClick={() => navigate(`/sobriety-test?action=${action}`)}
          >
            {t('takeSobrietyTest')}
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