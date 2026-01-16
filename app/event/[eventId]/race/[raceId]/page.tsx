import Link from 'next/link';
import { BiathlonAPI } from '@/lib/api/biathlon-api';

interface RacePageProps {
  params: Promise<{
    eventId: string;
    raceId: string;
  }>;
}

export default async function RacePage({ params }: RacePageProps) {
  const { eventId, raceId } = await params;

  const competitions = await BiathlonAPI.getCompetitions(eventId);
  const competition = competitions.find((c) => c.RaceId === raceId);

  if (!competition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Course non trouvée
          </h2>
          <Link href={`/event/${eventId}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            Retour à l'événement
          </Link>
        </div>
      </div>
    );
  }

  const results = await BiathlonAPI.getResults(raceId);
  const status = BiathlonAPI.getRaceStatus(competition.StartTime);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
      title: 'Liste de départ',
      icon: '⏰',
      color: 'bg-gray-500',
      description: 'La course n\'a pas encore commencé',
    },
    live: {
      title: 'Résultats en direct',
      icon: '🔴',
      color: 'bg-red-500 animate-pulse',
      description: 'Course en cours',
    },
    finished: {
      title: 'Résultats finaux',
      icon: '🏁',
      color: 'bg-green-500',
      description: 'Course terminée',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={`/event/${eventId}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'événement
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {competition.Description}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 flex-wrap">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatTime(competition.StartTime)}</span>
                </div>
                {competition.km && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>{competition.km} km</span>
                  </div>
                )}
              </div>
            </div>

            <span className={`${config.color} text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm`}>
              <span>{config.icon}</span>
              <span>{config.description}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {config.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {results.length} participant{results.length > 1 ? 's' : ''}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              Aucun résultat disponible pour le moment
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Les données seront disponibles prochainement
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-white font-bold text-sm">
                <div className="col-span-1 text-center">Rang</div>
                <div className="col-span-1 text-center">Doss.</div>
                <div className="col-span-4">Athlète</div>
                <div className="col-span-2 text-center">Tirs</div>
                <div className="col-span-2 text-center">Temps</div>
                <div className="col-span-2 text-center">Écart</div>
              </div>
            </div>

            {/* Results List */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result, index) => {
                const isTopThree = typeof result.Rank === 'number' && result.Rank <= 3;
                const rankColors = ['text-yellow-500', 'text-gray-400', 'text-orange-600'];
                const rankColor = isTopThree && typeof result.Rank === 'number'
                  ? rankColors[result.Rank - 1]
                  : 'text-gray-700 dark:text-gray-300';

                return (
                  <div
                    key={result.IBUId || index}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isTopThree ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className={`col-span-1 text-center font-bold text-lg ${rankColor}`}>
                      {result.Rank || '-'}
                    </div>
                    <div className="col-span-1 text-center text-gray-600 dark:text-gray-400">
                      {result.Bib}
                    </div>
                    <div className="col-span-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getFlagEmoji(result.Nat)}</span>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {result.FamilyName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {result.GivenName}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm">
                        {result.ShootingTotal || '-'}
                      </span>
                    </div>
                    <div className="col-span-2 text-center font-mono text-gray-900 dark:text-white">
                      {result.TotalTime || '-'}
                    </div>
                    <div className="col-span-2 text-center text-gray-600 dark:text-gray-400 font-mono text-sm">
                      {result.Behind || '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Auto-refresh notice for live races */}
        {status === 'live' && results.length > 0 && (
          <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-300 dark:border-blue-700">
            <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">
                Les résultats sont mis à jour automatiquement pendant la course
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
