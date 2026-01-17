import Link from 'next/link';
import { BiathlonAPI } from '@/lib/api/biathlon-api';
import { formatDate } from '@/lib/utils/dateTime';

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

  // Trier les compétitions par statut et date
  const sortedCompetitions = [...competitions].sort((a, b) => {
    const statusA = BiathlonAPI.getRaceStatus(a.StartTime);
    const statusB = BiathlonAPI.getRaceStatus(b.StartTime);

    const statusOrder = { live: 0, upcoming: 1, finished: 2 };

    if (statusA !== statusB) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    return new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime();
  });

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
          <div className="grid grid-cols-1 gap-4">
            {sortedCompetitions.map((competition, index) => {
              const status = BiathlonAPI.getRaceStatus(competition.StartTime);
              const startTime = new Date(competition.StartTime);
              const now = new Date();
              const diff = startTime.getTime() - now.getTime();
              const diffMinutes = Math.floor(diff / 60000);
              const diffHours = Math.floor(diffMinutes / 60);

              let statusColor = 'text-gray-600';
              let statusText = '○';
              let statusBg = 'bg-gray-900/20';
              let statusLabel = 'CLOSED';
              let statusBorderColor = 'border-gray-700/50';

              if (status === 'live') {
                statusColor = 'text-green-400 animate-pulse';
                statusText = '●';
                statusBg = 'bg-green-500/10 hover:bg-green-500/20';
                statusLabel = 'LIVE';
                statusBorderColor = 'border-green-500/50';
              } else if (status === 'upcoming') {
                statusColor = 'text-yellow-400';
                statusText = '◐';
                statusBg = 'bg-yellow-500/5 hover:bg-yellow-500/10';
                statusLabel = 'UPCOMING';
                statusBorderColor = 'border-yellow-500/50';
              }

              let countdown = '';
              if (status === 'upcoming') {
                if (diffHours > 24) {
                  const diffDays = Math.floor(diffHours / 24);
                  countdown = `T-${diffDays}d ${diffHours % 24}h`;
                } else if (diffHours > 0) {
                  countdown = `T-${diffHours}h ${diffMinutes % 60}m`;
                } else if (diffMinutes > 0) {
                  countdown = `T-${diffMinutes}m`;
                } else {
                  countdown = 'STARTING...';
                }
              } else if (status === 'live') {
                countdown = '▶ LIVE NOW';
              } else {
                countdown = 'FINISHED';
              }

              return (
                <Link
                  key={competition.RaceId}
                  href={`/${locale}/event/${eventId}/race/${competition.RaceId}`}
                  className={`block border ${statusBorderColor} ${statusBg} transition-all`}
                >
                  <div className="p-4 grid grid-cols-12 gap-4 items-center font-mono text-sm">
                    <div className="col-span-1 text-gray-500 text-right">
                      #{String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="col-span-1 text-center">
                      <span className={`text-xl ${statusColor}`}>{statusText}</span>
                    </div>

                    <div className="col-span-5">
                      <div className="text-white font-bold">{competition.Description}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        {competition.Short} • {competition.DisciplineId}
                      </div>
                    </div>

                    <div className="col-span-2 text-cyan-400">
                      {startTime.toLocaleString(locale, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>

                    <div className={`col-span-2 font-bold ${
                      status === 'live' ? 'text-green-400' :
                      status === 'upcoming' ? 'text-yellow-400' :
                      'text-gray-600'
                    }`}>
                      {countdown}
                    </div>

                    <div className="col-span-1 text-right">
                      {status === 'live' ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 text-xs">
                          WATCH
                        </span>
                      ) : status === 'upcoming' ? (
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-xs">
                          WAIT
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-700/20 text-gray-500 border border-gray-700/50 text-xs">
                          VIEW
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
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
