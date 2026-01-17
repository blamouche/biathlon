import { Event, Competition, RaceDetails, RaceResult, AthleteBio, AthleteResult, IntermediatesData, RangeAnalysisData, CourseAnalysisData, PreTimesData } from '../types/biathlon';

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

  /**
   * Récupère les données analytiques d'une course
   * @param raceId - ID de la course
   * @param typeId - Type d'analyse (ex: "CRST" pour course time, "RNGT" pour range time, "STTM" pour shooting time)
   */
  static async getAnalyticResults(raceId: string, typeId: string): Promise<any> {
    try {
      const url = `${API_BASE}/AnalyticResults?RaceId=${raceId}&TypeId=${typeId}`;
      console.log(`[API] Fetching ${typeId} for race ${raceId}...`);

      const response = await fetch(url, {
        next: { revalidate: 60 }, // Cache pour 1 minute (pour le live)
      });

      console.log(`[API] ${typeId} response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const resultsCount = data?.Results?.length || 0;
      console.log(`[API] ${typeId} returned ${resultsCount} results`);

      if (resultsCount > 0) {
        console.log(`[API] ${typeId} first result keys:`, Object.keys(data.Results[0]));
        console.log(`[API] ${typeId} first result sample:`, data.Results[0]);
      }

      return data;
    } catch (error) {
      console.error(`[API] Error fetching analytic results (${typeId}):`, error);
      return null;
    }
  }

  /**
   * Récupère les données des points intermédiaires d'une course
   */
  static async getIntermediates(raceId: string): Promise<IntermediatesData | null> {
    try {
      // Récupérer tous les temps de parcours par tour
      const courseTimesPromises = [];
      for (let i = 1; i <= 12; i++) {
        courseTimesPromises.push(
          this.getAnalyticResults(raceId, `CRS${i}`)
        );
      }

      const courseTimes = await Promise.all(courseTimesPromises);

      // Si aucune donnée n'est disponible
      if (courseTimes.every(ct => !ct || !ct.Results)) {
        return null;
      }

      // Transformer les données en format IntermediatesData
      // TODO: Adapter selon le format réel retourné par l'API
      return null;
    } catch (error) {
      console.error('Error fetching intermediates:', error);
      return null;
    }
  }

  /**
   * Récupère les données d'analyse des tirs au stand
   */
  static async getRangeAnalysis(raceId: string): Promise<RangeAnalysisData | null> {
    try {
      // Récupérer les temps de tir (shooting times) et temps au stand (range times)
      const [
        shootingTime1, shootingTime2, shootingTime3, shootingTime4,
        rangeTime1, rangeTime2, rangeTime3, rangeTime4,
        totalShootingTime, totalRangeTime
      ] = await Promise.all([
        this.getAnalyticResults(raceId, 'S1TM'),
        this.getAnalyticResults(raceId, 'S2TM'),
        this.getAnalyticResults(raceId, 'S3TM'),
        this.getAnalyticResults(raceId, 'S4TM'),
        this.getAnalyticResults(raceId, 'RNG1'),
        this.getAnalyticResults(raceId, 'RNG2'),
        this.getAnalyticResults(raceId, 'RNG3'),
        this.getAnalyticResults(raceId, 'RNG4'),
        this.getAnalyticResults(raceId, 'STTM'),
        this.getAnalyticResults(raceId, 'RNGT'),
      ]);

      // Si aucune donnée n'est disponible
      if (!shootingTime1?.Results && !rangeTime1?.Results) {
        return null;
      }

      // Combiner toutes les données par athlète
      const athletesMap = new Map();

      // Fonction helper pour fusionner les données
      const mergeResults = (data: any, field: string) => {
        if (!data?.Results) return;
        data.Results.forEach((result: any) => {
          const key = result.IBUId;
          if (!athletesMap.has(key)) {
            athletesMap.set(key, {
              IBUId: result.IBUId,
              Bib: result.Bib,
              FamilyName: result.FamilyName,
              GivenName: result.GivenName,
              Nat: result.Nat,
            });
          }
          athletesMap.get(key)[field] = result.TotalTime || result.Value || result.Result;
        });
      };

      mergeResults(shootingTime1, 'ShootingTime1');
      mergeResults(shootingTime2, 'ShootingTime2');
      mergeResults(shootingTime3, 'ShootingTime3');
      mergeResults(shootingTime4, 'ShootingTime4');
      mergeResults(rangeTime1, 'RangeTime1');
      mergeResults(rangeTime2, 'RangeTime2');
      mergeResults(rangeTime3, 'RangeTime3');
      mergeResults(rangeTime4, 'RangeTime4');
      mergeResults(totalShootingTime, 'ShootingTotalTime');
      mergeResults(totalRangeTime, 'RangeTotalTime');

      // Ajouter les résultats de tir depuis les résultats de base
      const results = await this.getResults(raceId);
      results.forEach(result => {
        const athlete = athletesMap.get(result.IBUId);
        if (athlete) {
          athlete.ShootingTotal = result.ShootingTotal;
        }
      });

      return {
        RaceId: raceId,
        Athletes: Array.from(athletesMap.values()),
      };
    } catch (error) {
      console.error('Error fetching range analysis:', error);
      return null;
    }
  }

  /**
   * Récupère les données d'analyse des temps de parcours
   */
  static async getCourseAnalysis(raceId: string): Promise<CourseAnalysisData | null> {
    try {
      // Récupérer les temps de parcours (course times) et temps de tour (lap times)
      const [
        courseTime1, courseTime2, courseTime3, courseTime4, courseTime5,
        lapTime1, lapTime2, lapTime3, lapTime4, lapTime5,
        totalCourseTime
      ] = await Promise.all([
        this.getAnalyticResults(raceId, 'CRST1'),
        this.getAnalyticResults(raceId, 'CRST2'),
        this.getAnalyticResults(raceId, 'CRST3'),
        this.getAnalyticResults(raceId, 'CRST4'),
        this.getAnalyticResults(raceId, 'CRST5'),
        this.getAnalyticResults(raceId, 'CRS1'),
        this.getAnalyticResults(raceId, 'CRS2'),
        this.getAnalyticResults(raceId, 'CRS3'),
        this.getAnalyticResults(raceId, 'CRS4'),
        this.getAnalyticResults(raceId, 'CRS5'),
        this.getAnalyticResults(raceId, 'CRST'),
      ]);

      // Si aucune donnée n'est disponible
      if (!courseTime1?.Results && !lapTime1?.Results) {
        return null;
      }

      // Combiner toutes les données par athlète
      const athletesMap = new Map();

      const mergeResults = (data: any, field: string) => {
        if (!data?.Results) return;
        data.Results.forEach((result: any) => {
          const key = result.IBUId;
          if (!athletesMap.has(key)) {
            athletesMap.set(key, {
              IBUId: result.IBUId,
              Bib: result.Bib,
              FamilyName: result.FamilyName,
              GivenName: result.GivenName,
              Nat: result.Nat,
            });
          }
          athletesMap.get(key)[field] = result.TotalTime || result.Value || result.Result;
        });
      };

      mergeResults(courseTime1, 'CourseTime1');
      mergeResults(courseTime2, 'CourseTime2');
      mergeResults(courseTime3, 'CourseTime3');
      mergeResults(courseTime4, 'CourseTime4');
      mergeResults(courseTime5, 'CourseTime5');
      mergeResults(lapTime1, 'LapTime1');
      mergeResults(lapTime2, 'LapTime2');
      mergeResults(lapTime3, 'LapTime3');
      mergeResults(lapTime4, 'LapTime4');
      mergeResults(lapTime5, 'LapTime5');
      mergeResults(totalCourseTime, 'CourseTotalTime');

      return {
        RaceId: raceId,
        Athletes: Array.from(athletesMap.values()),
      };
    } catch (error) {
      console.error('Error fetching course analysis:', error);
      return null;
    }
  }

  /**
   * Récupère les données de pré-temps (distances aux checkpoints)
   * Note: Cette fonctionnalité n'est pas disponible via l'API publique
   */
  static async getPreTimes(raceId: string): Promise<PreTimesData | null> {
    // Les pré-temps ne sont pas disponibles via l'API publique
    return null;
  }
}
