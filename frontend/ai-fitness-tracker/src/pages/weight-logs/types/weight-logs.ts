export interface WeightLog {
  id: number;
  log_date: string;
  weight: number;
  unit: string;
}

export interface WeightLogCreate {
  log_date: string;
  weight: number;
  unit: string;
}
