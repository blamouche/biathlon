import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: 'Biathlon World Cup Tracker',
    description: t('season'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Vérifier que la locale est valide
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Récupérer les messages pour la locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
