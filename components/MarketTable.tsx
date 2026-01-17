'use client'

import { BiathlonAPI } from '@/lib/api/biathlon-api'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Competition {
  RaceId: string
  Description: string
  StartTime: string
  eventName: string
  eventId: string
}

export default function MarketTable({
  competitions,
  locale,
}: {
  competitions: Competition[]
  locale: string
}) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Trier par statut et date
  const sortedCompetitions = [...competitions].sort((a, b) => {
    const statusA = BiathlonAPI.getRaceStatus(a.StartTime)
    const statusB = BiathlonAPI.getRaceStatus(b.StartTime)

    // Live d'abord
    if (statusA === 'live' && statusB !== 'live') return -1
    if (statusA !== 'live' && statusB === 'live') return 1

    // Puis upcoming
    if (statusA === 'upcoming' && statusB === 'finished') return -1
    if (statusA === 'finished' && statusB === 'upcoming') return 1

    // Sinon par date
    return new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime()
  })

  return (
    <div className="space-y-4">
      <div className="border border-cyan-500/30 bg-black/40 p-4">
        <h2 className="text-cyan-400 text-lg font-bold tracking-wider">
          [RACE MONITOR] - ACTIVE MARKETS
        </h2>
      </div>

      <div className="border border-gray-700/50 bg-black/20 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700/50 bg-gray-900/50 text-xs text-gray-500 font-bold">
          <div className="col-span-1 text-center">STATUS</div>
          <div className="col-span-1">ID</div>
          <div className="col-span-4">EVENT / RACE</div>
          <div className="col-span-2">START TIME</div>
          <div className="col-span-2">COUNTDOWN</div>
          <div className="col-span-2 text-right">ACTION</div>
        </div>

        {/* Body */}
        <div className="divide-y divide-gray-800/50">
          {sortedCompetitions.slice(0, 20).map((comp, index) => {
            const status = BiathlonAPI.getRaceStatus(comp.StartTime)
            const startTime = new Date(comp.StartTime)
            const now = time
            const diff = startTime.getTime() - now.getTime()
            const diffSeconds = Math.floor(diff / 1000)
            const diffMinutes = Math.floor(diffSeconds / 60)
            const diffHours = Math.floor(diffMinutes / 60)
            const diffDays = Math.floor(diffHours / 24)

            let statusColor = 'text-gray-600'
            let statusText = '○'
            let statusBg = 'bg-gray-700/20'

            if (status === 'live') {
              statusColor = 'text-green-400 animate-pulse'
              statusText = '●'
              statusBg = 'bg-green-500/10 hover:bg-green-500/20'
            } else if (status === 'upcoming') {
              statusColor = 'text-yellow-400'
              statusText = '◐'
              statusBg = 'bg-yellow-500/5 hover:bg-yellow-500/10'
            } else {
              statusBg = 'bg-gray-900/20 hover:bg-gray-800/30'
            }

            let countdown = ''
            if (status === 'upcoming') {
              if (diffDays > 0) {
                countdown = `T-${diffDays}d ${diffHours % 24}h ${diffMinutes % 60}m ${diffSeconds % 60}s`
              } else if (diffHours > 0) {
                countdown = `T-${diffHours}h ${diffMinutes % 60}m ${diffSeconds % 60}s`
              } else if (diffMinutes > 0) {
                countdown = `T-${diffMinutes}m ${diffSeconds % 60}s`
              } else if (diffSeconds > 0) {
                countdown = `T-${diffSeconds}s`
              } else {
                countdown = 'STARTING...'
              }
            } else if (status === 'live') {
              countdown = '▶ LIVE NOW'
            } else {
              countdown = 'CLOSED'
            }

            return (
              <Link
                key={comp.RaceId}
                href={`/${locale}/event/${comp.eventId}/race/${comp.RaceId}`}
                className={`grid grid-cols-12 gap-4 p-4 ${statusBg} transition-all text-sm font-mono`}
              >
                <div className={`col-span-1 text-center text-xl ${statusColor}`}>
                  {statusText}
                </div>

                <div className="col-span-1 text-gray-500">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="col-span-4">
                  <div className="text-white font-bold text-sm">
                    {comp.eventName}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {comp.Description}
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

                <div className="col-span-2 text-right">
                  {status === 'live' ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 text-xs">
                      WATCH
                    </span>
                  ) : status === 'upcoming' ? (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-xs">
                      PENDING
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-700/20 text-gray-500 border border-gray-700/50 text-xs">
                      RESULTS
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {sortedCompetitions.length > 20 && (
        <div className="text-center text-gray-600 text-xs py-4">
          + {sortedCompetitions.length - 20} more races in queue
        </div>
      )}
    </div>
  )
}
