import { Event, Competition, RaceDetails, RaceResult } from '../types/biathlon';

const API_BASE = 'https://biathlonresults.com/modules/sportapi/api';

export class BiathlonAPI {

  /**
   * Récupère les événements de la coupe du monde pour une saison
   * @param seasonId - Format: "2425" pour 2024-2025
   */
  static async getEvents(seasonId: string = '2526'): Promise<Event[]> {
    try {
      const response = await fetch(
        `${API_BASE}/Events?SeasonId=${seasonId}&Level=1`,
        {
          next: { revalidate: 3600 }, // Cache pour 1 heure
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  /**
   * Récupère les compétitions pour un événement spécifique
   */
  static async getCompetitions(eventId: string): Promise<Competition[]> {
    try {
      const response = await fetch(
        `${API_BASE}/Competitions?EventId=${eventId}`,
        {
          next: { revalidate: 600 }, // Cache pour 10 minutes
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching competitions:', error);
      return [];
    }
  }

  /**
   * Récupère les résultats d'une course
   */
  static async getResults(raceId: string): Promise<RaceResult[]> {
    try {
      const response = await fetch(
        `${API_BASE}/Results?RaceId=${raceId}`,
        {
          next: { revalidate: 60 }, // Cache pour 1 minute (pour le live)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data?.Results || [];
    } catch (error) {
      console.error('Error fetching results:', error);
      return [];
    }
  }

  /**
   * Récupère les détails complets d'une course
   */
  static async getRaceDetails(raceId: string): Promise<RaceDetails | null> {
    try {
      const response = await fetch(
        `${API_BASE}/RaceDetails?RaceId=${raceId}`,
        {
          next: { revalidate: 60 },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching race details:', error);
      return null;
    }
  }

  /**
   * Détermine le statut d'une course (à venir, en cours, terminée)
   */
  static getRaceStatus(startTime: string): 'upcoming' | 'live' | 'finished' {
    const now = new Date();
    const start = new Date(startTime);
    const estimatedEnd = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2h

    if (now < start) {
      return 'upcoming';
    } else if (now >= start && now <= estimatedEnd) {
      return 'live';
    } else {
      return 'finished';
    }
  }
}
