import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Liste des langues supportées
export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Valider que la locale est supportée
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'fr'; // Français par défaut
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
