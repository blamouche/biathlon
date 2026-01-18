import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // Supported languages
  locales,

  // Default language
  defaultLocale: 'en',

  // Always include locale prefix in URL
  localePrefix: 'always',
});

export const config = {
  // Matcher to apply middleware to all routes
  // except static files, images, etc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
