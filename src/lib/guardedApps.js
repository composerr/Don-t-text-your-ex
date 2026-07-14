const DEFAULT_APPS = [
  { id: 'facebook', name: 'Facebook', packageName: 'com.facebook.katana', color: '#1877F2', icon: 'F' },
  { id: 'instagram', name: 'Instagram', packageName: 'com.instagram.android', color: '#E4405F', icon: 'I' },
  { id: 'telegram', name: 'Telegram', packageName: 'org.telegram.messenger', color: '#0088CC', icon: 'T' },
  { id: 'whatsapp', name: 'WhatsApp', packageName: 'com.whatsapp', color: '#25D366', icon: 'W' },
];

export const guardedApps = DEFAULT_APPS;

export function getGuardedApp(id) {
  const found = DEFAULT_APPS.find((app) => app.id === id);
  if (found) return found;

  try {
    const stored = localStorage.getItem('dtye_blocked_apps');
    if (stored) {
      const apps = JSON.parse(stored);
      return apps.find((app) => app.id === id);
    }
  } catch { /* noop */ }
  return null;
}