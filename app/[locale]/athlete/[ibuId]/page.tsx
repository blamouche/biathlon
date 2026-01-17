import Link from 'next/link';
import { BiathlonAPI } from '@/lib/api/biathlon-api';
import { FormattedDateTime } from '@/components/FormattedDateTime';
import { SharePageButton } from '@/components/SharePageButton';

interface AthletePageProps {
  params: Promise<{
    locale: string;
    ibuId: string;
  }>;
}

export default async function AthletePage({ params }: AthletePageProps) {
  const { locale, ibuId } = await params;

  // Récupérer les données de l'athlète
  const athleteBio = await BiathlonAPI.getAthleteBio(ibuId);
  const results = await BiathlonAPI.getAthleteResults(ibuId);

  if (!athleteBio) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-gray-100 font-mono flex items-center justify-center">
        <div className="text-center border border-red-500/50 bg-red-500/10 p-8">
          <div className="text-6xl mb-4 text-red-400">✕</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            [ERROR] ATHLETE NOT FOUND
          </h2>
          <Link
            href={`/${locale}`}
            className="inline-block px-4 py-2 border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-colors"
          >
            ← BACK HOME
          </Link>
        </div>
      </div>
    );
  }

  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 3) return '🏳️';
    const codePoints = countryCode
      .toUpperCase()
      .slice(0, 2)
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const getRankColor = (rank: number | string) => {
    const rankNum = typeof rank === 'string' ? parseInt(rank) : rank;
    if (isNaN(rankNum)) return 'text-gray-400';
    if (rankNum === 1) return 'text-yellow-400 font-bold';
    if (rankNum === 2) return 'text-gray-300 font-bold';
    if (rankNum === 3) return 'text-orange-400 font-bold';
    if (rankNum <= 10) return 'text-cyan-400 font-semibold';
    return 'text-gray-400';
  };

  const getRankBadge = (rank: number | string) => {
    const rankNum = typeof rank === 'string' ? parseInt(rank) : rank;
    if (isNaN(rankNum)) return rank;
    if (rankNum === 1) return '🥇';
    if (rankNum === 2) return '🥈';
    if (rankNum === 3) return '🥉';
    return rankNum;
  };

  // Calculer les statistiques
  const totalRaces = results.length;
  const podiums = results.filter(r => {
    const rank = typeof r.Rank === 'string' ? parseInt(r.Rank) : r.Rank;
    return !isNaN(rank) && rank <= 3;
  }).length;
  const top10 = results.filter(r => {
    const rank = typeof r.Rank === 'string' ? parseInt(r.Rank) : r.Rank;
    return !isNaN(rank) && rank <= 10;
  }).length;

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

          <div className="flex items-start gap-6">
            <div className="text-6xl">{getFlagEmoji(athleteBio.Nat)}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-green-400 tracking-wider mb-2">
                {athleteBio.GivenName} {athleteBio.FamilyName}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-500 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">NATION:</span>
                  <span className="text-cyan-400">{athleteBio.NatLong || athleteBio.Nat}</span>
                </div>
                {athleteBio.Birthdate && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">DOB:</span>
                    <span className="text-cyan-400">{new Date(athleteBio.Birthdate).toLocaleDateString(locale)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">IBU ID:</span>
                  <span className="text-cyan-400">{ibuId}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <SharePageButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques de la saison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-cyan-500/50 bg-cyan-500/5 p-6">
            <div className="text-center">
              <div className="text-gray-500 text-xs font-bold tracking-widest mb-2">
                TOTAL RACES
              </div>
              <div className="text-5xl font-bold text-cyan-400 mb-2 font-mono">
                {String(totalRaces).padStart(3, '0')}
              </div>
              <div className="flex gap-1 justify-center">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 ${i < Math.min(10, totalRaces / 3) ? 'bg-cyan-500/50' : 'bg-gray-800'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="border border-yellow-500/50 bg-yellow-500/5 p-6">
            <div className="text-center">
              <div className="text-gray-500 text-xs font-bold tracking-widest mb-2">
                PODIUMS
              </div>
              <div className="text-5xl font-bold text-yellow-400 mb-2 font-mono">
                {String(podiums).padStart(3, '0')}
              </div>
              <div className="flex gap-1 justify-center">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 ${i < Math.min(10, podiums * 2) ? 'bg-yellow-500/50' : 'bg-gray-800'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="border border-green-500/50 bg-green-500/5 p-6">
            <div className="text-center">
              <div className="text-gray-500 text-xs font-bold tracking-widest mb-2">
                TOP 10
              </div>
              <div className="text-5xl font-bold text-green-400 mb-2 font-mono">
                {String(top10).padStart(3, '0')}
              </div>
              <div className="flex gap-1 justify-center">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 ${i < Math.min(10, top10) ? 'bg-green-500/50' : 'bg-gray-800'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Résultats de la saison */}
        <div className="border border-cyan-500/30 bg-black/40 p-4 mb-6">
          <h2 className="text-cyan-400 text-lg font-bold tracking-wider">
            [SEASON RESULTS] - 2025/2026
          </h2>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 border border-gray-700/50 bg-black/20">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-xl text-gray-400">
              NO RESULTS AVAILABLE
            </p>
          </div>
        ) : (
          <div className="border border-gray-700/50 bg-black/20 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-900/50 px-6 py-3 border-b border-gray-700/50">
              <div className="grid grid-cols-12 gap-4 text-gray-500 font-bold text-xs uppercase tracking-wider">
                <div className="col-span-2">DATE</div>
                <div className="col-span-2">LOCATION</div>
                <div className="col-span-3">COMPETITION</div>
                <div className="col-span-1 text-center">RANK</div>
                <div className="col-span-1 text-center">SHOOTING</div>
                <div className="col-span-2 text-center">TIME</div>
                <div className="col-span-1 text-center">BEHIND</div>
              </div>
            </div>

            {/* Results List */}
            <div className="divide-y divide-gray-800/50">
              {results.map((result, index) => {
                const rankNum = typeof result.Rank === 'string' ? parseInt(result.Rank) : result.Rank;
                const isPodium = !isNaN(rankNum) && rankNum <= 3;
                let rowBg = 'hover:bg-gray-800/30';

                if (isPodium) {
                  if (rankNum === 1) {
                    rowBg = 'bg-gradient-to-r from-yellow-500/10 to-transparent hover:from-yellow-500/20';
                  } else if (rankNum === 2) {
                    rowBg = 'bg-gradient-to-r from-gray-500/10 to-transparent hover:from-gray-500/20';
                  } else if (rankNum === 3) {
                    rowBg = 'bg-gradient-to-r from-orange-500/10 to-transparent hover:from-orange-500/20';
                  }
                }

                return (
                  <div
                    key={`${result.RaceId}-${index}`}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 transition-colors ${rowBg}`}
                  >
                    <div className="col-span-2 text-sm text-gray-400">
                      <FormattedDateTime dateString={result.Date} locale={locale} />
                    </div>
                    <div className="col-span-2 text-sm text-gray-300">
                      {result.Location}
                    </div>
                    <div className="col-span-3 text-sm">
                      <Link
                        href={`/${locale}/event/${result.EventId}/race/${result.RaceId}`}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        {result.CompetitionName}
                      </Link>
                    </div>
                    <div className={`col-span-1 text-center text-lg ${getRankColor(result.Rank)}`}>
                      {getRankBadge(result.Rank)}
                    </div>
                    <div className="col-span-1 text-center text-sm">
                      <span className="inline-flex items-center justify-center px-2 py-1 bg-gray-800/50 text-cyan-400 font-mono text-xs border border-gray-700/50">
                        {result.ShootingTotal}
                      </span>
                    </div>
                    <div className="col-span-2 text-center font-mono text-white text-sm">
                      {result.TotalTime}
                    </div>
                    <div className="col-span-1 text-center text-gray-400 font-mono text-xs">
                      {result.Behind ? `+${result.Behind}` : '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-green-500/30 bg-black/40 mt-12">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-xs">
            <p>DATA SOURCE: BIATHLONRESULTS.COM • ATHLETE ID: {ibuId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
