import Link from 'next/link';
import { Competition } from '@/lib/types/biathlon';
import { BiathlonAPI } from '@/lib/api/biathlon-api';

interface CompetitionCardProps {
  competition: Competition;
  eventId: string;
}

export function CompetitionCard({ competition, eventId }: CompetitionCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const status = BiathlonAPI.getRaceStatus(competition.StartTime);

  const statusConfig = {
    upcoming: {
      label: 'À venir',
      color: 'bg-gradient-to-r from-slate-500 to-slate-600',
      textColor: 'text-slate-700 dark:text-slate-300',
      bgColor: 'bg-slate-50 dark:bg-slate-800/50',
      borderColor: 'border-slate-300 dark:border-slate-600',
      icon: '⏰',
    },
    live: {
      label: 'EN DIRECT',
      color: 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse',
      textColor: 'text-red-700 dark:text-red-300',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-400 dark:border-red-600',
      icon: '🔴',
    },
    finished: {
      label: 'Terminée',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      textColor: 'text-green-700 dark:text-green-300',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-300 dark:border-green-600',
      icon: '✅',
    },
  };

  const config = statusConfig[status];

  return (
    <Link href={`/event/${eventId}/race/${competition.RaceId}`} className="block h-full">
      <div className={`group h-full ${config.bgColor} rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 ${config.borderColor} hover:scale-105`}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-3">
              <h4 className={`text-lg font-bold ${config.textColor} group-hover:scale-105 transition-transform duration-300 leading-tight mb-2`}>
                {competition.Description}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide">
                {competition.Short}
              </p>
            </div>

            <span className={`${config.color} text-white text-xs font-extrabold px-3 py-2 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap`}>
              <span className="text-base">{config.icon}</span>
              <span>{config.label}</span>
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3 p-2.5 bg-white/50 dark:bg-slate-700/30 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {formatTime(competition.StartTime)}
              </span>
            </div>

            {competition.km && (
              <div className="flex items-center gap-3 p-2.5 bg-white/50 dark:bg-slate-700/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {competition.km} km
                </span>
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {status === 'live' ? 'Résultats en direct' : status === 'upcoming' ? 'Liste de départ' : 'Résultats'}
            </span>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm group-hover:translate-x-2 transition-transform duration-300">
              <span>Voir</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
