import { BiathlonAPI } from '@/lib/api/biathlon-api'
import { StandingsEntry } from '@/lib/types/biathlon'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface WorldCupRankingsProps {
  locale: string
}

export default async function WorldCupRankings({ locale }: WorldCupRankingsProps) {
  // Fetch standings for both men and women
  const [menStandings, womenStandings] = await Promise.all([
    BiathlonAPI.getStandings('SM', '2526'), // Senior Men
    BiathlonAPI.getStandings('SW', '2526'), // Senior Women
  ])

  // Get top 3 for each
  const topMen = menStandings.slice(0, 3)
  const topWomen = womenStandings.slice(0, 3)

  return (
    <div className="space-y-4 mb-8">
      <div className="border border-cyan-500/30 bg-black/40 p-4">
        <h2 className="text-cyan-400 text-lg font-bold tracking-wider">
          [WORLD CUP STANDINGS]
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Men's Standings */}
        <StandingsCard
          title="MEN'S WORLD CUP"
          standings={topMen}
          color="blue"
          locale={locale}
          category="SM"
        />

        {/* Women's Standings */}
        <StandingsCard
          title="WOMEN'S WORLD CUP"
          standings={topWomen}
          color="pink"
          locale={locale}
          category="SW"
        />
      </div>
    </div>
  )
}

interface StandingsCardProps {
  title: string
  standings: StandingsEntry[]
  color: 'blue' | 'pink'
  locale: string
  category: string
}

function StandingsCard({ title, standings, color, locale, category }: StandingsCardProps) {
  const colorClasses = color === 'blue'
    ? {
        border: 'border-blue-500/50',
        bg: 'bg-blue-500/5',
        text: 'text-blue-400',
        glow: 'shadow-blue-500/20',
        headerBg: 'bg-blue-500/10',
        accent: 'text-blue-300',
      }
    : {
        border: 'border-pink-500/50',
        bg: 'bg-pink-500/5',
        text: 'text-pink-400',
        glow: 'shadow-pink-500/20',
        headerBg: 'bg-pink-500/10',
        accent: 'text-pink-300',
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
    <div className={`border ${colorClasses.border} ${colorClasses.bg} shadow-lg ${colorClasses.glow} overflow-hidden`}>
      {/* Header */}
      <div className={`${colorClasses.headerBg} border-b ${colorClasses.border} p-4`}>
        <h3 className={`${colorClasses.text} text-sm font-bold tracking-wider`}>
          {title}
        </h3>
      </div>

      {/* Standings Table */}
      <div className="divide-y divide-gray-800/50">
        {standings.length > 0 ? (
          standings.map((athlete) => (
            <Link
              key={athlete.IBUId}
              href={`/${locale}/athlete/${athlete.IBUId}`}
              className="block p-3 md:p-4 hover:bg-white/5 transition-all font-mono text-sm"
            >
              {/* Mobile Layout */}
              <div className="flex items-center justify-between md:hidden">
                <div className="flex items-center gap-2 flex-1">
                  <span className={`${colorClasses.text} font-bold text-lg`}>
                    {typeof athlete.Rank === 'string' ? athlete.Rank : String(athlete.Rank).padStart(2, '0')}
                  </span>
                  <span className="text-base">{getMedalEmoji(athlete.Rank)}</span>
                  <div className="ml-1">
                    <div className="text-white font-semibold text-sm">
                      {athlete.FamilyName}
                    </div>
                    <div className="text-gray-500 text-xs uppercase">
                      {athlete.Nat}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${colorClasses.accent} font-bold text-base`}>
                    {athlete.TotalScore}
                  </div>
                  <div className="text-gray-600 text-xs uppercase">
                    PTS
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid md:grid-cols-12 gap-2 items-center">
                {/* Rank */}
                <div className="col-span-2 flex items-center gap-2">
                  <span className={`${colorClasses.text} font-bold text-xl`}>
                    {typeof athlete.Rank === 'string' ? athlete.Rank : String(athlete.Rank).padStart(2, '0')}
                  </span>
                  <span className="text-lg">{getMedalEmoji(athlete.Rank)}</span>
                </div>

                {/* Name & Nation */}
                <div className="col-span-7">
                  <div className="text-white font-semibold">
                    {athlete.GivenName} {athlete.FamilyName}
                  </div>
                  <div className="text-gray-500 text-xs uppercase mt-0.5">
                    {athlete.Nat}
                  </div>
                </div>

                {/* Score */}
                <div className="col-span-3 text-right">
                  <div className={`${colorClasses.accent} font-bold text-lg`}>
                    {athlete.TotalScore}
                  </div>
                  <div className="text-gray-600 text-xs uppercase">
                    PTS
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            No standings available
          </div>
        )}
      </div>

      {/* View Full Standings Link */}
      <div className={`border-t ${colorClasses.border} p-4 ${colorClasses.bg}`}>
        <Link
          href={`/${locale}/standings/${category}`}
          className={`block text-center ${colorClasses.text} text-xs font-bold tracking-wider hover:underline transition-all`}
        >
          VIEW FULL STANDINGS →
        </Link>
      </div>
    </div>
  )
}
