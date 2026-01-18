import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // Supported languages
  locales,

  // Default language
  defaultLocale: 'fr',

  // Never include locale prefix in URL (single language app)
  localePrefix: 'never',
});

export const config = {
  // Matcher to apply middleware to all routes
  // except static files, images, etc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
