export interface Event {
  EventId: string;
  EventClassificationId: string;
  ShortDescription: string;
  Description: string;
  Organizer: string;
  StartDate: string;
  EndDate: string;
  Level: string;
  SeasonId: string;
  UTCOffset: number;
  Comp?: Competition[];
}

export interface Competition {
  RaceId: string;
  EventId: string;
  catId: string;
  DisciplineId: string;
  Short: string;
  Description: string;
  StartTime: string;
  km?: number;
  Status?: string;
}

export interface RaceResult {
  IBUId: string;
  FamilyName: string;
  GivenName: string;
  Bib: number;
  Rank: number | string;
  ShootingTotal: string;
  ShootingProne?: number;
  ShootingStanding?: number;
  TotalTime: string;
  Behind: string;
  Nat: string;
  Result?: {
    Rank: number | string;
    ShootingTotal: string;
    TotalTime: string;
    Behind: string;
  };
}

export interface RaceDetails {
  RaceId: string;
  EventId: string;
  Short: string;
  Description: string;
  StartTime: string;
  Status: string;
  Results?: RaceResult[];
}

export enum RaceStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  FINISHED = 'finished'
}

export interface AthleteBio {
  IBUId: string;
  FamilyName: string;
  GivenName: string;
  Nat: string;
  NatLong?: string;
  Birthdate?: string;
  GenderId?: string;
}

export interface AthleteResult {
  RaceId: string;
  EventId: string;
  CompetitionName: string;
  Location: string;
  Date: string;
  Rank: number | string;
  TotalTime: string;
  Behind: string;
  ShootingTotal: string;
  DisciplineId?: string;
}

export interface StandingsEntry {
  Rank: number | string;
  IBUId: string;
  FamilyName: string;
  GivenName: string;
  Nat: string;
  TotalScore: number;
}

// Données des points intermédiaires
export interface IntermediatePoint {
  Distance: string;        // ex: "1.7km", "2.0km (PT)", "→ Shooting 1"
  DistanceValue: number;   // Valeur numérique en km
  Type: 'distance' | 'shooting' | 'finish'; // Type de point
  Name?: string;           // Nom optionnel (ex: "Shooting 1")
}

export interface AthleteIntermediate {
  IBUId: string;
  Bib: number;
  FamilyName: string;
  GivenName: string;
  Nat: string;
  Splits: {
    [distance: string]: string; // ex: "1.7km": "4:23.5", "→ Shooting 1": "5:12.0"
  };
}

export interface IntermediatesData {
  RaceId: string;
  Points: IntermediatePoint[];
  Athletes: AthleteIntermediate[];
}

// Analyse des tirs au stand
export interface ShootingAnalysis {
  IBUId: string;
  Bib: number;
  FamilyName: string;
  GivenName: string;
  Nat: string;
  // Temps de tir
  ShootingTime1?: string;    // Temps de tir au 1er stand
  ShootingTime2?: string;    // Temps de tir au 2e stand
  ShootingTime3?: string;    // Temps de tir au 3e stand
  ShootingTime4?: string;    // Temps de tir au 4e stand
  ShootingTotalTime?: string; // Temps total de tir
  // Temps au stand (incluant passage)
  RangeTime1?: string;       // Temps total au stand 1
  RangeTime2?: string;       // Temps total au stand 2
  RangeTime3?: string;       // Temps total au stand 3
  RangeTime4?: string;       // Temps total au stand 4
  RangeTotalTime?: string;   // Temps total au stand
  // Résultats de tir
  Shootings?: string;        // ex: "0+0" (prone+standing) ou "1+2" (1 erreur couché, 2 debout)
  Shooting1?: string;        // ex: "5" (5 cibles touchées) - Rarement disponible
  Shooting2?: string;
  Shooting3?: string;
  Shooting4?: string;
  ShootingTotal?: string;    // ex: "3" (3 erreurs au total)
}

export interface RangeAnalysisData {
  RaceId: string;
  Athletes: ShootingAnalysis[];
}

// Analyse des temps de parcours
export interface CourseAnalysis {
  IBUId: string;
  Bib: number;
  FamilyName: string;
  GivenName: string;
  Nat: string;
  // Temps de parcours par section
  CourseTime1?: string;      // Temps du 1er tronçon de ski
  CourseTime2?: string;      // Temps du 2e tronçon de ski
  CourseTime3?: string;      // Temps du 3e tronçon de ski
  CourseTime4?: string;      // Temps du 4e tronçon de ski
  CourseTime5?: string;      // Temps du 5e tronçon de ski
  CourseTotalTime?: string;  // Temps total de ski
  // Temps de tour
  LapTime1?: string;         // Temps du tour 1
  LapTime2?: string;         // Temps du tour 2
  LapTime3?: string;         // Temps du tour 3
  LapTime4?: string;         // Temps du tour 4
  LapTime5?: string;         // Temps du tour 5
}

export interface CourseAnalysisData {
  RaceId: string;
  Athletes: CourseAnalysis[];
}

// Données de pré-temps (distances aux checkpoints)
export interface PreTimePoint {
  Distance: string;          // ex: "2.0km", "Shooting 1", "5.3km"
  DistanceValue: number;     // Valeur numérique en km
  Type: 'distance' | 'shooting' | 'finish';
}

export interface AthletePreTime {
  IBUId: string;
  Bib: number;
  FamilyName: string;
  GivenName: string;
  Nat: string;
  CurrentDistance?: number;  // Distance actuelle de l'athlète en km
  PreTimes: {
    [checkpoint: string]: string; // ex: "2.0km": "0.3km", "Shooting 1": "1.2km"
  };
}

export interface PreTimesData {
  RaceId: string;
  Points: PreTimePoint[];
  Athletes: AthletePreTime[];
}
