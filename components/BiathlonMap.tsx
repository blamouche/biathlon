'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Event } from '@/lib/types/biathlon';
import { getVenueCoordinates } from '@/lib/data/venues';

// Fix pour les icônes Leaflet dans Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icône personnalisée pour biathlon
const biathlonIcon = L.divIcon({
  html: `
    <div style="
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      border: 3px solid white;
      font-size: 20px;
    ">
      🎯
    </div>
  `,
  className: 'custom-biathlon-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

interface BiathlonMapProps {
  events: Event[];
}

// Composant pour ajuster la vue de la carte
function MapBounds({ events }: { events: Event[] }) {
  const map = useMap();

  useEffect(() => {
    const bounds: [number, number][] = [];

    events.forEach((event) => {
      const venue = getVenueCoordinates(event.ShortDescription);
      if (venue) {
        bounds.push(venue.coordinates);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
    }
  }, [events, map]);

  return null;
}

export function BiathlonMap({ events }: BiathlonMapProps) {
  // Créer une liste unique de lieux avec leurs événements
  const venueMap = new Map<string, { venue: ReturnType<typeof getVenueCoordinates>, events: Event[] }>();

  events.forEach((event) => {
    const venue = getVenueCoordinates(event.ShortDescription);
    if (venue) {
      const key = `${venue.coordinates[0]},${venue.coordinates[1]}`;
      const existing = venueMap.get(key);
      if (existing) {
        existing.events.push(event);
      } else {
        venueMap.set(key, { venue, events: [event] });
      }
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700">
      <MapContainer
        center={[50.0, 10.0]}
        zoom={4}
        className="w-full h-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBounds events={events} />

        {Array.from(venueMap.values()).map(({ venue, events: venueEvents }) => {
          if (!venue) return null;

          return (
            <Marker
              key={`${venue.coordinates[0]},${venue.coordinates[1]}`}
              position={venue.coordinates}
              icon={biathlonIcon}
            >
              <Popup className="custom-popup" maxWidth={300}>
                <div className="p-2">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <span className="text-2xl">{venue.flag}</span>
                    {venue.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">
                    {venue.city}, {venue.country}
                  </p>

                  <div className="space-y-2">
                    {venueEvents.map((event) => (
                      <div
                        key={event.EventId}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-200"
                      >
                        <p className="font-semibold text-sm text-blue-900">
                          {event.Description}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          {formatDate(event.StartDate)} - {formatDate(event.EndDate)}
                        </p>
                        {event.Comp && event.Comp.length > 0 && (
                          <p className="text-xs text-blue-600 mt-1">
                            {event.Comp.length} course{event.Comp.length > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Légende */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700 z-[1000]">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
          Légende
        </h4>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xs">
            🎯
          </div>
          <span className="text-xs text-slate-700 dark:text-slate-300">
            Lieu de compétition
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {venueMap.size} lieu{venueMap.size > 1 ? 'x' : ''} • {events.length} étape{events.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
