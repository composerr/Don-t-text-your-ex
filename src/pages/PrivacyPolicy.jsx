import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function PrivacyPolicy() {
  const { lang } = useLang();
  const navigate = useNavigate();

  const content = lang === 'uk' ? {
    title: 'Положення про конфіденційність',
    updated: 'Останнє оновлення: липень 2026',
    intro: 'Це Положення про конфіденційність пояснює, як застосунок «Не дзвони колишній» («ми», «нас», «наш») збирає, використовує та захищає ваші дані. Створюючи цей застосунок, ми поставили конфіденційність на перше місце.',
    sections: [
      {
        title: '1. Дані, які ми зберігаємо',
        body: 'Застосунок зберігає лише ті дані, які ви добровільно вводите: імена та номери телефонів контактів, яких ви додаєте до «Сховища», налаштування заблокованих додатків та журнал спроб доступу. Усі дані зберігаються локально у вашому пристрої у зашифрованій базі даних.',
      },
      {
        title: '2. Дані, які ми НЕ збираємо',
        body: 'Ми не збираємо, не передаємо та не продаємо ваші персональні дані стороннім особам. Застосунок не має серверів для зберігання ваших контактів або історії. Ми не використовуємо трекери, рекламні SDK чи аналітику сторонніх постачальників.',
      },
      {
        title: '3. Дозволи',
        body: 'Контакти: використовуються лише для вибору контактів, яких ви хочете захистити. Доступ до даних використання (PACKAGE_USAGE_STATS): використовується для виявлення заблокованих додатків під час активного режиму вечірки. Цей дозвіл не використовується, коли режим вечірки неактивний. Гіроскоп/акселерометр: використовується виключно для тесту на тверезість.',
      },
      {
        title: '4. Відсутність фонового стеження',
        body: 'Застосунок НЕ використовує AccessibilityService, SYSTEM_ALERT_WINDOW (відображення поверх інших додатків) або будь-які інші APIs для перехоплення дотиків чи моніторингу інших додатків. Усі механізми блокування працюють виключно в межах власного інтерфейсу застосунку.',
      },
      {
        title: '5. Локальне зберігання',
        body: 'Усі ваші дані зберігаються локально на вашому пристрої. Ви можете видалити всі дані в будь-який момент, видаливши контакти зі сховища або видалівши застосунок.',
      },
      {
        title: '6. Google Play Policies',
        body: 'Застосунок повністю відповідає політиці Google Play (2025-2026). Ми не використовуємо заборонені фонові служби, не перехоплюємо дотики та не відображаємо вміст поверх інших додатків без явного дозволу користувача.',
      },
      {
        title: '7. Зв\'язок',
        body: 'Якщо у вас є запитання щодо конфіденційності, зв\'яжіться з нами через сторінку підтримки в Google Play Store.',
      },
    ],
  } : {
    title: 'Privacy Policy',
    updated: 'Last updated: July 2026',
    intro: 'This Privacy Policy explains how the "Don\'t Text Your Ex" app ("we", "us", "our") collects, uses, and protects your data. We built this app with privacy as a top priority.',
    sections: [
      {
        title: '1. Data We Store',
        body: 'The app stores only the data you voluntarily enter: names and phone numbers of contacts you add to the Vault, blocked app preferences, and access attempt logs. All data is stored locally on your device in an encrypted database.',
      },
      {
        title: '2. Data We Do NOT Collect',
        body: 'We do not collect, transmit, or sell your personal data to third parties. The app has no servers storing your contacts or history. We do not use trackers, advertising SDKs, or third-party analytics.',
      },
      {
        title: '3. Permissions',
        body: 'Contacts: Used only to select contacts you want to protect. Usage Data Access (PACKAGE_USAGE_STATS): Used to detect blocked apps during an active Party Mode session. This permission is not used when Party Mode is inactive. Gyroscope/Accelerometer: Used exclusively for the sobriety balance test.',
      },
      {
        title: '4. No Background Surveillance',
        body: 'The app does NOT use AccessibilityService, SYSTEM_ALERT_WINDOW (draw over other apps), or any other APIs to intercept touches or monitor other apps. All blocking mechanisms operate strictly within the app\'s own UI sandbox.',
      },
      {
        title: '5. Local Storage',
        body: 'All your data is stored locally on your device. You can delete all data at any time by removing contacts from the Vault or uninstalling the app.',
      },
      {
        title: '6. Google Play Policies',
        body: 'The app is fully compliant with Google Play Policies (2025-2026). We do not use forbidden background services, do not intercept touches, and do not draw content over other apps without explicit user permission.',
      },
      {
        title: '7. Contact',
        body: 'If you have privacy questions, please reach out via the support page on the Google Play Store.',
      },
    ],
  };

  return (
    <div className="max-w-md mx-auto px-5 pt-6 pb-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-500 text-sm mb-4 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> {lang === 'uk' ? 'Назад' : 'Back'}
      </button>

      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="text-[#00D4FF]" size={20} />
        <h1 className="text-xl font-black uppercase tracking-tight text-white">{content.title}</h1>
      </div>
      <p className="text-gray-600 text-xs mb-6">{content.updated}</p>

      <p className="text-gray-400 text-sm leading-relaxed mb-6">{content.intro}</p>

      <div className="space-y-5">
        {content.sections.map((section, i) => (
          <div key={i}>
            <h2 className="text-[#FF6EC7] text-sm font-black uppercase tracking-wider mb-2">{section.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}