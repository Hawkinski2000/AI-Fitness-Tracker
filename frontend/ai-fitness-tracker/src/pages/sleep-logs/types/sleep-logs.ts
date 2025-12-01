export interface SleepLog {
  id: number;
  log_date: string;
  time_to_bed: string;
  time_awake: string;
  duration: number | null;
  sleep_score: number | null;
}
