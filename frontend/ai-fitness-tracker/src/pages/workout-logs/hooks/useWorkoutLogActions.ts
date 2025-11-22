import { useCallback } from "react";
import {
  type WorkoutLog,
  type WorkoutLogExercise,
  type Exercise,
  type ExerciseSet,
  type ExerciseSetCreate
} from "../types/workout-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import {
  createWorkoutLog,
  copyWorkoutLogExercises,
  moveWorkoutLogExercises,
  deleteWorkoutLogExercises,
  addWorkoutLogExercise,
  addExerciseSet,
  updateExerciseSet,
  deleteExerciseSet
} from "../../../utils/workout-logs";
import { getDateKey, normalizeDate } from "../../../utils/dates";


const useWorkoutLogActions = (
  currentWorkoutLogDate: Value,
  setCurrentWorkoutLogDate: React.Dispatch<React.SetStateAction<Value>>,
  calendarDate: Value,
  workoutLogs: Record<string, WorkoutLog>,
  setWorkoutLogs: React.Dispatch<React.SetStateAction<Record<string, WorkoutLog>>>,
  setWorkoutLogExercises: React.Dispatch<React.SetStateAction<Record<number, WorkoutLogExercise[]>>>,
  setExercises: React.Dispatch<React.SetStateAction<Record<number, Exercise>>>,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<number, ExerciseSet[]>>>,
  selectedWorkoutLogExerciseIds: number[],
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
) => {
  const { accessToken, setAccessToken } = useAuth();


  const handleAddExercise = useCallback(async (exerciseId: number) => {
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

      const dateKey = getDateKey(currentWorkoutLogDate);
      if (!dateKey) {
        return;
      }

      let workoutLog;
      if (!workoutLogs[dateKey]) {
        workoutLog = await createWorkoutLog(currentWorkoutLogDate, setWorkoutLogs, token);
      }
      else {
        workoutLog = workoutLogs[dateKey];
      }

      const workoutLogId = workoutLog.id;

      await addWorkoutLogExercise(
        workoutLogId,
        exerciseId,
        setWorkoutLogExercises,
        setExercises,
        token
      );

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentWorkoutLogDate,
    workoutLogs,
    setWorkoutLogs,
    setWorkoutLogExercises,
    setExercises
  ]);

// ---------------------------------------------------------------------------

const handleCopyWorkoutLogExercises = useCallback(async () => {
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

      let targetDate: Value;
      
      if (Array.isArray(calendarDate)) {
        targetDate = calendarDate[0];
      } else {
        targetDate = calendarDate;
      }

      if (!targetDate) {
        return;
      }

      setCalendarOpenType('');

      const normalizedTargetDate = normalizeDate(targetDate);
      if (!normalizedTargetDate) {
        return;
      }
      
      setCurrentWorkoutLogDate(normalizedTargetDate);

      const targetDateKey = getDateKey(normalizedTargetDate);
      if (!targetDateKey) {
        return;
      }

      let targetWorkoutLog;
      if (!workoutLogs[targetDateKey]) {
        targetWorkoutLog = await createWorkoutLog(normalizedTargetDate, setWorkoutLogs, token);
      }
      else {
        targetWorkoutLog = workoutLogs[targetDateKey];
      }

      const targetWorkoutLogId = targetWorkoutLog.id;
      await copyWorkoutLogExercises(
        targetWorkoutLogId,
        normalizedTargetDate,
        selectedWorkoutLogExerciseIds,
        setWorkoutLogs,
        setWorkoutLogExercises,
        setExercises,
        setExerciseSets,
        token
      );

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    setCalendarOpenType,
    currentWorkoutLogDate,
    setCurrentWorkoutLogDate,
    calendarDate,
    workoutLogs,
    setWorkoutLogs,
    setWorkoutLogExercises,
    setExercises,
    setExerciseSets,
    selectedWorkoutLogExerciseIds
  ]);

// ---------------------------------------------------------------------------

const handleMoveWorkoutLogExercises = useCallback(async () => {
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

      const currentDateKey = getDateKey(currentWorkoutLogDate);
      if (!currentDateKey) {
        return;
      }

      const currentWorkoutLog = workoutLogs[currentDateKey];

      const currentWorkoutLogId = currentWorkoutLog.id;

      let targetDate: Value;
      if (Array.isArray(calendarDate)) {
        targetDate = calendarDate[0];
      } else {
        targetDate = calendarDate;
      }
      if (!targetDate) {
        return;
      }

      setCalendarOpenType('');

      const normalizedTargetDate = normalizeDate(targetDate);
      if (!normalizedTargetDate) {
        return;
      }
      
      setCurrentWorkoutLogDate(normalizedTargetDate);

      const targetDateKey = getDateKey(normalizedTargetDate);
      if (!targetDateKey) {
        return;
      }

      let targetWorkoutLog;
      if (!workoutLogs[targetDateKey]) {
        targetWorkoutLog = await createWorkoutLog(normalizedTargetDate, setWorkoutLogs, token);
      }
      else {
        targetWorkoutLog = workoutLogs[targetDateKey];
      }

      const targetWorkoutLogId = targetWorkoutLog.id;

      await moveWorkoutLogExercises(currentWorkoutLogId, selectedWorkoutLogExerciseIds, targetWorkoutLogId, setWorkoutLogExercises, token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentWorkoutLogDate,
    setCurrentWorkoutLogDate,
    calendarDate,
    setCalendarOpenType,
    selectedWorkoutLogExerciseIds,
    setWorkoutLogExercises,
    workoutLogs,
    setWorkoutLogs,
  ]);

// ---------------------------------------------------------------------------

  const handleDeleteWorkoutLogExercises = useCallback(async (ids: number[]) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      await deleteWorkoutLogExercises(ids, setWorkoutLogExercises, token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    setWorkoutLogExercises
  ]);

// ---------------------------------------------------------------------------

    const handleAddExerciseSet = useCallback(async (exerciseSet: ExerciseSetCreate) => {
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

      await addExerciseSet(
        exerciseSet,
        setExerciseSets,
        token
      );

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentWorkoutLogDate,
    setExerciseSets
  ]);

// ---------------------------------------------------------------------------

  const handleUpdateExerciseSet = useCallback(async (exerciseSetId: number, exerciseSet: ExerciseSetCreate) => {
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

      await updateExerciseSet(
        exerciseSetId,
        exerciseSet,
        setExerciseSets,
        token
      );

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentWorkoutLogDate,
    setExerciseSets
  ]);

// ---------------------------------------------------------------------------

    const handleDeleteExerciseSet = useCallback(async (exerciseSetId: number) => {
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

      await deleteExerciseSet(
        exerciseSetId,
        setExerciseSets,
        token
      );

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentWorkoutLogDate,
    setExerciseSets
  ]);

  
  return {
    handleAddExercise,
    handleCopyWorkoutLogExercises,
    handleMoveWorkoutLogExercises,
    handleDeleteWorkoutLogExercises,
    handleAddExerciseSet,
    handleUpdateExerciseSet,
    handleDeleteExerciseSet
  }
};


export default useWorkoutLogActions;
