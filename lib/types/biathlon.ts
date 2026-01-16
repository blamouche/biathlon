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
