const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ list:async()=>[], filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, Timer } from 'lucide-react';

import { useLang } from '@/lib/i18n';
import NeonButton from '@/components/NeonButton';
import MathChallenge from '@/components/MathChallenge';
import SteadyHoldTest from '@/components/SteadyHoldTest';

const COOLDOWN_SECONDS = 30;

export default function SobrietyTest() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const action = params.get('action') || 'contact';

  const mathCount = parseInt(localStorage.getItem('b44_test_math_count') || '3', 10);
  const enableHold = localStorage.getItem('b44_test_enable_hold') !== 'false';

  const [phase, setPhase] = useState('math');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const [revealedContacts, setRevealedContacts] = useState([]);
  const [deactivated, setDeactivated] = useState(false);
  const loggedRef = useRef(false);

  const logAttempt = useCallback(
    async (passed) => {
      if (loggedRef.current) return;
      loggedRef.current = true;
      try {
        await db.entities.AccessAttemptLog.create({
          attemptedAction: action,
          attemptTimestamp: new Date().toISOString(),
          testPassed: passed,
        });
      } catch (e) {
        console.error(e);
      }
    },
    [action],
  );

  const handleMathResult = (correct) => {
    if (correct) {
      if (currentQuestion < mathCount) {
        setCurrentQuestion((q) => q + 1);
      } else {
        if (enableHold) {
          setPhase('balance');
        } else {
          logAttempt(true);
          setPhase('passed');
        }
      }
    } else {
      logAttempt(false);
      setPhase('failed');
    }
  };

  const handleBalancePass = () => {
    logAttempt(true);
    setPhase('passed');
  };

  const handleAction = async () => {
    if (action === 'deactivate') {
      try {
        const sessions = await db.entities.PartySession.filter({ isActive: true });
        if (sessions.length > 0) {
          await db.entities.PartySession.update(sessions[0].id, { isActive: false });
        }
      } catch (e) {
        console.error(e);
      }
      setDeactivated(true);
    } else {
      try {
        const list = await db.entities.HiddenContact.list('-created_date', 50);
        setRevealedContacts(list || []);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (phase === 'passed' && !deactivated && action === 'deactivate') {
      handleAction();
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'cooldown') return;
    setCooldown(COOLDOWN_SECONDS);
    const interval = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          loggedRef.current = false;
          setCurrentQuestion(1);
          setPhase('math');
          return COOLDOWN_SECONDS;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  if (phase === 'math') {
    const dynamicDesc = (() => {
      if (lang === 'uk') {
        const tasksWord = mathCount === 1 ? 'задачу' : (mathCount < 5 ? 'задачі' : 'задач');
        return `Доведи, що ти тверезий. Розв'яжи ${mathCount} ${tasksWord} з математики${enableHold ? ' + твереза рука' : ''}.`;
      }
      const tasksWord = mathCount === 1 ? 'task' : 'tasks';
      return `Prove you're not drunk. Solve ${mathCount} math ${tasksWord}${enableHold ? ' + hold steady' : ''}.`;
    })();

    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-6 py-10">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#FF2D78] text-center mb-2"
            style={{ textShadow: '0 0 12px rgba(255,45,120,0.4)' }}>
            {t('sobrietyTitle')}
          </h1>
          <p className="text-gray-500 text-sm text-center mb-10">{dynamicDesc}</p>
          <MathChallenge
            key={currentQuestion}
            questionNumber={currentQuestion}
            total={mathCount}
            onResult={handleMathResult}
          />
        </div>
      </div>
    );
  }

  if (phase === 'balance') {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-6 py-10">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#00D4FF] text-center mb-2"
            style={{ textShadow: '0 0 12px rgba(0,212,255,0.4)' }}>
            {t('balanceTest')}
          </h1>
          <p className="text-gray-500 text-sm text-center mb-10">{t('balanceInstr')}</p>
          <SteadyHoldTest onPass={handleBalancePass} />
        </div>
      </div>
    );
  }

  if (phase === 'passed') {
    if (action === 'deactivate' && !deactivated) {
      return (
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-6">
          <div className="w-8 h-8 border-4 border-[#2D1B69] border-t-[#FF2D78] rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-400 mb-6">
            <CheckCircle className="text-green-400" size={36} />
          </div>
          <h1 className="text-3xl font-black uppercase text-green-400 mb-3">{t('passed')}</h1>
          <p className="text-gray-400 text-sm mb-8">
            {action === 'deactivate'
              ? t('deactivated')
              : action === 'app'
                ? t('passedAppAccess')
                : t('passedContactReveal')}
          </p>

          {action === 'contact' && revealedContacts.length > 0 && (
            <div className="space-y-2 mb-8 text-left">
              {revealedContacts.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl bg-[#1A0533]/60 border border-[#00D4FF]/20 px-4 py-3"
                >
                  <div className="w-10 h-10 rounded-full bg-[#2D1B69] flex items-center justify-center text-[#00D4FF] font-black">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{c.name}</p>
                    <p className="text-[#00D4FF] text-sm font-mono">{c.phoneNumber}</p>
                  </div>
                  <Eye className="text-[#00D4FF]/50" size={16} />
                </div>
              ))}
            </div>
          )}

          <NeonButton
            variant="blue"
            className="w-full"
            onClick={() => navigate(action === 'deactivate' ? '/' : '/party-mode')}
          >
            {t('done')}
          </NeonButton>
        </div>
      </div>
    );
  }

  if (phase === 'failed') {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FF2D78]/10 border-2 border-[#FF2D78] mb-6">
            <XCircle className="text-[#FF2D78]" size={36} />
          </div>
          <h1 className="text-3xl font-black uppercase text-[#FF2D78] mb-3"
            style={{ textShadow: '0 0 12px rgba(255,45,120,0.4)' }}>
            {t('failed')}
          </h1>
          <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">{t('failedDesc')}</p>

          <div className="inline-flex items-center gap-2 text-gray-500 text-sm mb-6">
            <Timer size={16} />
            <span>{t('retryIn')} {cooldown}{t('seconds')}</span>
          </div>

          <div>
            <NeonButton
              variant="ghost"
              className="w-full"
              disabled={cooldown > 0}
              onClick={() => {
                loggedRef.current = false;
                setCurrentQuestion(1);
                setPhase('math');
              }}
            >
              {t('retry')}
            </NeonButton>
          </div>

          <button
            className="mt-6 text-gray-600 text-xs uppercase tracking-wider hover:text-gray-400 transition-colors"
            onClick={() => navigate('/party-mode')}
          >
            {t('goBackToSafety')}
          </button>
        </div>
      </div>
    );
  }

  return null;
}