import { useCallback } from "react";
import {
  type WorkoutLog,
  type WorkoutLogExercise,
  type Exercise,
  type ExerciseSet
} from "../types/workout-logs";
import { type Value } from 'react-calendar/dist/shared/types.js';
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import { loadWorkoutLog } from "../../../utils/workout-logs";
import { getDateKey, normalizeDate } from "../../../utils/dates";


const useWorkoutLogsDate = (
  currentWorkoutLogDate: Value,
  setCurrentWorkoutLogDate: React.Dispatch<React.SetStateAction<Value>>,
  workoutLogs: Record<string, WorkoutLog>,
  setWorkoutLogs: React.Dispatch<React.SetStateAction<Record<string, WorkoutLog>>>,
  setWorkoutLogExercises: React.Dispatch<React.SetStateAction<Record<number, WorkoutLogExercise[]>>>,
  setExercises: React.Dispatch<React.SetStateAction<Record<number, Exercise>>>,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<number, ExerciseSet[]>>>,
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>
) => {
  const { accessToken, setAccessToken } = useAuth();


  const getDateLabel = useCallback((currentMealLogDate: Value, today: Value) => {
    if (!currentMealLogDate || !today) {
      return "";
    }
    
    let mealLogDate: Value;
    if (Array.isArray(currentMealLogDate)) {
      mealLogDate = currentMealLogDate[0];
    } else {
      mealLogDate = currentMealLogDate;
    }
    if (!mealLogDate) {
      return;
    }

    let todayDate: Value;
    if (Array.isArray(today)) {
      todayDate = today[0];
    } else {
      todayDate = today;
    }
    if (!todayDate) {
      return;
    }

    const differenceTime = mealLogDate.getTime() - todayDate.getTime();
    const differenceInDays = Math.round(differenceTime / (1000 * 60 * 60 * 24));
    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Tomorrow';
    } else if (differenceInDays === -1) {
      return 'Yesterday';
    }
    const weekday = mealLogDate.toLocaleDateString('en-US', { weekday: 'long' });
    const month = mealLogDate.toLocaleDateString('en-US', { month: 'short' });
    const day = mealLogDate.toLocaleDateString('en-US', { day: 'numeric' });
    return `${weekday}, ${month} ${day}`;
  }, []);

// ---------------------------------------------------------------------------

  const handleChangeDate = useCallback(async (direction: string) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      if (!currentWorkoutLogDate) {
        return;
      }

      let dayDifference = 0;
      if (direction === 'previous') {
        dayDifference -= 1;
      }
      else if (direction === 'next') {
        dayDifference += 1;
      }

      let selectedDate: Value;
      if (Array.isArray(currentWorkoutLogDate)) {
        selectedDate = currentWorkoutLogDate[0];
      } else {
        selectedDate = currentWorkoutLogDate;
      }
      if (!selectedDate) {
        return;
      }

      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + dayDifference);
      const normalizedDate = normalizeDate(newDate);
      if (!normalizedDate) {
        return;
      }
      setCurrentWorkoutLogDate(normalizedDate);

      const dateKey = getDateKey(normalizedDate);
      if (!dateKey) {
        return;
      }

      if (workoutLogs[dateKey]) {
        return;
      }
      
      await loadWorkoutLog(
        normalizedDate,
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
    
    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentWorkoutLogDate,
    setCurrentWorkoutLogDate,
    setWorkoutLogs,
    setWorkoutLogExercises,
    setExercises,
    setExerciseSets,
    workoutLogs
  ])

// ---------------------------------------------------------------------------
  
const handleSetCalendarDate = useCallback(async (value: Value) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      setCalendarDate(value);

      let selectedDate: Value;
      if (Array.isArray(value)) {
        selectedDate = value[0];
      } else {
        selectedDate = value;
      }
      if (!selectedDate) {
        return;
      }

      setCalendarOpenType('');

      const normalizedDate = normalizeDate(selectedDate);
      if (!normalizedDate) {
        return;
      }
      
      setCurrentWorkoutLogDate(normalizedDate);

      const dateKey = getDateKey(normalizedDate);
      if (!dateKey) {
        return;
      }

      if (workoutLogs[dateKey]) {
        return;
      }

      await loadWorkoutLog(
        normalizedDate,
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
    
    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    setCurrentWorkoutLogDate,
    workoutLogs,
    setWorkoutLogs,
    setWorkoutLogExercises,
    setExercises,
    setExerciseSets,
    setCalendarOpenType,
    setCalendarDate
  ])


  return {
    getDateLabel,
    handleChangeDate,
    handleSetCalendarDate
  }
};


export default useWorkoutLogsDate;
