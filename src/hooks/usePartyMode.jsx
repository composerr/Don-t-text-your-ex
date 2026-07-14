import { useState, useEffect, useCallback } from 'react';
import { useBlockedApps } from '@/lib/useBlockedApps';

const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ list:async()=>[], filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export function usePartyMode() {
  const [isActive, setIsActive] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0); // in milliseconds
  const [timeLeftStr, setTimeLeftStr] = useState('');

  const { apps, enabledApps, toggleApp } = useBlockedApps();

  const checkPartyStatus = useCallback(async () => {
    try {
      const sessions = await db.entities.PartySession.filter({ isActive: true });
      if (sessions.length > 0) {
        const s = sessions[0];
        const endsAtTime = new Date(s.endsAt).getTime();
        const now = Date.now();
        if (endsAtTime > now) {
          setSession(s);
          setIsActive(true);
          setTimeLeft(endsAtTime - now);
          return s;
        } else {
          // Deactivate if expired
          await db.entities.PartySession.update(s.id, { isActive: false });
          setIsActive(false);
          setSession(null);
          setTimeLeft(0);
        }
      } else {
        setIsActive(false);
        setSession(null);
        setTimeLeft(0);
      }
    } catch (e) {
      console.error("Error checking party session:", e);
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  // Poll for status or update countdown
  useEffect(() => {
    checkPartyStatus();
    
    // Set interval for countdown updates
    const interval = setInterval(() => {
      const storedSessionActive = localStorage.getItem('b44_party_sessions');
      
      // Fast check to see if we should update or pull from DB
      if (isActive && session) {
        const endsAtTime = new Date(session.endsAt).getTime();
        const now = Date.now();
        const diff = endsAtTime - now;
        if (diff <= 0) {
          checkPartyStatus();
        } else {
          setTimeLeft(diff);
          const hours = Math.floor(diff / 3600000);
          const mins = Math.floor((diff % 3600000) / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          const hrsStr = hours > 0 ? `${hours}h ` : '';
          const minsStr = mins < 10 && hours > 0 ? `0${mins}` : mins;
          const secsStr = secs < 10 ? `0${secs}` : secs;
          setTimeLeftStr(`${hrsStr}${minsStr}m ${secsStr}s`);
        }
      } else {
        setTimeLeftStr('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, session, checkPartyStatus]);

  const startParty = useCallback(async (durationHours) => {
    setLoading(true);
    try {
      const now = new Date();
      const ends = new Date(now.getTime() + durationHours * 3600000);
      const newSession = await db.entities.PartySession.create({
        startTimestamp: now.toISOString(),
        durationHours,
        isActive: true,
        endsAt: ends.toISOString(),
      });
      setSession(newSession);
      setIsActive(true);
      setTimeLeft(durationHours * 3600000);
      return newSession;
    } catch (e) {
      console.error("Error starting party mode:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const endParty = useCallback(async () => {
    setLoading(true);
    try {
      if (session) {
        await db.entities.PartySession.update(session.id, { isActive: false });
      } else {
        // Fallback check
        const sessions = await db.entities.PartySession.filter({ isActive: true });
        for (const s of sessions) {
          await db.entities.PartySession.update(s.id, { isActive: false });
        }
      }
      setIsActive(false);
      setSession(null);
      setTimeLeft(0);
      setTimeLeftStr('');
    } catch (e) {
      console.error("Error ending party mode:", e);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const isAppBlocked = useCallback((packageName) => {
    if (!isActive) return false;
    return enabledApps.some(app => app.packageName.toLowerCase() === packageName.toLowerCase());
  }, [isActive, enabledApps]);

  const toggleAppBlock = useCallback((id) => {
    if (!isActive) {
      toggleApp(id);
    } else {
      console.warn("Cannot modify blocked apps while Party Mode is active!");
    }
  }, [isActive, toggleApp]);

  return {
    isActive,
    session,
    loading,
    timeLeft,
    timeLeftStr,
    checkPartyStatus,
    startParty,
    endParty,
    blockedApps: enabledApps,
    allApps: apps,
    isAppBlocked,
    toggleAppBlock,
  };
}
