import axios from 'axios';
import {
  type WorkoutLog,
  type WorkoutLogResponse,
  type WorkoutLogExercise,
  type Exercise,
  type ExerciseSet,
  type ExerciseSetCreate
} from "../pages/workout-logs/types/workout-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { API_BASE_URL } from '../config/api';
import { getDateKey } from "./dates";


export const loadWorkoutLog = async (
  logDate: Value,
  setWorkoutLogs: React.Dispatch<React.SetStateAction<Record<string, WorkoutLog>>>,
  setWorkoutLogExercises: React.Dispatch<React.SetStateAction<Record<number, WorkoutLogExercise[]>>>,
  setExercises: React.Dispatch<React.SetStateAction<Record<number, Exercise>>>,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<number, ExerciseSet[]>>>,
  token: string,
  expand?: string[]
) => {
  const date = getDateKey(logDate);
  if (!date) {
    return;
  }

  const workoutLogsResponse = await axios.get(`${API_BASE_URL}/workout-logs`,
    {
      params: {
        date,
        expand
      },
      paramsSerializer: params => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else if (value !== undefined) {
            searchParams.append(key, value as string);
          }
        });
        return searchParams.toString();
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (workoutLogsResponse.data.length === 0) {
    setWorkoutLogs({});
    return null;
  }

  const workoutLogsResponseObject: WorkoutLogResponse = workoutLogsResponse.data[0];

  setWorkoutLogs(prev => ({
    ...prev,
    [date]: {
      id: workoutLogsResponseObject.id,
      log_date: workoutLogsResponseObject.log_date,
      workout_type: workoutLogsResponseObject.workout_type,
      total_num_sets: workoutLogsResponseObject.total_num_sets,
      total_calories_burned: workoutLogsResponseObject.total_calories_burned
    }
  }));

  if (workoutLogsResponseObject.workout_log_exercises) {
    setWorkoutLogExercises(prev => ({
      ...prev,
      [workoutLogsResponseObject.id]: workoutLogsResponseObject.workout_log_exercises
    }));
  }

  if (workoutLogsResponseObject.exercises) {
    const newExercises: Record<number, Exercise> = {};

     workoutLogsResponseObject.exercises.forEach((exercise: Exercise) => {
      newExercises[exercise.id] = exercise;
    });

    setExercises(prev => ({
      ...prev,
      ...newExercises
    }));
  }

  if (workoutLogsResponseObject.exercise_sets) {
    const newExerciseSets: Record<number, ExerciseSet[]> = {};

    workoutLogsResponseObject.exercise_sets.forEach((exerciseSet: ExerciseSet) => {
      const wleId = exerciseSet.workout_log_exercise_id;
      if (!newExerciseSets[wleId]) {
        newExerciseSets[wleId] = [];
      }
      newExerciseSets[wleId].push(exerciseSet);
    });

    setExerciseSets(prev => ({
      ...prev,
      ...newExerciseSets
    }));
  }

  return workoutLogsResponseObject;
};

export const createWorkoutLog = async (
  logDate: Value,
  setWorkoutLogs: React.Dispatch<React.SetStateAction<Record<string, WorkoutLog>>>,
  token: string
) => {
  const date = getDateKey(logDate);
  if (!date) {
    return;
  }

  const workoutLogResponse = await axios.post(`${API_BASE_URL}/workout-logs`,
    {
      log_date: date
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const workoutLog = workoutLogResponse.data;

  setWorkoutLogs(prev => ({
    ...prev,
    [date]: workoutLog
  }));

  return workoutLog;
};

// ---------------------------------------------------------------------------

export const loadWorkoutLogExercises = async (
  workoutLogId: number,
  setWorkoutLogExercises: React.Dispatch<React.SetStateAction<Record<number, WorkoutLogExercise[]>>>,
  token: string
) => {
  const workoutLogExercisesResponse = await axios.get(`${API_BASE_URL}/workout-log-exercises/${workoutLogId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (workoutLogExercisesResponse.data.length === 0) {
    return {};
  }
  
  const workoutLogExercises: Record<number, WorkoutLogExercise[]> = {};
  workoutLogExercisesResponse.data.forEach((workoutLogExercise: WorkoutLogExercise) => {
    const workoutLogExerciseObject = {
      id: workoutLogExercise.id,
      workout_log_id: workoutLogExercise.workout_log_id,
      exercise_id: workoutLogExercise.exercise_id,
      num_sets: workoutLogExercise.num_sets,
      greatest_one_rep_max: workoutLogExercise.greatest_one_rep_max || null,
      unit: workoutLogExercise.unit || null
    };

    workoutLogExercises[workoutLogId] = workoutLogExercises[workoutLogId] || [];
    workoutLogExercises[workoutLogId].push(workoutLogExerciseObject);
  });

  setWorkoutLogExercises(prev => ({
    ...prev,
    ...workoutLogExercises
  }));

  return workoutLogExercises;
};

export const addWorkoutLogExercise = async (
  workoutLogId: number,
  exerciseId: number,
  setWorkoutLogExercises: React.Dispatch<React.SetStateAction<Record<number, WorkoutLogExercise[]>>>,
  setExercises: React.Dispatch<React.SetStateAction<Record<number, Exercise>>>,
  token: string
) => {
  const workoutLogExerciseResponse = await axios.post(`${API_BASE_URL}/workout-log-exercises`,
    {
      workout_log_id: workoutLogId,
      exercise_id: exerciseId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const workoutLogExercise: WorkoutLogExercise = workoutLogExerciseResponse.data;

  setWorkoutLogExercises(prev => ({
    ...prev,
    [workoutLogId]: [...(prev[workoutLogId] || []), workoutLogExercise]
  }));

  loadExercise(exerciseId, setExercises, token);

  return workoutLogExercise;
};

// export const updateMealLogFood = async (
//   mealLogFoodId: number,
//   mealLogId: number | null,
//   numServings: number | null = null,
//   servingSize: number | null = null,
//   foodsMenuOpenMealType: string,
//   setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
//   token: string
// ) => {
//   const mealLogFoodResponse = await axios.patch(`${API_BASE_URL}/meal-log-foods/${mealLogFoodId}`,
//     {
//       ...(mealLogId !== null && { meal_log_id: mealLogId }),
//       ...(foodsMenuOpenMealType !== null && { meal_type: foodsMenuOpenMealType }),
//       ...(numServings !== null && { num_servings: numServings }),
//       ...(servingSize !== null && { serving_size: servingSize })
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   const updatedMealLogFood = mealLogFoodResponse.data;

//   setMealLogFoods(prev => {
//     const currentMealLogFoods = prev[updatedMealLogFood.meal_log_id];

//     const updatedMealLogFoods = currentMealLogFoods.map((mealLogFood: MealLogFood) =>
//       mealLogFood.id === mealLogFoodId ? updatedMealLogFood : mealLogFood
//     );

//     return {
//       ...prev,
//       [updatedMealLogFood.meal_log_id]: updatedMealLogFoods
//     };
//   });
// };

export const copyWorkoutLogExercises = async (
  targetWorkoutLogId: number,
  targetWorkoutLogDate: Value,
  workoutLogExerciseIds: number[],
  setWorkoutLogs: React.Dispatch<React.SetStateAction<Record<string, WorkoutLog>>>,
  setWorkoutLogExercises: React.Dispatch<React.SetStateAction<Record<number, WorkoutLogExercise[]>>>,
  setExercises: React.Dispatch<React.SetStateAction<Record<number, Exercise>>>,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<number, ExerciseSet[]>>>,
  token: string
) => {
  await axios.post(`${API_BASE_URL}/workout-log-exercises/bulk`,
    {
      action: "copy",
      ids: workoutLogExerciseIds,
      target_workout_log_id: targetWorkoutLogId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  await loadWorkoutLog(
    targetWorkoutLogDate,
    setWorkoutLogs,
    setWorkoutLogExercises,
    setExercises,
    setExerciseSets,
    token,
    [
      "workoutLogExercises",
      "workoutLogExercises.exercise",
      "workoutLogExercises.exerciseSets"
    ]
  );
}

export const moveWorkoutLogExercises = async (
  currentWorkoutLogId: number,
  workoutLogExerciseIds: number[],
  targetWorkoutLogId: number,
  setWorkoutLogExercises: React.Dispatch<React.SetStateAction<Record<number, WorkoutLogExercise[]>>>,
  token: string
) => {
  await axios.post(`${API_BASE_URL}/workout-log-exercises/bulk`,
    {
      action: "move",
      ids: workoutLogExerciseIds,
      target_workout_log_id: targetWorkoutLogId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setWorkoutLogExercises(prevWorkoutLogExercises => {
    const workoutLogExerciseEntries: [string, WorkoutLogExercise[]][] = [];
    const targetWorkoutLogExercisesArray: WorkoutLogExercise[] = [];

    Object.entries(prevWorkoutLogExercises).forEach(([logId, workoutLogExercisesArray]) => {
      if (Number(logId) === currentWorkoutLogId) {
        const sourceWorkoutLogExercisesArray: WorkoutLogExercise[] = [];
        workoutLogExercisesArray.forEach(workoutLogExercise => {
          if (workoutLogExerciseIds.includes(workoutLogExercise.id)) {
            targetWorkoutLogExercisesArray.push(workoutLogExercise);
          } else {
            sourceWorkoutLogExercisesArray.push(workoutLogExercise);
          }
        });
        workoutLogExerciseEntries.push([logId, sourceWorkoutLogExercisesArray]);

      } else if (Number(logId) === targetWorkoutLogId) {
        targetWorkoutLogExercisesArray.push(...workoutLogExercisesArray);
        
      } else {
        workoutLogExerciseEntries.push([logId, workoutLogExercisesArray]);
      }
    });

    workoutLogExerciseEntries.push([String(targetWorkoutLogId), targetWorkoutLogExercisesArray]);

    const updatedWorkoutLogExercises = Object.fromEntries(workoutLogExerciseEntries);

    return updatedWorkoutLogExercises;
  });
}

export const deleteWorkoutLogExercises = async (
  workoutLogExerciseIds: number[],
  setWorkoutLogExercises: React.Dispatch<React.SetStateAction<Record<number, WorkoutLogExercise[]>>>,
  token: string
) => {
  await axios.post(`${API_BASE_URL}/workout-log-exercises/bulk`,
    {
      action: "delete",
      ids: workoutLogExerciseIds,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setWorkoutLogExercises(prevWorkoutLogExercises =>
    Object.fromEntries(
      Object.entries(prevWorkoutLogExercises).map(([logId, WorkoutLogExercisesArray]) => [
        logId,
        WorkoutLogExercisesArray.filter(WorkoutLogExercise => !workoutLogExerciseIds.includes(WorkoutLogExercise.id))
      ])
    )
  );
}

// ---------------------------------------------------------------------------

export const loadExercise = async (
  exerciseId: number,
  setExercises: React.Dispatch<React.SetStateAction<Record<number, Exercise>>>,
  token: string
) => {
  const exerciseResponse = await axios.get(`${API_BASE_URL}/exercises/${exerciseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (exerciseResponse.data.length === 0) {
    return {};
  }

  const exercise = exerciseResponse.data;

  setExercises(prev => ({
    ...prev,
    [exerciseId]: exercise
  }));

  return exercise;
};

export const getExercises = async (limit: number,
                               skip: number,
                               search: string,
                               setExerciseSearchResults: React.Dispatch<React.SetStateAction<Exercise[]>>,
                               token: string
                              ) => {
  const exercisesResponse = await axios.get(`${API_BASE_URL}/exercises`,
    {
      params: {
        limit,
        skip,
        search
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (exercisesResponse.data.exercises.length === 0) {
    return [];
  }

  const exerciseSearchObject = exercisesResponse.data;

  setExerciseSearchResults(exercisesResponse.data.exercises);

  return exerciseSearchObject;
};

// ---------------------------------------------------------------------------

export const addExerciseSet = async (
  exerciseSet: ExerciseSetCreate,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<number, ExerciseSet[]>>>,
  token: string
) => {
  const exerciseSetResponse = await axios.post(`${API_BASE_URL}/exercise-sets`,
    exerciseSet,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const newExerciseSet = exerciseSetResponse.data;

  setExerciseSets(prev => ({
    ...prev,
    [exerciseSet.workout_log_exercise_id]: [...(prev[exerciseSet.workout_log_exercise_id] || []), newExerciseSet]
  }));
};

export const updateExerciseSet = async (
  exerciseSetId: number,
  exerciseSet: ExerciseSetCreate,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<number, ExerciseSet[]>>>,
  token: string
) => {
  const exerciseSetResponse = await axios.put(`${API_BASE_URL}/exercise-sets/${exerciseSetId}`,
    exerciseSet,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const updatedExerciseSet = exerciseSetResponse.data;

  setExerciseSets(prev => {
    const currentExerciseSets = prev[updatedExerciseSet.workout_log_exercise_id];

    const updatedExerciseSets = currentExerciseSets.map((set: ExerciseSet) =>
      set.id === exerciseSetId ? updatedExerciseSet : set
    );

    return {
      ...prev,
      [updatedExerciseSet.workout_log_exercise_id]: updatedExerciseSets
    }
  });
};

export const deleteExerciseSet = async (
  exerciseSetId: number,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<number, ExerciseSet[]>>>,
  token: string
) => {
  await axios.delete(`${API_BASE_URL}/exercise-sets/${exerciseSetId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setExerciseSets(prev =>
    Object.fromEntries(Object.entries(prev).map(([workoutLogExerciseId, exerciseSetsArray]) => [
      workoutLogExerciseId,
      exerciseSetsArray.filter(exerciseSet => exerciseSet.id !== exerciseSetId)
    ]))
  )
};
