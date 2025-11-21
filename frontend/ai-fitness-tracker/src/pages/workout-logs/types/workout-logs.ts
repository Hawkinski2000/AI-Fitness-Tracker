export interface WorkoutLog {
  id: number;
  log_date: string;
  workout_type: string | null;
  total_num_sets: number;
  total_calories_burned: number | null;
}


export interface WorkoutLogResponse {
  id: number;
  log_date: string;
  workout_type: string | null;
  total_num_sets: number;
  total_calories_burned: number | null;
  workout_log_exercises: WorkoutLogExercise[];
  exercises: Exercise[];
  exercise_sets: ExerciseSet[];
}


export interface WorkoutLogExercise {
  id: number;
  workout_log_id: number;
  exercise_id: number;
  num_sets: number;
  greatest_one_rep_max: number | null;
  unit: string | null;
}


export interface Exercise {
  id: number;
  name: string;
  description: string | null;
  exercise_type: string | null;
  body_part: string | null;
  equipment: string | null;
  level: string | null;
  base_unit: string | null;
  user_id: number | null;
  user_created_at: string | null;
}


export interface ExerciseSet {
  id: number;
  workout_log_exercise_id: number;
  weight: number | null;
  reps: number | null;
  unit: string | null;
  rest_after_secs: number | null;
  duration_secs: number | null;
  calories_burned: number | null;
  created_at: string;
  one_rep_max: number | null;
}

export interface ExerciseSetCreate {
  workout_log_exercise_id: number;
  weight: number | null;
  reps: number | null;
  unit: string | null;
  rest_after_secs: number | null;
  duration_secs: number | null;
  calories_burned: number | null;
}
