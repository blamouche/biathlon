'use client'

interface CompactStatsCardProps {
  label: string
  value: number
  percentage?: number
  color?: 'cyan' | 'green' | 'yellow' | 'purple'
}

export default function CompactStatsCard({
  label,
  value,
  percentage,
  color = 'cyan',
}: CompactStatsCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'cyan':
        return {
          border: 'border-cyan-500/50',
          bg: 'bg-cyan-500/5',
          text: 'text-cyan-400',
        }
      case 'green':
        return {
          border: 'border-green-500/50',
          bg: 'bg-green-500/5',
          text: 'text-green-400',
        }
      case 'purple':
        return {
          border: 'border-purple-500/50',
          bg: 'bg-purple-500/5',
          text: 'text-purple-400',
        }
      case 'yellow':
        return {
          border: 'border-yellow-500/50',
          bg: 'bg-yellow-500/5',
          text: 'text-yellow-400',
        }
      default:
        return {
          border: 'border-gray-500/50',
          bg: 'bg-gray-500/5',
          text: 'text-gray-400',
        }
    }
  }

  const colors = getColorClasses(color)

  return (
    <div
      className={`border ${colors.border} ${colors.bg} p-4 transition-all hover:shadow-lg`}
    >
      <div className="text-gray-500 text-xs font-bold tracking-widest mb-3">
        {label}
      </div>

      <div className="flex items-center justify-between">
        <div className={`text-3xl font-bold ${colors.text} font-mono`}>
          {value}
        </div>
        {percentage !== undefined && (
          <div className="flex items-center gap-1">
            <span className="text-gray-500">|</span>
            <span className={`text-2xl font-bold ${colors.text} font-mono`}>
              {percentage}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
