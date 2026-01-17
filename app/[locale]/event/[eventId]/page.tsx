import Link from 'next/link';
import { BiathlonAPI } from '@/lib/api/biathlon-api';
import { formatDate } from '@/lib/utils/dateTime';
import CompetitionList from '@/components/CompetitionList';
import { SharePageButton } from '@/components/SharePageButton';

interface EventPageProps {
  params: Promise<{
    eventId: string;
    locale: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { eventId, locale } = await params;
  const localeCode = 'en-US';

  const events = await BiathlonAPI.getEvents('2526');
  const event = events.find((e) => e.EventId === eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-gray-100 font-mono flex items-center justify-center">
        <div className="text-center border border-red-500/50 bg-red-500/10 p-8">
          <div className="text-6xl mb-4 text-red-400">✕</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            [ERROR] EVENT NOT FOUND
          </h2>
          <Link
            href={`/${locale}`}
            className="inline-block px-4 py-2 border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-colors"
          >
            ← BACK TO EVENTS
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
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 font-mono">
      {/* Header terminal style */}
      <div className="border-b border-green-500/30 bg-black/40 backdrop-blur">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center text-green-400 hover:text-green-300 mb-4 text-sm"
          >
            ← [BACK TO MONITORING]
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-green-400 tracking-wider">
                  {event.Description}
                </h1>
                {hasLiveRace && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 text-xs animate-pulse">
                    ● LIVE
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-gray-500 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{event.ShortDescription}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>
                    {formatDate(event.StartDate, localeCode)} → {formatDate(event.EndDate, localeCode)}
                  </span>
                </div>
              </div>

              <div className="text-gray-600 text-xs">
                ORGANIZER: {event.Organizer}
              </div>
            </div>

            <div className="flex items-center">
              <SharePageButton />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border border-cyan-500/30 bg-black/40 p-4 mb-6">
          <h2 className="text-cyan-400 text-lg font-bold tracking-wider">
            [RACE SCHEDULE] - {competitions.length} COMPETITIONS
          </h2>
        </div>

        {competitions.length === 0 ? (
          <div className="text-center py-12 border border-gray-700/50 bg-black/20">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl text-gray-400">
              NO COMPETITIONS AVAILABLE
            </p>
          </div>
        ) : (
          <CompetitionList
            competitions={competitions}
            eventId={eventId}
            locale={locale}
          />
        )}
      </main>

      {/* Footer */}
      <div className="border-t border-green-500/30 bg-black/40 mt-12">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-xs">
            <p>DATA SOURCE: BIATHLONRESULTS.COM • EVENT ID: {eventId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
