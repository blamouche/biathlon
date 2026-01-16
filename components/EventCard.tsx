import Link from 'next/link';
import { Event } from '@/lib/types/biathlon';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
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
      <div className="group relative h-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:-translate-y-2">
        {/* Header avec gradient */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white group-hover:scale-105 transition-transform duration-300 leading-tight mb-2">
              {event.Description}
            </h3>
            <p className="text-blue-100 text-sm font-medium">{event.Organizer}</p>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-3 mb-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-slate-800 dark:text-slate-200 font-semibold text-base">
              {event.ShortDescription}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-5 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
              {startDate === endDate ? startDate : `${startDate} - ${endDate}`}
            </span>
          </div>

          {event.Comp && event.Comp.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t-2 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1.5 rounded-full">
                  {event.Comp.length} course{event.Comp.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-sm">Voir détails</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
