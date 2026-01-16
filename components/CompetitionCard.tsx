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
      color: 'bg-gray-500',
      icon: '⏰',
    },
    live: {
      label: 'En direct',
      color: 'bg-red-500 animate-pulse',
      icon: '🔴',
    },
    finished: {
      label: 'Terminée',
      color: 'bg-green-500',
      icon: '✓',
    },
  };

  const config = statusConfig[status];

  return (
    <Link href={`/event/${eventId}/race/${competition.RaceId}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-400">
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {competition.Description}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {competition.Short}
              </p>
            </div>

            <span className={`${config.color} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1`}>
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatTime(competition.StartTime)}</span>
          </div>

          {competition.km && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mt-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{competition.km} km</span>
            </div>
          )}

          <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
            Voir les détails
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
