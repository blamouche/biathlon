import { BiathlonAPI } from '@/lib/api/biathlon-api';
import { EventCard } from '@/components/EventCard';

export default async function Home() {
  const events = await BiathlonAPI.getEvents('2526');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🎿</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Biathlon World Cup
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Coupe du Monde 2025-2026
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Étapes de la saison
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Suivez toutes les étapes de la Coupe du Monde de biathlon en direct
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Chargement des événements...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.EventId} event={event} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 mt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Données fournies par biathlonresults.com
          </p>
        </div>
      </footer>
    </div>
  );
}
