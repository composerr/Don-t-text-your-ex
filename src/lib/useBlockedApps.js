import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dtye_blocked_apps';

const DEFAULT_APPS = [
  { id: 'facebook', name: 'Facebook', packageName: 'com.facebook.katana', color: '#1877F2', icon: 'F', enabled: true, custom: false },
  { id: 'instagram', name: 'Instagram', packageName: 'com.instagram.android', color: '#E4405F', icon: 'I', enabled: true, custom: false },
  { id: 'telegram', name: 'Telegram', packageName: 'org.telegram.messenger', color: '#0088CC', icon: 'T', enabled: true, custom: false },
  { id: 'whatsapp', name: 'WhatsApp', packageName: 'com.whatsapp', color: '#25D366', icon: 'W', enabled: true, custom: false },
];

export function useBlockedApps() {
  const [apps, setApps] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch { /* noop */ }
    return DEFAULT_APPS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch { /* noop */ }
  }, [apps]);

  const toggleApp = useCallback((id) => {
    setApps((prev) => prev.map((app) => (app.id === id ? { ...app, enabled: !app.enabled } : app)));
  }, []);

  const addCustomApp = useCallback((name, packageName, customColor) => {
    const id = 'custom_' + Date.now();
    const colors = ['#FF2D78', '#00D4FF', '#FF6EC7', '#0080FF'];
    const color = customColor || colors[Math.floor(Math.random() * colors.length)];
    setApps((prev) => [
      ...prev,
      { id, name, packageName, color, icon: name.charAt(0).toUpperCase(), enabled: true, custom: true },
    ]);
  }, []);

  const removeApp = useCallback((id) => {
    setApps((prev) => prev.filter((app) => app.id !== id));
  }, []);

  const enabledApps = apps.filter((app) => app.enabled);

  return { apps, enabledApps, toggleApp, addCustomApp, removeApp };
}