const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ list:async()=>[], filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Shield, X } from 'lucide-react';

import { useLang } from '@/lib/i18n';
import NeonButton from '@/components/NeonButton';

export default function Vault() {
  const { t } = useLang();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phoneNumber: '', originalNotes: '' });
  const [saving, setSaving] = useState(false);
  const [isPartyModeActive, setIsPartyModeActive] = useState(false);

  const load = async () => {
    try {
      const [list, sessions] = await Promise.all([
        db.entities.HiddenContact.list('-created_date', 50),
        db.entities.PartySession.filter({ isActive: true })
      ]);
      setContacts(list || []);
      const active = sessions.length > 0 && new Date(sessions[0].endsAt) > new Date();
      setIsPartyModeActive(active);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.name.trim() || !form.phoneNumber.trim()) return;
    setSaving(true);
    try {
      await db.entities.HiddenContact.create({
        name: form.name.trim(),
        phoneNumber: form.phoneNumber.trim(),
        originalNotes: form.originalNotes.trim(),
        hiddenAtTimestamp: new Date().toISOString(),
      });
      setForm({ name: '', phoneNumber: '', originalNotes: '' });
      setShowForm(false);
      await load();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleRemove = async (id) => {
    if (isPartyModeActive) return;
    try {
      await db.entities.HiddenContact.delete(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
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
      <div className="flex items-center gap-2 mb-1">
        <Shield className="text-[#FF2D78]" size={20} />
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">{t('vaultTitle')}</h1>
      </div>
      <p className="text-gray-500 text-sm mb-6">{t('vaultDesc')}</p>

      {isPartyModeActive && (
        <div className="mb-4 rounded-xl border border-[#FF2D78]/30 bg-[#FF2D78]/10 px-4 py-3 text-xs text-[#FF6EC7] font-bold leading-normal flex items-start gap-2.5">
          <Shield className="shrink-0 text-[#FF2D78] mt-0.5" size={14} />
          <span>{t('cannotDeleteContacts')}</span>
        </div>
      )}

      {contacts.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-dashed border-[#2D1B69] p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#1A0533] border border-[#2D1B69] mb-4">
            <Shield className="text-gray-600" size={24} />
          </div>
          <p className="text-white font-bold text-sm mb-1">{t('emptyVault')}</p>
          <p className="text-gray-600 text-xs mb-6 max-w-xs mx-auto">{t('emptyVaultDesc')}</p>
          <NeonButton variant="pink" onClick={() => setShowForm(true)}>
            <Plus size={16} className="inline mr-1" /> {t('addContact')}
          </NeonButton>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-xl bg-[#1A0533]/40 border border-[#2D1B69]/50 px-4 py-3"
              >
                <div className="w-10 h-10 rounded-full bg-[#2D1B69] flex items-center justify-center text-[#FF6EC7] font-black">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm truncate">{c.name}</p>
                  <p className="text-gray-600 text-xs font-mono">••••••••••</p>
                </div>
                <button
                  onClick={() => !isPartyModeActive && handleRemove(c.id)}
                  disabled={isPartyModeActive}
                  className={`p-2 rounded-lg transition-colors ${
                    isPartyModeActive
                      ? 'text-gray-800 cursor-not-allowed opacity-30'
                      : 'text-gray-600 hover:text-red-400 hover:bg-red-500/10'
                  }`}
                  title={isPartyModeActive ? t('cannotDeleteContacts') : ''}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {!showForm ? (
            <NeonButton variant="purple" className="w-full" onClick={() => setShowForm(true)}>
              <Plus size={16} className="inline mr-1" /> {t('addContact')}
            </NeonButton>
          ) : (
            <div className="rounded-2xl bg-[#1A0533]/60 border border-[#FF2D78]/30 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#FF2D78]">{t('addContact')}</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">{t('contactName')}</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#0A0A0F] border border-[#2D1B69] rounded-lg px-4 py-3 text-white text-sm focus:border-[#FF2D78] focus:outline-none transition-colors"
                  placeholder="..."
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">{t('contactPhone')}</label>
                <input
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  className="w-full bg-[#0A0A0F] border border-[#2D1B69] rounded-lg px-4 py-3 text-white text-sm font-mono focus:border-[#FF2D78] focus:outline-none transition-colors"
                  placeholder="+380..."
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">{t('contactNotes')}</label>
                <textarea
                  value={form.originalNotes}
                  onChange={(e) => setForm({ ...form, originalNotes: e.target.value })}
                  rows={2}
                  className="w-full bg-[#0A0A0F] border border-[#2D1B69] rounded-lg px-4 py-3 text-white text-sm focus:border-[#FF2D78] focus:outline-none transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3">
                <NeonButton variant="ghost" className="flex-1" onClick={() => setShowForm(false)}>{t('cancel')}</NeonButton>
                <NeonButton variant="pink" className="flex-1" onClick={handleSave} disabled={saving || !form.name.trim() || !form.phoneNumber.trim()}>
                  {t('save')}
                </NeonButton>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}