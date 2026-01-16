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
    <Link href={`/event/${event.EventId}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
          <h3 className="text-xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
            {event.Description}
          </h3>
          <p className="text-blue-100 text-sm mt-1">{event.Organizer}</p>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {event.ShortDescription}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              {startDate === endDate ? startDate : `${startDate} - ${endDate}`}
            </span>
          </div>

          {event.Comp && event.Comp.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {event.Comp.length} compétition{event.Comp.length > 1 ? 's' : ''}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform duration-300">
                Voir détails →
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
