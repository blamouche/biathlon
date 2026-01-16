import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // Liste des langues supportées
  locales,

  // Langue par défaut
  defaultLocale: 'fr',

  // Toujours inclure le préfixe de locale dans l'URL
  localePrefix: 'always',
});

export const config = {
  // Matcher pour appliquer le middleware à toutes les routes
  // sauf les fichiers statiques, images, etc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
