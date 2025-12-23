export interface WeightLog {
  id: number;
  log_date: string;
  weight: number;
  unit: string;
}

export interface WeightLogUpdate {
  weight?: number | null;
  unit?: string | null;
}
