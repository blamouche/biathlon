import { BiathlonAPI } from '@/lib/api/biathlon-api'
import Link from 'next/link'
import LiveTicker from '@/components/LiveTicker'
import StatsGrid from '@/components/StatsGrid'
import MarketTable from '@/components/MarketTable'
import LiveTimestamp from '@/components/LiveTimestamp'
import { SharePageButton } from '@/components/SharePageButton'
import WorldCupRankings from '@/components/WorldCupRankings'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const events = await BiathlonAPI.getEvents()

  // Find the currently active World Cup stage
  // A stage is active until the end of the day of its EndDate
  const now = new Date()
  const activeEvent = events.find(event => {
    const start = new Date(event.StartDate)
    // Set end time to end of day (23:59:59)
    const end = new Date(event.EndDate)
    end.setHours(23, 59, 59, 999)
    return now >= start && now <= end
  })

  // Get competitions only for the active event
  let competitions: any[] = []
  let nextEvent = null

  if (activeEvent) {
    // Fetch races for the active stage only
    const comps = await BiathlonAPI.getCompetitions(activeEvent.EventId)
    competitions = comps.map(comp => ({
      ...comp,
      eventName: activeEvent.Description,
      eventId: activeEvent.EventId
    }))
  } else {
    // No active event, find the next upcoming event
    nextEvent = events
      .filter(event => {
        const start = new Date(event.StartDate)
        return start > now
      })
      .sort((a, b) => new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime())[0]
  }

  // Calculate statistics
  const totalEvents = events.length
  const liveEventsCount = activeEvent ? 1 : 0
  const totalCompetitions = competitions.length
  const liveCompetitions = competitions.filter(comp => {
    const status = BiathlonAPI.getRaceStatus(comp.StartTime)
    return status === 'live'
  }).length

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 font-mono">
      {/* Header terminal style */}
      <div className="border-b border-green-500/30 bg-black/40 backdrop-blur">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-400 tracking-wider">
                BIATHLON LIVE MONITORING
              </h1>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                REAL-TIME DATA FEED • IBU OFFICIAL SOURCE • <LiveTimestamp />
              </p>
            </div>
            <div className="flex gap-2 self-end md:self-auto">
              <SharePageButton />
              <div className="px-3 md:px-4 py-1.5 md:py-2 border border-green-500/50 bg-green-500/5">
                <span className="text-green-400 animate-pulse text-xs md:text-sm">● LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      <LiveTicker competitions={competitions} locale={locale} />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <StatsGrid
          totalEvents={totalEvents}
          liveEvents={liveEventsCount}
          totalCompetitions={totalCompetitions}
          liveCompetitions={liveCompetitions}
        />

        {/* Market Table - Courses actives */}
        <MarketTable
          competitions={competitions}
          locale={locale}
          nextEvent={nextEvent}
        />

        {/* World Cup Rankings */}
        <WorldCupRankings locale={locale} />

        {/* All Events Grid */}
        <div className="mt-8">
          <div className="border border-cyan-500/30 bg-black/40 p-3 md:p-4 mb-4">
            <h2 className="text-cyan-400 text-base md:text-lg font-bold tracking-wider">
              [EVENT REGISTRY]
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {events.map((event, index) => {
              const now = new Date()
              const start = new Date(event.StartDate)
              const end = new Date(event.EndDate)
              const isLive = now >= start && now <= end
              const isUpcoming = now < start

              return (
                <Link
                  key={event.EventId}
                  href={`/${locale}/event/${event.EventId}`}
                  className="block border border-gray-700/50 bg-black/20 hover:border-green-500/50 hover:bg-green-500/5 transition-all"
                >
                  {/* Mobile Layout */}
                  <div className="p-3 font-mono text-sm md:hidden">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">#{String(index + 1).padStart(3, '0')}</span>
                        {isLive ? (
                          <span className="text-green-400 animate-pulse text-lg">●</span>
                        ) : isUpcoming ? (
                          <span className="text-yellow-400">○</span>
                        ) : (
                          <span className="text-gray-600">○</span>
                        )}
                      </div>
                      {isLive ? (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/50 text-xs">
                          LIVE
                        </span>
                      ) : isUpcoming ? (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-xs">
                          UPCOMING
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-700/20 text-gray-500 border border-gray-700/50 text-xs">
                          CLOSED
                        </span>
                      )}
                    </div>
                    <div className="text-white font-bold mb-1">{event.Description}</div>
                    <div className="text-gray-400 text-xs mb-1">{event.ShortDescription}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{event.Organizer}</span>
                      <span className="text-gray-400">
                        {new Date(event.StartDate).toLocaleDateString(locale)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block p-4">
                    <div className="grid grid-cols-12 gap-4 items-center text-sm">
                      <div className="col-span-1 text-gray-500 text-right">
                        #{String(index + 1).padStart(3, '0')}
                      </div>

                      <div className="col-span-1">
                        {isLive ? (
                          <span className="text-green-400 animate-pulse text-lg">●</span>
                        ) : isUpcoming ? (
                          <span className="text-yellow-400">○</span>
                        ) : (
                          <span className="text-gray-600">○</span>
                        )}
                      </div>

                      <div className="col-span-4">
                        <div className="text-white font-bold">{event.Description}</div>
                        <div className="text-gray-500 text-xs">{event.Organizer}</div>
                      </div>

                      <div className="col-span-2 text-gray-400">
                        {event.ShortDescription}
                      </div>

                      <div className="col-span-2 text-gray-400">
                        {new Date(event.StartDate).toLocaleDateString(locale)}
                      </div>

                      <div className="col-span-2 text-right">
                        {isLive ? (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 text-xs">
                            LIVE
                          </span>
                        ) : isUpcoming ? (
                          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-xs">
                            UPCOMING
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-700/20 text-gray-500 border border-gray-700/50 text-xs">
                            CLOSED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-green-500/30 bg-black/40 mt-12">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-xs space-y-1">
            <p>DATA SOURCE: BIATHLONRESULTS.COM • UPDATE FREQUENCY: 30s</p>
            <p>© 2026 BIATHLON MONITORING SYSTEM • ALL RIGHTS RESERVED</p>
            <p>DEVELOPED BY <a href="https://lamouche.fr" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 hover:underline">BENOIT</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}
