import { BiathlonAPI } from '@/lib/api/biathlon-api'
import { StandingsEntry } from '@/lib/types/biathlon'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

interface StandingsPageProps {
  params: Promise<{
    locale: string
    category: string
  }>
}

export default async function StandingsPage({ params }: StandingsPageProps) {
  const { locale, category } = await params
  const t = await getTranslations('standings')

  // Validate category
  if (!['SM', 'SW'].includes(category)) {
    notFound()
  }

  // Fetch standings
  const standings = await BiathlonAPI.getStandings(category, '2526')

  const categoryTitle = category === 'SM' ? t('menStandings') : t('womenStandings')
  const colorClasses = category === 'SM'
    ? {
        border: 'border-blue-500/50',
        bg: 'bg-blue-500/5',
        text: 'text-blue-400',
        glow: 'shadow-blue-500/20',
        headerBg: 'bg-blue-500/10',
        accent: 'text-blue-300',
        rowHover: 'hover:bg-blue-500/5',
      }
    : {
        border: 'border-pink-500/50',
        bg: 'bg-pink-500/5',
        text: 'text-pink-400',
        glow: 'shadow-pink-500/20',
        headerBg: 'bg-pink-500/10',
        accent: 'text-pink-300',
        rowHover: 'hover:bg-pink-500/5',
      }

  const getMedalEmoji = (rank: number | string) => {
    const rankNum = typeof rank === 'string' ? parseInt(rank) : rank
    switch (rankNum) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>

          <div className="border border-cyan-500/30 bg-black/40 p-6">
            <h1 className="text-cyan-400 text-2xl font-bold tracking-wider mb-2">
              [WORLD CUP STANDINGS]
            </h1>
            <p className="text-gray-500 text-sm font-mono">
              {categoryTitle} • Season 2025-2026
            </p>
          </div>
        </div>

        {/* Category Switcher */}
        <div className="flex gap-4 mb-6">
          <Link
            href={`/${locale}/standings/SM`}
            className={`flex-1 px-6 py-3 text-center font-bold tracking-wider text-sm transition-all ${
              category === 'SM'
                ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/50'
                : 'bg-gray-800/50 text-gray-500 border border-gray-700/50 hover:bg-gray-800/70'
            }`}
          >
            MEN'S STANDINGS
          </Link>
          <Link
            href={`/${locale}/standings/SW`}
            className={`flex-1 px-6 py-3 text-center font-bold tracking-wider text-sm transition-all ${
              category === 'SW'
                ? 'bg-pink-500/20 text-pink-400 border-2 border-pink-500/50'
                : 'bg-gray-800/50 text-gray-500 border border-gray-700/50 hover:bg-gray-800/70'
            }`}
          >
            WOMEN'S STANDINGS
          </Link>
        </div>

        {/* Standings Table */}
        <div className={`border ${colorClasses.border} ${colorClasses.bg} shadow-lg ${colorClasses.glow} overflow-hidden`}>
          {/* Table Header */}
          <div className={`${colorClasses.headerBg} border-b ${colorClasses.border}`}>
            <div className="grid grid-cols-12 gap-4 p-4 text-xs text-gray-500 font-bold">
              <div className="col-span-1 text-center">RANK</div>
              <div className="col-span-6 sm:col-span-5">ATHLETE</div>
              <div className="col-span-2 sm:col-span-3 text-center">NATION</div>
              <div className="col-span-3 text-right">TOTAL SCORE</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-800/50">
            {standings.length > 0 ? (
              standings.map((athlete: StandingsEntry, index: number) => (
                <Link
                  key={athlete.IBUId}
                  href={`/${locale}/athlete/${athlete.IBUId}`}
                  className={`grid grid-cols-12 gap-4 p-4 ${colorClasses.rowHover} transition-all font-mono text-sm`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center gap-2">
                    <span className={`${colorClasses.text} font-bold text-lg`}>
                      {typeof athlete.Rank === 'string' ? athlete.Rank : String(athlete.Rank).padStart(2, '0')}
                    </span>
                    {index < 3 && (
                      <span className="text-lg">{getMedalEmoji(athlete.Rank)}</span>
                    )}
                  </div>

                  {/* Name */}
                  <div className="col-span-6 sm:col-span-5 flex items-center">
                    <div>
                      <div className="text-white font-semibold">
                        {athlete.GivenName} {athlete.FamilyName}
                      </div>
                    </div>
                  </div>

                  {/* Nation */}
                  <div className="col-span-2 sm:col-span-3 flex items-center justify-center">
                    <span className="text-gray-400 font-bold text-xs sm:text-sm uppercase">
                      {athlete.Nat}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="col-span-3 flex items-center justify-end">
                    <div className="text-right">
                      <div className={`${colorClasses.accent} font-bold text-xl`}>
                        {athlete.TotalScore}
                      </div>
                      <div className="text-gray-600 text-xs uppercase">
                        points
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500 text-sm">
                {t('noStandings')}
              </div>
            )}
          </div>
        </div>

        {/* Stats Footer */}
        {standings.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-gray-700/50 bg-black/20 p-4">
              <div className="text-gray-500 text-xs font-bold tracking-widest mb-2">
                TOTAL ATHLETES
              </div>
              <div className="text-cyan-400 text-2xl font-bold font-mono">
                {String(standings.length).padStart(3, '0')}
              </div>
            </div>

            <div className="border border-gray-700/50 bg-black/20 p-4">
              <div className="text-gray-500 text-xs font-bold tracking-widest mb-2">
                LEADER
              </div>
              <div className="text-green-400 text-lg font-bold">
                {standings[0]?.GivenName} {standings[0]?.FamilyName}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                {standings[0]?.Nat} • {standings[0]?.TotalScore} pts
              </div>
            </div>

            <div className="border border-gray-700/50 bg-black/20 p-4">
              <div className="text-gray-500 text-xs font-bold tracking-widest mb-2">
                SEASON
              </div>
              <div className="text-purple-400 text-lg font-bold">
                2025-2026
              </div>
              <div className="text-gray-500 text-xs mt-1">
                World Cup
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
