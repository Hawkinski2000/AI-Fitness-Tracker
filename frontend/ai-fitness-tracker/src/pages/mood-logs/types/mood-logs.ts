export interface MoodLog {
  id: number;
  log_date: string;
  mood_score: number | null;
}

export interface MoodLogUpdate {
  mood_score?: number | null;
}
