import Link from 'next/link';
import { BiathlonAPI } from '@/lib/api/biathlon-api';
import { FormattedDateTime } from '@/components/FormattedDateTime';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

interface AthletePageProps {
  params: Promise<{
    locale: string;
    ibuId: string;
  }>;
}

export default async function AthletePage({ params }: AthletePageProps) {
  const { locale, ibuId } = await params;
  const t = await getTranslations('athlete');

  // Récupérer les données de l'athlète
  const athleteBio = await BiathlonAPI.getAthleteBio(ibuId);
  const results = await BiathlonAPI.getAthleteResults(ibuId);

  if (!athleteBio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('notFound')}
          </h2>
          <Link href={`/${locale}`} className="text-blue-600 dark:text-blue-400 hover:underline">
            {t('backHome')}
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
    if (isNaN(rankNum)) return 'text-gray-600 dark:text-gray-400';
    if (rankNum === 1) return 'text-yellow-600 dark:text-yellow-400 font-bold';
    if (rankNum === 2) return 'text-gray-400 dark:text-gray-300 font-bold';
    if (rankNum === 3) return 'text-orange-700 dark:text-orange-400 font-bold';
    if (rankNum <= 10) return 'text-blue-600 dark:text-blue-400 font-semibold';
    return 'text-gray-600 dark:text-gray-400';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de l'athlète */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="text-7xl">{getFlagEmoji(athleteBio.Nat)}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {athleteBio.GivenName} {athleteBio.FamilyName}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{t('country')}:</span>
                  <span>{athleteBio.NatLong || athleteBio.Nat}</span>
                </div>
                {athleteBio.Birthdate && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{t('birthdate')}:</span>
                    <span>{new Date(athleteBio.Birthdate).toLocaleDateString(locale)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques de la saison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {totalRaces}
              </div>
              <div className="text-gray-600 dark:text-gray-300">{t('totalRaces')}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                {podiums}
              </div>
              <div className="text-gray-600 dark:text-gray-300">{t('podiums')}</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {top10}
              </div>
              <div className="text-gray-600 dark:text-gray-300">{t('top10')}</div>
            </div>
          </div>
        </div>

        {/* Résultats de la saison */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('seasonResults')}
            </h2>
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {t('noResults')}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('date')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('location')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('competition')}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('rank')}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('shooting')}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('time')}
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('behind')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {results.map((result, index) => (
                    <tr
                      key={`${result.RaceId}-${index}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        <FormattedDateTime dateString={result.Date} locale={locale} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {result.Location}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        <Link
                          href={`/${locale}/event/${result.EventId}/race/${result.RaceId}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {result.CompetitionName}
                        </Link>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-center text-lg ${getRankColor(result.Rank)}`}>
                        {getRankBadge(result.Rank)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 dark:text-gray-100">
                        {result.ShootingTotal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono text-gray-900 dark:text-gray-100">
                        {result.TotalTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 dark:text-gray-400">
                        {result.Behind}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
