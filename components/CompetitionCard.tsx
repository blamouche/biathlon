import Link from 'next/link';
import { Competition } from '@/lib/types/biathlon';
import { BiathlonAPI } from '@/lib/api/biathlon-api';
import { LiveBadge } from './LiveBadge';

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
      bgColor: 'bg-white dark:bg-slate-800',
      borderColor: 'border-slate-200 dark:border-slate-700',
      statusColor: 'text-slate-600 dark:text-slate-400',
    },
    live: {
      label: 'EN DIRECT',
      bgColor: 'bg-white dark:bg-slate-800',
      borderColor: 'border-red-200 dark:border-red-800',
      statusColor: 'text-red-600 dark:text-red-400',
    },
    finished: {
      label: 'Terminée',
      bgColor: 'bg-white dark:bg-slate-800',
      borderColor: 'border-slate-200 dark:border-slate-700',
      statusColor: 'text-slate-600 dark:text-slate-400',
    },
  };

  const config = statusConfig[status];

  return (
    <Link href={`/event/${eventId}/race/${competition.RaceId}`} className="block h-full">
      <div className={`group relative h-full ${config.bgColor} rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border ${config.borderColor} hover:border-blue-400 dark:hover:border-blue-500`}>
        {status === 'live' && <LiveBadge size="sm" position="absolute" />}

        <div className="p-4">
          <div className="mb-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight mb-1">
              {competition.Description}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {competition.Short}
            </p>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{formatTime(competition.StartTime)}</span>
            </div>

            {competition.km && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="font-medium">{competition.km} km</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className={`text-xs font-medium ${config.statusColor}`}>
              {status === 'live' ? 'En direct' : status === 'upcoming' ? 'À venir' : 'Terminée'}
            </span>
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
              <span>Voir</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
