import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Supported languages
export const locales = ['en', 'fr'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the locale is supported
  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'fr'; // French by default
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
