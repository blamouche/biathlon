import { BiathlonAPI } from '@/lib/api/biathlon-api';
import { EventCard } from '@/components/EventCard';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

// Fonction pour déterminer le statut d'un événement
function getEventStatus(startDate: string, endDate: string): 'ongoing' | 'upcoming' | 'finished' {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now >= start && now <= end) {
    return 'ongoing';
  } else if (now < start) {
    return 'upcoming';
  } else {
    return 'finished';
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tFooter = await getTranslations('footer');
  const eventsData = await BiathlonAPI.getEvents('2526');

  // Trier les événements : en cours > à venir > terminés
  const events = [...eventsData].sort((a, b) => {
    const statusA = getEventStatus(a.StartDate, a.EndDate);
    const statusB = getEventStatus(b.StartDate, b.EndDate);

    const statusOrder = { ongoing: 0, upcoming: 1, finished: 2 };

    // Si les statuts sont différents, trier par statut
    if (statusA !== statusB) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    // Si même statut, trier par date de début
    return new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime();
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header simplifié */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('title')}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {t('season')}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 border-slate-200 dark:border-slate-700">
            <div className="text-8xl mb-6 animate-pulse">⏳</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t('loadingEvents')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t('loadingDescription')}
            </p>
          </div>
        ) : (
          <>
            {/* Grille des événements */}
            <div className="space-y-12">
              {/* Événements en cours */}
              {events.filter(e => getEventStatus(e.StartDate, e.EndDate) === 'ongoing').length > 0 && (
                <div>
                  <div className="mb-4 flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      {t('ongoing')}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events
                      .filter(e => getEventStatus(e.StartDate, e.EndDate) === 'ongoing')
                      .map((event) => (
                        <EventCard key={event.EventId} event={event} hasLiveRace={true} locale={locale} />
                      ))}
                  </div>
                </div>
              )}

              {/* Événements à venir */}
              {events.filter(e => getEventStatus(e.StartDate, e.EndDate) === 'upcoming').length > 0 && (
                <div>
                  <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t('upcoming')}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events
                      .filter(e => getEventStatus(e.StartDate, e.EndDate) === 'upcoming')
                      .map((event) => (
                        <EventCard key={event.EventId} event={event} locale={locale} />
                      ))}
                  </div>
                </div>
              )}

              {/* Événements terminés */}
              {events.filter(e => getEventStatus(e.StartDate, e.EndDate) === 'finished').length > 0 && (
                <div>
                  <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {t('finished')}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events
                      .filter(e => getEventStatus(e.StartDate, e.EndDate) === 'finished')
                      .map((event) => (
                        <EventCard key={event.EventId} event={event} locale={locale} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer amélioré */}
      <footer className="mt-20 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-t-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">
              🎯 {tFooter('dataSource')} <span className="font-bold text-white">biathlonresults.com</span>
            </p>
            <p className="text-slate-500 text-xs">
              © 2026 {tFooter('rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
