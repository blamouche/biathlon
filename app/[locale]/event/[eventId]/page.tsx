import Link from 'next/link';
import { BiathlonAPI } from '@/lib/api/biathlon-api';
import { CompetitionCard } from '@/components/CompetitionCard';
import { ShareButton } from '@/components/ActionButtons';
import { LiveBadge } from '@/components/LiveBadge';
import { getTranslations } from 'next-intl/server';
import { formatDate } from '@/lib/utils/dateTime';

interface EventPageProps {
  params: Promise<{
    eventId: string;
    locale: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventId, locale } = await params;
  const t = await getTranslations('event');
  const tCommon = await getTranslations('common');
  const localeCode = locale === 'fr' ? 'fr-FR' : 'en-US';

  const events = await BiathlonAPI.getEvents('2526');
  const event = events.find((e) => e.EventId === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('notFound')}
          </h2>
          <Link href={`/${locale}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            {tCommon('backToEvents')}
          </Link>
        </div>
      </div>
    );
  }

  const competitions = await BiathlonAPI.getCompetitions(eventId);

  // Vérifier s'il y a des courses en live
  const hasLiveRace = competitions.some(
    (comp) => BiathlonAPI.getRaceStatus(comp.StartTime) === 'live'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {tCommon('backToEvents')}
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {event.Description}
                </h1>
                {hasLiveRace && <LiveBadge position="relative" size="md" />}
              </div>

              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 flex-wrap mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.ShortDescription}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {formatDate(event.StartDate, localeCode)} - {formatDate(event.EndDate, localeCode)}
                  </span>
                </div>
              </div>

              <ShareButton
                title={event.Description}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                text={t('shareText', { event: event.Description })}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('competitions')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {competitions.length} {locale === 'fr' ? (competitions.length > 1 ? 'courses programmées' : 'course programmée') : (competitions.length > 1 ? 'races scheduled' : 'race scheduled')}
          </p>
        </div>

        {competitions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('noCompetitions')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitions.map((competition) => (
              <CompetitionCard
                key={competition.RaceId}
                competition={competition}
                eventId={eventId}
                locale={locale}
                utcOffset={event.UTCOffset}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
