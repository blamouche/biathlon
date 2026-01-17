import Link from 'next/link';
import { BiathlonAPI } from '@/lib/api/biathlon-api';
import { FormattedDateTime } from '@/components/FormattedDateTime';
import { DownloadICalButton } from '@/components/ActionButtons';

interface RacePageProps {
  params: Promise<{
    locale: string;
    eventId: string;
    raceId: string;
  }>;
}

export default async function RacePage({ params }: RacePageProps) {
  const { locale, eventId, raceId } = await params;

  const events = await BiathlonAPI.getEvents('2526');
  const event = events.find((e) => e.EventId === eventId);
  const competitions = await BiathlonAPI.getCompetitions(eventId);
  const competition = competitions.find((c) => c.RaceId === raceId);

  if (!competition) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-gray-100 font-mono flex items-center justify-center">
        <div className="text-center border border-red-500/50 bg-red-500/10 p-8">
          <div className="text-6xl mb-4 text-red-400">✕</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            [ERROR] RACE NOT FOUND
          </h2>
          <Link
            href={`/${locale}/event/${eventId}`}
            className="inline-block px-4 py-2 border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-colors"
          >
            ← BACK TO EVENT
          </Link>
        </div>
      </div>
    );
  }

  const results = await BiathlonAPI.getResults(raceId);
  const status = BiathlonAPI.getRaceStatus(competition.StartTime);

  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 3) return '🏳️';
    const codePoints = countryCode
      .toUpperCase()
      .slice(0, 2)
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const statusConfig = {
    upcoming: {
      title: 'START LIST',
      color: 'text-yellow-400',
      badge: 'SCHEDULED',
      badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    },
    live: {
      title: 'LIVE RESULTS',
      color: 'text-green-400',
      badge: '● LIVE',
      badgeColor: 'bg-green-500/20 text-green-400 border-green-500/50 animate-pulse',
    },
    finished: {
      title: 'FINAL RESULTS',
      color: 'text-cyan-400',
      badge: 'FINISHED',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 font-mono">
      {/* Header terminal style */}
      <div className="border-b border-green-500/30 bg-black/40 backdrop-blur sticky top-0 z-10">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/${locale}/event/${eventId}`}
            className="inline-flex items-center text-green-400 hover:text-green-300 mb-4 text-sm"
          >
            ← [BACK TO EVENT]
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-green-400 tracking-wider">
                  {competition.Description}
                </h1>
                <span className={`px-3 py-1 border text-xs ${config.badgeColor}`}>
                  {config.badge}
                </span>
              </div>

              <div className="flex items-center gap-4 text-gray-500 text-xs">
                <div className="flex items-center gap-2">
                  <span>⏰</span>
                  <FormattedDateTime dateString={competition.StartTime} locale={locale} />
                </div>
                {competition.km && (
                  <div className="flex items-center gap-2">
                    <span>📏</span>
                    <span>{competition.km} KM</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <span>{competition.DisciplineId}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <DownloadICalButton
                title={competition.Description}
                location={event?.ShortDescription || event?.Description || 'Biathlon World Cup'}
                startDate={competition.StartTime}
                description={`${competition.Short} - ${competition.DisciplineId}${competition.km ? ` (${competition.km}km)` : ''}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border border-cyan-500/30 bg-black/40 p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold tracking-wider ${config.color}`}>
              [{config.title}]
            </h2>
            <div className="text-gray-500 text-sm">
              {results.length} ATHLETES
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 border border-gray-700/50 bg-black/20">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-400 mb-2">
              NO DATA AVAILABLE
            </p>
            <p className="text-gray-600 text-sm">
              Results will be displayed when available
            </p>
          </div>
        ) : (
          <div className="border border-gray-700/50 bg-black/20 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-900/50 px-6 py-3 border-b border-gray-700/50">
              <div className="grid grid-cols-12 gap-4 text-gray-500 font-bold text-xs uppercase tracking-wider">
                <div className="col-span-1 text-center">RANK</div>
                <div className="col-span-1 text-center">BIB</div>
                <div className="col-span-4">ATHLETE</div>
                <div className="col-span-2 text-center">SHOOTING</div>
                <div className="col-span-2 text-center">TIME</div>
                <div className="col-span-2 text-center">BEHIND</div>
              </div>
            </div>

            {/* Results List */}
            <div className="divide-y divide-gray-800/50">
              {results.map((result, index) => {
                const isTopThree = typeof result.Rank === 'number' && result.Rank <= 3;

                let rankDisplay = result.Rank || '-';
                let rankColor = 'text-gray-400';
                let rowBg = 'hover:bg-gray-800/30';

                if (isTopThree && typeof result.Rank === 'number') {
                  rowBg = 'bg-gradient-to-r';
                  if (result.Rank === 1) {
                    rankDisplay = `🥇 ${result.Rank}`;
                    rankColor = 'text-yellow-400 font-bold';
                    rowBg += ' from-yellow-500/10 to-transparent hover:from-yellow-500/20';
                  } else if (result.Rank === 2) {
                    rankDisplay = `🥈 ${result.Rank}`;
                    rankColor = 'text-gray-300 font-bold';
                    rowBg += ' from-gray-500/10 to-transparent hover:from-gray-500/20';
                  } else if (result.Rank === 3) {
                    rankDisplay = `🥉 ${result.Rank}`;
                    rankColor = 'text-orange-400 font-bold';
                    rowBg += ' from-orange-500/10 to-transparent hover:from-orange-500/20';
                  }
                }

                return (
                  <div
                    key={result.IBUId || index}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 transition-colors ${rowBg}`}
                  >
                    <div className={`col-span-1 text-center font-bold ${rankColor}`}>
                      {rankDisplay}
                    </div>
                    <div className="col-span-1 text-center text-gray-500">
                      #{result.Bib}
                    </div>
                    <div className="col-span-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getFlagEmoji(result.Nat)}</span>
                        <div>
                          <Link
                            href={`/${locale}/athlete/${result.IBUId}`}
                            className="hover:text-cyan-400 transition-colors"
                          >
                            <div className="font-semibold text-white hover:underline">
                              {result.FamilyName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {result.GivenName}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-gray-800/50 text-cyan-400 font-mono text-sm border border-gray-700/50">
                        {result.ShootingTotal || '-'}
                      </span>
                    </div>
                    <div className="col-span-2 text-center font-mono text-white font-bold">
                      {result.TotalTime || '-'}
                    </div>
                    <div className="col-span-2 text-center text-gray-400 font-mono text-sm">
                      {result.Behind ? `+${result.Behind}` : '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Auto-refresh notice for live races */}
        {status === 'live' && results.length > 0 && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-3 text-green-400">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono uppercase tracking-wider">
                LIVE DATA STREAM ACTIVE • AUTO-REFRESH: 60s
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <div className="border-t border-green-500/30 bg-black/40 mt-12">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-xs">
            <p>DATA SOURCE: BIATHLONRESULTS.COM • RACE ID: {raceId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
