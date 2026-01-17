import { BiathlonAPI } from '@/lib/api/biathlon-api';

interface DebugRacePageProps {
  params: Promise<{
    locale: string;
    raceId: string;
  }>;
}

export default async function DebugRacePage({ params }: DebugRacePageProps) {
  const { locale, raceId } = await params;

  // Test de tous les types d'analyse
  const typesToTest = [
    { id: 'S1TM', name: 'Shooting Time 1' },
    { id: 'S2TM', name: 'Shooting Time 2' },
    { id: 'RNG1', name: 'Range Time 1' },
    { id: 'RNG2', name: 'Range Time 2' },
    { id: 'STTM', name: 'Total Shooting Time' },
    { id: 'RNGT', name: 'Total Range Time' },
    { id: 'CRST1', name: 'Course Time Leg 1' },
    { id: 'CRS1', name: 'Lap Time 1' },
    { id: 'CRST', name: 'Total Course Time' },
  ];

  const results: any[] = [];

  for (const type of typesToTest) {
    const data = await BiathlonAPI.getAnalyticResults(raceId, type.id);
    results.push({
      type,
      data,
      hasResults: data?.Results && data.Results.length > 0,
      count: data?.Results?.length || 0,
      firstResult: data?.Results?.[0] || null,
    });
  }

  // Récupérer aussi les résultats de base
  const baseResults = await BiathlonAPI.getResults(raceId);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 font-mono p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-400 mb-8">
          🔍 DEBUG: Race API Data
        </h1>

        <div className="bg-black/40 border border-cyan-500/30 p-6 mb-8">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">Race Info</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Race ID:</span>{' '}
              <span className="text-white font-bold">{raceId}</span>
            </div>
            <div>
              <span className="text-gray-500">Locale:</span>{' '}
              <span className="text-white">{locale}</span>
            </div>
          </div>
        </div>

        {/* Base Results */}
        <div className="bg-black/40 border border-green-500/30 p-6 mb-8">
          <h2 className="text-xl font-bold text-green-400 mb-4">
            📋 Base Results (/Results)
          </h2>
          <div className="text-sm mb-4">
            <span className="text-gray-500">Athletes found:</span>{' '}
            <span className="text-white font-bold">{baseResults.length}</span>
          </div>
          {baseResults.length > 0 && (
            <div className="bg-gray-900/50 p-4 rounded overflow-auto">
              <pre className="text-xs text-green-300">
                {JSON.stringify(baseResults[0], null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Analytic Results */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-yellow-400">
            📊 Analytic Results (/AnalyticResults)
          </h2>

          {results.map((result, index) => (
            <div
              key={index}
              className={`bg-black/40 border p-6 ${
                result.hasResults
                  ? 'border-green-500/30'
                  : 'border-red-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  {result.type.name} ({result.type.id})
                </h3>
                <div
                  className={`px-3 py-1 rounded text-sm font-bold ${
                    result.hasResults
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {result.hasResults
                    ? `✅ ${result.count} results`
                    : '❌ No data'}
                </div>
              </div>

              {result.hasResults ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-400">
                    Keys available:{' '}
                    <span className="text-cyan-300">
                      {Object.keys(result.firstResult).join(', ')}
                    </span>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded overflow-auto">
                    <pre className="text-xs text-green-300">
                      {JSON.stringify(result.firstResult, null, 2)}
                    </pre>
                  </div>
                  <div className="bg-gray-900/50 p-4 rounded overflow-auto max-h-96">
                    <details>
                      <summary className="cursor-pointer text-cyan-400 hover:text-cyan-300 mb-2">
                        View all {result.count} results
                      </summary>
                      <pre className="text-xs text-green-300">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-red-400">
                  No data returned from API
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-12 p-6 bg-black/40 border border-gray-700/50">
          <a
            href={`/${locale}/event/${raceId.substring(0, raceId.length - 4)}/race/${raceId}`}
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← Back to race page
          </a>
        </div>
      </div>
    </div>
  );
}
