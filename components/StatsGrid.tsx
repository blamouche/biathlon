'use client'

import { useEffect, useState } from 'react'

interface StatsGridProps {
  totalEvents: number
  liveEvents: number
  totalCompetitions: number
  liveCompetitions: number
}

export default function StatsGrid({
  totalEvents,
  liveEvents,
  totalCompetitions,
  liveCompetitions,
}: StatsGridProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = [
    {
      label: 'TOTAL EVENTS',
      value: totalEvents,
      change: liveEvents > 0 ? `+${liveEvents} LIVE` : 'IDLE',
      trend: liveEvents > 0 ? 'up' : 'neutral',
      color: 'cyan',
    },
    {
      label: 'ACTIVE EVENTS',
      value: liveEvents,
      change: liveEvents > 0 ? 'STREAMING' : 'STANDBY',
      trend: liveEvents > 0 ? 'up' : 'neutral',
      color: 'green',
    },
    {
      label: 'TOTAL RACES',
      value: totalCompetitions,
      change: liveCompetitions > 0 ? `+${liveCompetitions} LIVE` : 'QUEUE',
      trend: liveCompetitions > 0 ? 'up' : 'neutral',
      color: 'purple',
    },
    {
      label: 'LIVE RACES',
      value: liveCompetitions,
      change: liveCompetitions > 0 ? 'IN PROGRESS' : 'WAITING',
      trend: liveCompetitions > 0 ? 'up' : 'neutral',
      color: 'yellow',
    },
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'cyan':
        return {
          border: 'border-cyan-500/50',
          bg: 'bg-cyan-500/5',
          text: 'text-cyan-400',
          glow: 'shadow-cyan-500/20',
        }
      case 'green':
        return {
          border: 'border-green-500/50',
          bg: 'bg-green-500/5',
          text: 'text-green-400',
          glow: 'shadow-green-500/20',
        }
      case 'purple':
        return {
          border: 'border-purple-500/50',
          bg: 'bg-purple-500/5',
          text: 'text-purple-400',
          glow: 'shadow-purple-500/20',
        }
      case 'yellow':
        return {
          border: 'border-yellow-500/50',
          bg: 'bg-yellow-500/5',
          text: 'text-yellow-400',
          glow: 'shadow-yellow-500/20',
        }
      default:
        return {
          border: 'border-gray-500/50',
          bg: 'bg-gray-500/5',
          text: 'text-gray-400',
          glow: 'shadow-gray-500/20',
        }
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const colors = getColorClasses(stat.color)
        return (
          <div
            key={index}
            className={`border ${colors.border} ${colors.bg} p-6 shadow-lg ${colors.glow} transition-all hover:shadow-xl`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-gray-500 text-xs font-bold tracking-widest">
                {stat.label}
              </div>
              <div className={`text-xs ${stat.trend === 'up' ? 'text-green-400' : 'text-gray-600'}`}>
                {stat.trend === 'up' ? '▲' : '━'}
              </div>
            </div>

            <div className={`text-4xl font-bold ${colors.text} mb-2 font-mono tracking-tight ${mounted ? 'animate-in' : ''}`}>
              {String(stat.value).padStart(3, '0')}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className={stat.trend === 'up' ? 'text-green-400' : 'text-gray-600'}>
                {stat.change}
              </span>
            </div>

            {/* Indicator bars */}
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 ${
                    i < (stat.value / 10) * 10 ? colors.bg : 'bg-gray-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
