import Link from 'next/link';
import { BiathlonAPI } from '@/lib/api/biathlon-api';
import { FormattedDateTime } from '@/components/FormattedDateTime';
import { RaceTabs } from '@/components/race/RaceTabs';
import { SharePageButton } from '@/components/SharePageButton';
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

  // Fetch additional race data
  const intermediates = await BiathlonAPI.getIntermediates(raceId);
  const rangeAnalysis = await BiathlonAPI.getRangeAnalysis(raceId);
  const courseAnalysis = await BiathlonAPI.getCourseAnalysis(raceId);
  const preTimes = await BiathlonAPI.getPreTimes(raceId);

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

            <div className="flex items-center gap-2">
              <SharePageButton />
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
        <RaceTabs
          locale={locale}
          results={results}
          intermediates={intermediates}
          rangeAnalysis={rangeAnalysis}
          courseAnalysis={courseAnalysis}
          preTimes={preTimes}
          status={status}
          statusConfig={statusConfig}
        />

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
          <div className="text-center text-gray-500 text-xs space-y-1">
            <p>DATA SOURCE: BIATHLONRESULTS.COM • RACE ID: {raceId}</p>
            <p>© 2026 BIATHLON MONITORING SYSTEM • ALL RIGHTS RESERVED</p>
            <p>DEVELOPED BY <a href="https://lamouche.fr" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 hover:underline">BENOIT</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
