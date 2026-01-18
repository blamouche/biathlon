import { Event, Competition, RaceDetails, RaceResult, AthleteBio, AthleteResult, IntermediatesData, RangeAnalysisData, CourseAnalysisData, PreTimesData } from '../types/biathlon';

const API_BASE = 'https://biathlonresults.com/modules/sportapi/api';

export class BiathlonAPI {

  /**
   * Fetch World Cup events for a season
   * @param seasonId - Format: "2425" for 2024-2025
   */
  static async getEvents(seasonId: string = '2526'): Promise<Event[]> {
    try {
      const response = await fetch(
        `${API_BASE}/Events?SeasonId=${seasonId}&Level=1`,
        {
          next: { revalidate: 3600 }, // Cache for 1 hour
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
   * Fetch competitions for a specific event
   */
  static async getCompetitions(eventId: string): Promise<Competition[]> {
    try {
      const response = await fetch(
        `${API_BASE}/Competitions?EventId=${eventId}`,
        {
          next: { revalidate: 600 }, // Cache for 10 minutes
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
   * Fetch race results
   */
  static async getResults(raceId: string): Promise<RaceResult[]> {
    try {
      const response = await fetch(
        `${API_BASE}/Results?RaceId=${raceId}`,
        {
          next: { revalidate: 60 }, // Cache for 1 minute (for live data)
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
   * Fetch complete race details
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
   * Determine race status (upcoming, live, finished)
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
   * Fetch athlete biographical information
   */
  static async getAthleteBio(ibuId: string): Promise<AthleteBio | null> {
    try {
      const response = await fetch(
        `${API_BASE}/CISBios?IBUId=${ibuId}`,
        {
          next: { revalidate: 86400 }, // Cache for 24 hours
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
   * Fetch athlete results for a season
   */
  static async getAthleteResults(ibuId: string, seasonId: string = '2526'): Promise<AthleteResult[]> {
    try {
      // Fetch all season events
      const events = await this.getEvents(seasonId);
      const results: AthleteResult[] = [];

      // For each event, fetch competitions
      for (const event of events) {
        const competitions = await this.getCompetitions(event.EventId);

        // For each competition, check if athlete participated
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
   * Fetch World Cup overall standings for a category
   * @param categoryId - 'SM' for Senior Men, 'SW' for Senior Women
   * @param seasonId - Format: "2526" for 2025-2026
   */
  static async getStandings(categoryId: string = 'SM', seasonId: string = '2526') {
    try {
      // Build the CupId based on category and season
      // Format: BT{season}SWRLCP__{category}TS
      // Example: BT2526SWRLCP__SMTS for Men's World Cup Total Score 2025-2026
      const categoryCode = categoryId === 'SM' ? 'SMTS' : 'SWTS';
      const cupId = `BT${seasonId}SWRLCP__${categoryCode}`;

      const response = await fetch(
        `${API_BASE}/CupResults?CupId=${cupId}`,
        {
          next: { revalidate: 3600 }, // Cache for 1 hour
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // The API returns data in a Rows array
      if (data?.Rows && Array.isArray(data.Rows)) {
        // Transform the data to match our StandingsEntry interface
        return data.Rows.map((row: any) => {
          // Name is in format "FAMILY Given" - split it
          const nameParts = row.Name ? row.Name.split(' ') : ['', ''];
          const familyName = nameParts[0] || '';
          const givenName = nameParts.slice(1).join(' ') || '';

          return {
            Rank: row.Rank,
            IBUId: row.IBUId,
            FamilyName: familyName,
            GivenName: givenName,
            Nat: row.Nat,
            TotalScore: parseInt(row.Score) || 0,
          };
        });
      }

      // Fallback to other possible structures
      if (Array.isArray(data)) {
        return data;
      } else if (data?.Standings && Array.isArray(data.Standings)) {
        return data.Standings;
      } else if (data?.Data && Array.isArray(data.Data)) {
        return data.Data;
      } else if (data?.Results && Array.isArray(data.Results)) {
        return data.Results;
      }

      console.log('Unexpected standings data structure for CupId:', cupId, data);
      return [];
    } catch (error) {
      console.error('Error fetching standings:', error);
      return [];
    }
  }

  /**
   * Fetch race analytical data
   * @param raceId - Race ID
   * @param typeId - Analysis type (e.g., "CRST" for course time, "RNGT" for range time, "STTM" for shooting time)
   */
  static async getAnalyticResults(raceId: string, typeId: string): Promise<any> {
    try {
      const url = `${API_BASE}/AnalyticResults?RaceId=${raceId}&TypeId=${typeId}`;
      console.log(`[API] Fetching ${typeId} for race ${raceId}...`);

      const response = await fetch(url, {
        next: { revalidate: 60 }, // Cache for 1 minute (for live data)
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
   * Fetch intermediate checkpoint data for a race
   */
  static async getIntermediates(raceId: string): Promise<IntermediatesData | null> {
    try {
      // Fetch all lap times
      const courseTimesPromises = [];
      for (let i = 1; i <= 12; i++) {
        courseTimesPromises.push(
          this.getAnalyticResults(raceId, `CRS${i}`)
        );
      }

      const courseTimes = await Promise.all(courseTimesPromises);

      // If no data is available
      if (courseTimes.every(ct => !ct || !ct.Results)) {
        return null;
      }

      // Transform data to IntermediatesData format
      // TODO: Adapt to actual API format
      return null;
    } catch (error) {
      console.error('Error fetching intermediates:', error);
      return null;
    }
  }

  /**
   * Fetch shooting range analysis data
   */
  static async getRangeAnalysis(raceId: string): Promise<RangeAnalysisData | null> {
    try {
      // Fetch shooting times and range times
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

      // If no data is available
      if (!shootingTime1?.Results && !rangeTime1?.Results) {
        return null;
      }

      // Combine all data by athlete
      const athletesMap = new Map();

      // Helper function to merge data
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

      // Add shooting results from base results
      const results = await this.getResults(raceId);
      results.forEach(result => {
        const athlete = athletesMap.get(result.IBUId);
        if (athlete) {
          athlete.ShootingTotal = result.ShootingTotal;
          athlete.Shootings = result.Shootings; // Format "0+0" (prone+standing)
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
   * Fetch course time analysis data
   */
  static async getCourseAnalysis(raceId: string): Promise<CourseAnalysisData | null> {
    try {
      // Fetch lap times
      // Note: TypeIds CRST1-5 don't exist in the API
      // CRS1-12 correspond to lap times, but only CRS1-3 are available for Sprints
      const [
        lapTime1, lapTime2, lapTime3, lapTime4, lapTime5,
        totalCourseTime
      ] = await Promise.all([
        this.getAnalyticResults(raceId, 'CRS1'),
        this.getAnalyticResults(raceId, 'CRS2'),
        this.getAnalyticResults(raceId, 'CRS3'),
        this.getAnalyticResults(raceId, 'CRS4'),
        this.getAnalyticResults(raceId, 'CRS5'),
        this.getAnalyticResults(raceId, 'CRST'),
      ]);

      // If no data is available
      if (!lapTime1?.Results && !totalCourseTime?.Results) {
        return null;
      }

      // Combine all data by athlete
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
   * Fetch pre-times data (distances to checkpoints)
   * Note: This feature is not available via the public API
   */
  static async getPreTimes(raceId: string): Promise<PreTimesData | null> {
    // Pre-times are not available via the public API
    return null;
  }
}
