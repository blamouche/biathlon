import { Event, Competition, RaceDetails, RaceResult, AthleteBio, AthleteResult } from '../types/biathlon';

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

  /**
   * Récupère les informations biographiques d'un athlète
   */
  static async getAthleteBio(ibuId: string): Promise<AthleteBio | null> {
    try {
      const response = await fetch(
        `${API_BASE}/CISBios?IBUId=${ibuId}`,
        {
          next: { revalidate: 86400 }, // Cache pour 24 heures
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || null;
    } catch (error) {
      console.error('Error fetching athlete bio:', error);
      return null;
    }
  }

  /**
   * Récupère les résultats d'un athlète pour une saison
   */
  static async getAthleteResults(ibuId: string, seasonId: string = '2526'): Promise<AthleteResult[]> {
    try {
      // Récupère tous les événements de la saison
      const events = await this.getEvents(seasonId);
      const results: AthleteResult[] = [];

      // Pour chaque événement, récupère les compétitions
      for (const event of events) {
        const competitions = await this.getCompetitions(event.EventId);

        // Pour chaque compétition, vérifie si l'athlète a participé
        for (const comp of competitions) {
          const raceResults = await this.getResults(comp.RaceId);
          const athleteResult = raceResults.find(r => r.IBUId === ibuId);

          if (athleteResult) {
            results.push({
              RaceId: comp.RaceId,
              EventId: event.EventId,
              CompetitionName: comp.Description,
              Location: event.ShortDescription,
              Date: comp.StartTime,
              Rank: athleteResult.Rank,
              TotalTime: athleteResult.TotalTime,
              Behind: athleteResult.Behind,
              ShootingTotal: athleteResult.ShootingTotal,
              DisciplineId: comp.DisciplineId,
            });
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error fetching athlete results:', error);
      return [];
    }
  }

  /**
   * Récupère le classement général de la Coupe du monde pour une catégorie
   */
  static async getStandings(categoryId: string = 'SM', seasonId: string = '2526') {
    try {
      const response = await fetch(
        `${API_BASE}/Standings?SeasonId=${seasonId}&Level=1&CategoryId=${categoryId}`,
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
      console.error('Error fetching standings:', error);
      return [];
    }
  }
}
