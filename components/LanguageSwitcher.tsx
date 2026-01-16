'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      // Remplacer la locale dans le pathname
      // Le pathname contient déjà la locale (ex: /fr/event/123)
      const segments = pathname.split('/').filter(Boolean);

      // Si le premier segment est une locale, on la remplace
      if (segments[0] === 'fr' || segments[0] === 'en') {
        segments[0] = newLocale;
      } else {
        // Sinon on ajoute la locale au début
        segments.unshift(newLocale);
      }

      const newPath = '/' + segments.join('/');
      router.replace(newPath);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all"
        disabled={isPending}
      >
        <svg
          className="w-5 h-5 text-slate-600 dark:text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span className="text-sm font-medium text-slate-900 dark:text-white uppercase">
          {locale}
        </span>
        <svg
          className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => switchLocale('fr')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
              locale === 'fr'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => switchLocale('en')}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
              locale === 'en'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      )}
    </div>
  );
}
