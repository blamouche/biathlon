'use client'

import { BiathlonAPI } from '@/lib/api/biathlon-api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Competition } from '@/lib/types/biathlon'

interface CompetitionWithEvent extends Competition {
  // Competition déjà a tous les champs nécessaires
}

export default function CompetitionList({
  competitions,
  eventId,
  locale,
}: {
  competitions: CompetitionWithEvent[]
  eventId: string
  locale: string
}) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Trier les compétitions par statut et date
  const sortedCompetitions = [...competitions].sort((a, b) => {
    const statusA = BiathlonAPI.getRaceStatus(a.StartTime)
    const statusB = BiathlonAPI.getRaceStatus(b.StartTime)

    const statusOrder = { live: 0, upcoming: 1, finished: 2 }

    if (statusA !== statusB) {
      return statusOrder[statusA] - statusOrder[statusB]
    }

    return new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime()
  })

  return (
    <div className="grid grid-cols-1 gap-4">
      {sortedCompetitions.map((competition, index) => {
        const status = BiathlonAPI.getRaceStatus(competition.StartTime)
        const startTime = new Date(competition.StartTime)
        const now = time
        const diff = startTime.getTime() - now.getTime()
        const diffSeconds = Math.floor(diff / 1000)
        const diffMinutes = Math.floor(diffSeconds / 60)
        const diffHours = Math.floor(diffMinutes / 60)
        const diffDays = Math.floor(diffHours / 24)

        let statusColor = 'text-gray-600'
        let statusText = '○'
        let statusBg = 'bg-gray-900/20'
        let statusBorderColor = 'border-gray-700/50'

        if (status === 'live') {
          statusColor = 'text-green-400 animate-pulse'
          statusText = '●'
          statusBg = 'bg-green-500/10 hover:bg-green-500/20'
          statusBorderColor = 'border-green-500/50'
        } else if (status === 'upcoming') {
          statusColor = 'text-yellow-400'
          statusText = '◐'
          statusBg = 'bg-yellow-500/5 hover:bg-yellow-500/10'
          statusBorderColor = 'border-yellow-500/50'
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
          countdown = 'FINISHED'
        }

        return (
          <Link
            key={competition.RaceId}
            href={`/${locale}/event/${eventId}/race/${competition.RaceId}`}
            className={`block border ${statusBorderColor} ${statusBg} transition-all`}
          >
            <div className="p-4 grid grid-cols-12 gap-4 items-center font-mono text-sm">
              <div className="col-span-1 text-gray-500 text-right">
                #{String(index + 1).padStart(2, '0')}
              </div>

              <div className="col-span-1 text-center">
                <span className={`text-xl ${statusColor}`}>{statusText}</span>
              </div>

              <div className="col-span-5">
                <div className="text-white font-bold">{competition.Description}</div>
                <div className="text-gray-500 text-xs mt-1">
                  {competition.Short} • {competition.DisciplineId}
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

              <div className="col-span-1 text-right">
                {status === 'live' ? (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 text-xs">
                    WATCH
                  </span>
                ) : status === 'upcoming' ? (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-xs">
                    WAIT
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-700/20 text-gray-500 border border-gray-700/50 text-xs">
                    VIEW
                  </span>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
