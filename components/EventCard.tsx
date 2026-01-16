import Link from 'next/link';
import { Event } from '@/lib/types/biathlon';
import { LiveBadge } from './LiveBadge';

interface EventCardProps {
  event: Event;
  hasLiveRace?: boolean;
}

export function EventCard({ event, hasLiveRace }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const startDate = formatDate(event.StartDate);
  const endDate = formatDate(event.EndDate);

  return (
    <Link href={`/event/${event.EventId}`} className="block h-full">
      <div className="group relative h-full bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500">
        {hasLiveRace && <LiveBadge size="sm" position="absolute" />}

        {/* Header simplifié */}
        <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-5">
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white leading-tight mb-1">
              {event.Description}
            </h3>
            <p className="text-blue-50 text-xs font-medium opacity-90">{event.Organizer}</p>
          </div>
        </div>

        {/* Contenu simplifié */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3 text-slate-600 dark:text-slate-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">{event.ShortDescription}</span>
          </div>

          <div className="flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">
              {startDate === endDate ? startDate : `${startDate} - ${endDate}`}
            </span>
          </div>

          {event.Comp && event.Comp.length > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {event.Comp.length} course{event.Comp.length > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                <span>Voir</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
