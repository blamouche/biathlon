import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // Liste des langues supportées
  locales,

  // Langue par défaut
  defaultLocale: 'fr',

  // Ne pas ajouter de préfixe pour la langue par défaut dans l'URL
  localePrefix: 'as-needed',
});

export const config = {
  // Matcher pour appliquer le middleware à toutes les routes
  // sauf les fichiers statiques, images, etc.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
