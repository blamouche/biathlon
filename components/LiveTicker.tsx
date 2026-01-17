'use client'

import { BiathlonAPI } from '@/lib/api/biathlon-api'
import { useEffect, useState } from 'react'

interface Competition {
  RaceId: string
  Description: string
  StartTime: string
  eventName: string
  eventId: string
}

export default function LiveTicker({
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

  const liveCompetitions = competitions.filter(comp => {
    const status = BiathlonAPI.getRaceStatus(comp.StartTime)
    return status === 'live'
  })

  if (liveCompetitions.length === 0) {
    return null
  }

  return (
    <div className="bg-black border-y border-green-500/30 overflow-hidden">
      <div className="py-3 px-4">
        <div className="flex items-center gap-4 animate-ticker">
          {liveCompetitions.map((comp, index) => (
            <div key={comp.RaceId} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-green-400 text-xl animate-pulse">▶</span>
              <span className="text-green-400 font-bold">{comp.eventName}</span>
              <span className="text-gray-500">|</span>
              <span className="text-white">{comp.Description}</span>
              <span className="text-gray-500">|</span>
              <span className="text-cyan-400">
                {new Date(comp.StartTime).toLocaleTimeString(locale, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {index < liveCompetitions.length - 1 && (
                <span className="text-gray-700 mx-4">●●●</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-ticker {
          display: flex;
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
