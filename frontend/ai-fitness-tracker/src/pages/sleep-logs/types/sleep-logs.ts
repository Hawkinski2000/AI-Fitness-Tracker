export interface SleepLog {
  id: number;
  log_date: string;
  time_to_bed: string | null;
  time_awake: string | null;
  duration: number | null;
  sleep_score: number | null;
}

export interface SleepLogUpdate {
  time_to_bed?: string | null;
  time_awake?: string | null;
  duration?: number | null;
  sleep_score?: number | null;
}
