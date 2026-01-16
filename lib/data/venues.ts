export interface VenueLocation {
  name: string;
  city: string;
  country: string;
  coordinates: [number, number]; // [latitude, longitude]
  flag: string;
}

export const BIATHLON_VENUES: Record<string, VenueLocation> = {
  // Europe
  'Kontiolahti': {
    name: 'Kontiolahti',
    city: 'Kontiolahti',
    country: 'Finland',
    coordinates: [62.6667, 29.8333],
    flag: '🇫🇮'
  },
  'Hochfilzen': {
    name: 'Hochfilzen',
    city: 'Hochfilzen',
    country: 'Austria',
    coordinates: [47.4667, 12.6167],
    flag: '🇦🇹'
  },
  'Oberhof': {
    name: 'Oberhof',
    city: 'Oberhof',
    country: 'Germany',
    coordinates: [50.7047, 10.7289],
    flag: '🇩🇪'
  },
  'Ruhpolding': {
    name: 'Ruhpolding',
    city: 'Ruhpolding',
    country: 'Germany',
    coordinates: [47.7572, 12.6553],
    flag: '🇩🇪'
  },
  'Antholz': {
    name: 'Antholz-Anterselva',
    city: 'Anterselva',
    country: 'Italy',
    coordinates: [46.7500, 12.0833],
    flag: '🇮🇹'
  },
  'Anterselva': {
    name: 'Antholz-Anterselva',
    city: 'Anterselva',
    country: 'Italy',
    coordinates: [46.7500, 12.0833],
    flag: '🇮🇹'
  },
  'Nove Mesto': {
    name: 'Nové Město na Moravě',
    city: 'Nové Město',
    country: 'Czech Republic',
    coordinates: [49.5614, 16.0753],
    flag: '🇨🇿'
  },
  'Oslo': {
    name: 'Oslo Holmenkollen',
    city: 'Oslo',
    country: 'Norway',
    coordinates: [59.9633, 10.6678],
    flag: '🇳🇴'
  },
  'Holmenkollen': {
    name: 'Oslo Holmenkollen',
    city: 'Oslo',
    country: 'Norway',
    coordinates: [59.9633, 10.6678],
    flag: '🇳🇴'
  },
  'Pokljuka': {
    name: 'Pokljuka',
    city: 'Pokljuka',
    country: 'Slovenia',
    coordinates: [46.3167, 13.9333],
    flag: '🇸🇮'
  },
  'Annecy': {
    name: 'Annecy - Le Grand-Bornand',
    city: 'Le Grand-Bornand',
    country: 'France',
    coordinates: [45.9414, 6.4281],
    flag: '🇫🇷'
  },
  'Le Grand-Bornand': {
    name: 'Annecy - Le Grand-Bornand',
    city: 'Le Grand-Bornand',
    country: 'France',
    coordinates: [45.9414, 6.4281],
    flag: '🇫🇷'
  },

  // Amérique du Nord
  'Soldier Hollow': {
    name: 'Soldier Hollow',
    city: 'Midway, Utah',
    country: 'USA',
    coordinates: [40.4800, -111.4800],
    flag: '🇺🇸'
  },
  'Canmore': {
    name: 'Canmore',
    city: 'Canmore',
    country: 'Canada',
    coordinates: [51.0881, -115.3608],
    flag: '🇨🇦'
  },

  // Asie
  'Beijing': {
    name: 'Beijing',
    city: 'Beijing',
    country: 'China',
    coordinates: [40.6203, 116.2072],
    flag: '🇨🇳'
  },
  'Otepaa': {
    name: 'Otepää',
    city: 'Otepää',
    country: 'Estonia',
    coordinates: [58.0586, 26.4953],
    flag: '🇪🇪'
  }
};

/**
 * Essaie de trouver les coordonnées d'un lieu à partir de son nom
 */
export function getVenueCoordinates(locationName: string): VenueLocation | null {
  // Recherche exacte
  if (BIATHLON_VENUES[locationName]) {
    return BIATHLON_VENUES[locationName];
  }

  // Recherche partielle (insensible à la casse)
  const searchTerm = locationName.toLowerCase();
  const found = Object.entries(BIATHLON_VENUES).find(([key, venue]) =>
    key.toLowerCase().includes(searchTerm) ||
    venue.city.toLowerCase().includes(searchTerm) ||
    venue.name.toLowerCase().includes(searchTerm)
  );

  return found ? found[1] : null;
}

/**
 * Récupère toutes les coordonnées des événements
 */
export function getAllVenueLocations(): VenueLocation[] {
  return Object.values(BIATHLON_VENUES);
}
