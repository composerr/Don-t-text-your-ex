import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Shield, ScrollText, Settings, Smartphone } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import PartyModeIndicator from '@/components/PartyModeIndicator';

export default function Layout() {
  const { t } = useLang();
  const location = useLocation();

  const navItems = [
    { to: '/', label: t('navHome'), icon: Home },
    { to: '/vault', label: t('navVault'), icon: Shield },
    { to: '/blocked-apps', label: t('navApps'), icon: Smartphone },
    { to: '/log', label: t('navLog'), icon: ScrollText },
    { to: '/settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
      <header className="flex items-center justify-between px-5 py-3 border-b border-[#2D1B69]/40 sticky top-0 z-40 bg-[#0A0A0F]/90 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <span
            className="text-sm font-black uppercase tracking-[0.15em] text-[#FF2D78]"
            style={{ textShadow: '0 0 12px rgba(255,45,120,0.5)' }}
          >
            {t('appTitle')}
          </span>
        </Link>
        <PartyModeIndicator />
      </header>

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0F]/95 backdrop-blur-md border-t border-[#2D1B69]/50 z-50">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 transition-all',
                  active ? 'text-[#FF2D78]' : 'text-gray-600 hover:text-[#FF6EC7]',
                )}
              >
                <Icon
                  size={20}
                  className={active ? 'drop-shadow-[0_0_8px_#FF2D78]' : ''}
                />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}