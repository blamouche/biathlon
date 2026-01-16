import { BiathlonAPI } from '@/lib/api/biathlon-api';
import { EventCard } from '@/components/EventCard';

// Fonction pour déterminer le statut d'un événement
function getEventStatus(startDate: string, endDate: string): 'ongoing' | 'upcoming' | 'finished' {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now >= start && now <= end) {
    return 'ongoing';
  } else if (now < start) {
    return 'upcoming';
  } else {
    return 'finished';
  }
}

export default async function Home() {
  const eventsData = await BiathlonAPI.getEvents('2526');

  // Trier les événements : en cours > à venir > terminés
  const events = [...eventsData].sort((a, b) => {
    const statusA = getEventStatus(a.StartDate, a.EndDate);
    const statusB = getEventStatus(b.StartDate, b.EndDate);

    const statusOrder = { ongoing: 0, upcoming: 1, finished: 2 };

    // Si les statuts sont différents, trier par statut
    if (statusA !== statusB) {
      return statusOrder[statusA] - statusOrder[statusB];
    }

    // Si même statut, trier par date de début
    return new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Header avec design amélioré */}
      <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-2xl sticky top-0 z-50 overflow-hidden">
        {/* Décorations d'arrière-plan */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-36 -mb-36"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-black text-white mb-1 tracking-tight">
                  Biathlon World Cup
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-blue-100 text-base font-semibold">
                    Saison 2025-2026
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                    🔴 LIVE
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-white/80 text-xs font-medium">Dernière mise à jour</p>
                <p className="text-white font-bold text-sm">
                  {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section d'introduction */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Étapes de la Coupe du Monde
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Suivez toutes les étapes en direct avec résultats, classements et statistiques
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 border-slate-200 dark:border-slate-700">
            <div className="text-8xl mb-6 animate-pulse">⏳</div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Chargement des événements
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Récupération des données de la Coupe du Monde...
            </p>
          </div>
        ) : (
          <>
            {/* Grille des événements */}
            <div className="space-y-12">
              {/* Événements en cours */}
              {events.filter(e => getEventStatus(e.StartDate, e.EndDate) === 'ongoing').length > 0 && (
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow-lg">
                      <span className="text-xl animate-pulse">🔴</span>
                      <h3 className="text-xl font-black">EN COURS</h3>
                    </div>
                    <div className="h-1 flex-1 bg-gradient-to-r from-red-400 to-transparent rounded"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events
                      .filter(e => getEventStatus(e.StartDate, e.EndDate) === 'ongoing')
                      .map((event) => (
                        <EventCard key={event.EventId} event={event} />
                      ))}
                  </div>
                </div>
              )}

              {/* Événements à venir */}
              {events.filter(e => getEventStatus(e.StartDate, e.EndDate) === 'upcoming').length > 0 && (
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
                      <span className="text-xl">📅</span>
                      <h3 className="text-xl font-black">À VENIR</h3>
                    </div>
                    <div className="h-1 flex-1 bg-gradient-to-r from-blue-400 to-transparent rounded"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events
                      .filter(e => getEventStatus(e.StartDate, e.EndDate) === 'upcoming')
                      .map((event) => (
                        <EventCard key={event.EventId} event={event} />
                      ))}
                  </div>
                </div>
              )}

              {/* Événements terminés */}
              {events.filter(e => getEventStatus(e.StartDate, e.EndDate) === 'finished').length > 0 && (
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white px-4 py-2 rounded-full shadow-lg">
                      <span className="text-xl">✅</span>
                      <h3 className="text-xl font-black">TERMINÉS</h3>
                    </div>
                    <div className="h-1 flex-1 bg-gradient-to-r from-slate-400 to-transparent rounded"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events
                      .filter(e => getEventStatus(e.StartDate, e.EndDate) === 'finished')
                      .map((event) => (
                        <EventCard key={event.EventId} event={event} />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer amélioré */}
      <footer className="mt-20 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-t-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">
              🎯 Données officielles fournies par <span className="font-bold text-white">biathlonresults.com</span>
            </p>
            <p className="text-slate-500 text-xs">
              © 2026 Biathlon World Cup Tracker • Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
