const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ list:async()=>[], filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

import { useLang } from '@/lib/i18n';

export default function Log() {
  const { t } = useLang();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await db.entities.AccessAttemptLog.list('-attemptTimestamp', 50);
        setLogs(list || []);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, []);

  const fmtDate = (ts) => {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return ts;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-[#2D1B69] border-t-[#FF2D78] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <h1 className="text-2xl font-black uppercase tracking-tight text-white mb-1">{t('logTitle')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('logDesc')}</p>

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2D1B69] p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1A0533] border border-[#2D1B69] mb-4">
            <ShieldCheck className="text-gray-600" size={24} />
          </div>
          <p className="text-white font-bold text-sm mb-1">{t('noLogs')}</p>
          <p className="text-gray-600 text-xs max-w-xs mx-auto">{t('noLogsDesc')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const passed = log.testPassed;
            return (
              <div
                key={log.id}
                className={`rounded-xl border p-4 ${
                  passed
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-[#FF2D78]/5 border-[#FF2D78]/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {passed ? (
                      <ShieldCheck className="text-green-400 shrink-0" size={18} />
                    ) : (
                      <ShieldAlert className="text-[#FF2D78] shrink-0" size={18} />
                    )}
                    <div>
                      <p className="text-white text-sm font-bold">
                        {log.attemptedAction === 'deactivate'
                          ? t('attemptedDeactivate')
                          : log.attemptedAction.includes('SOS')
                          ? log.attemptedAction
                          : t('attemptedContact')}
                      </p>
                      <p className="text-gray-600 text-xs flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {fmtDate(log.attemptTimestamp)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${
                      passed
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-[#FF2D78]/10 text-[#FF2D78]'
                    }`}
                  >
                    {passed ? t('resultPassed') : t('resultFailed')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}