import { useCallback } from "react";
import {
  type WorkoutLog,
  type WorkoutLogExercise,
  type Exercise,
  type ExerciseSet
} from "../types/workout-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import {
  createWorkoutLog,
  copyWorkoutLogExercises,
  moveWorkoutLogExercises
} from "../../../utils/workout-logs";
import { getDateKey, normalizeDate } from "../../../utils/dates";


const useMealLogActions = (
  currentWorkoutLogDate: Value,
  setCurrentWorkoutLogDate: React.Dispatch<React.SetStateAction<Value>>,
  calendarDate: Value,
  // foodsMenuOpenMealType: string,
  workoutLogs: Record<string, WorkoutLog>,
  setWorkoutLogs: React.Dispatch<React.SetStateAction<Record<string, WorkoutLog>>>,
  setWorkoutLogExercises: React.Dispatch<React.SetStateAction<Record<number, WorkoutLogExercise[]>>>,
  setExercises: React.Dispatch<React.SetStateAction<Record<number, Exercise>>>,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<number, ExerciseSet[]>>>,
  // setFoods: React.Dispatch<React.SetStateAction<Record<number, Food>>>,
  // setFoodNutrients: React.Dispatch<React.SetStateAction<Record<number, FoodNutrient[]>>>,
  // setNutrients: React.Dispatch<React.SetStateAction<Record<number, Nutrient>>>,
  // setMacroAmountsGrams: React.Dispatch<React.SetStateAction<Record<number, Record<number, number>>>>,
  // setFoodCaloriesFromMacros: React.Dispatch<React.SetStateAction<Record<number, number>>>,
  selectedWorkoutLogExerciseIds: number[],
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
) => {
  const { accessToken, setAccessToken } = useAuth();


  // const handleAddFood = useCallback(async (
  //   foodId: number,
  //   numServings: number | null = null,
  //   servingSize: number | null = null
  // ) => {
  //   try {
  //     let token: string | null = accessToken;
  //     if (!accessToken || isTokenExpired(accessToken)) {
  //       token = await refreshAccessToken();  
  //       setAccessToken(token);
  //     }
  //     if (!token) {
  //       throw new Error("No access token");
  //     }

  //     if (!currentMealLogDate) {
  //       return;
  //     }

  //     const dateKey = getDateKey(currentMealLogDate);
  //     if (!dateKey) {
  //       return;
  //     }

  //     let mealLog;
  //     if (!mealLogs[dateKey]) {
  //       mealLog = await createMealLog(currentMealLogDate, setMealLogs, token);
  //     }
  //     else {
  //       mealLog = mealLogs[dateKey];
  //     }

  //     const mealLogId = mealLog.id;

  //     await addMealLogFood(mealLogId,
  //                           foodId,
  //                           numServings,
  //                           servingSize,
  //                           foodsMenuOpenMealType,
  //                           setMealLogFoods,
  //                           setFoods,
  //                           token);

  //   } catch (err) {
  //     console.error(err);
  //     setAccessToken(null);
  //   }
  // }, [
  //   accessToken,
  //   setAccessToken,
  //   currentMealLogDate,
  //   mealLogs,
  //   setMealLogs,
  //   foodsMenuOpenMealType,
  //   setMealLogFoods,
  //   setFoods
  // ]);

// ---------------------------------------------------------------------------

  // const handleLoadFoodNutrients = useCallback(async (foodId: number) => {
  //   try {
  //     let token: string | null = accessToken;
  //     if (!accessToken || isTokenExpired(accessToken)) {
  //       token = await refreshAccessToken();  
  //       setAccessToken(token);
  //     }
  //     if (!token) {
  //       throw new Error("No access token");
  //     }

  //     const foodNutrientsResponseArray = await loadFoodNutrients(
  //       foodId,
  //       setFoodNutrients,
  //       setNutrients,
  //       token,
  //       ["nutrient"]
  //     );

  //     const macros = foodNutrientsResponseArray.filter(
  //       (foodNutrientResponse: FoodNutrientResponse) =>
  //         [1003, 1004, 1005].includes(foodNutrientResponse.nutrient_id)
  //     );

  //     const caloriesFromMacros = macros.reduce((sum, macro) =>
  //       sum + macro.amount * (macro.nutrient_id === 1004 ? 9 : 4)
  //     , 1);

  //     macros.forEach((macro: FoodNutrient) =>
  //       setMacroAmountsGrams(prev => ({
  //         ...prev,
  //         [foodId]: {
  //           ...(prev[foodId] || {}),
  //           [macro.nutrient_id]: macro.amount
  //         }
  //       })
  //     ));

  //     setFoodCaloriesFromMacros(prev => ({
  //       ...prev,
  //       [foodId]: caloriesFromMacros
  //     }));

  //   } catch (err) {
  //     console.error(err);
  //     setAccessToken(null);
  //   }
  // }, [
  //   accessToken,
  //   setAccessToken,
  //   setFoodNutrients,
  //   setNutrients,
  //   setMacroAmountsGrams,
  //   setFoodCaloriesFromMacros
  // ]);

// ---------------------------------------------------------------------------

  // const handleUpdateFood = useCallback(async (
  //   mealLogFoodId: number,
  //   mealLogId: number | null,
  //   numServings: number | null = null,
  //   servingSize: number | null = null
  // ) => {
  //   try {
  //     let token: string | null = accessToken;
  //     if (!accessToken || isTokenExpired(accessToken)) {
  //       token = await refreshAccessToken();  
  //       setAccessToken(token);
  //     }
  //     if (!token) {
  //       throw new Error("No access token");
  //     }

  //     await updateMealLogFood(
  //       mealLogFoodId,
  //       mealLogId,
  //       numServings,
  //       servingSize,
  //       foodsMenuOpenMealType,
  //       setMealLogFoods,
  //       token
  //     );

  //   } catch (err) {
  //     console.error(err);
  //     setAccessToken(null);
  //   }
  // }, [
  //   accessToken,
  //   setAccessToken,
  //   foodsMenuOpenMealType,
  //   setMealLogFoods
  // ]);

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

  // const handleDeleteMealLogFoods = useCallback(async () => {
  //   try {
  //     let token: string | null = accessToken;
  //     if (!accessToken || isTokenExpired(accessToken)) {
  //       token = await refreshAccessToken();
  //       setAccessToken(token);
  //     }
  //     if (!token) {
  //       throw new Error("No access token");
  //     }

  //     await deleteMealLogFoods(selectedMealLogFoodIds, setMealLogFoods, token);

  //   } catch (err) {
  //     console.error(err);
  //     setAccessToken(null);
  //   }
  // }, [
  //   accessToken,
  //   setAccessToken,
  //   setMealLogFoods,
  //   selectedMealLogFoodIds
  // ]);

  
  return {
    // handleAddFood,
    // handleLoadFoodNutrients,
    // handleUpdateFood,
    handleCopyWorkoutLogExercises,
    handleMoveWorkoutLogExercises,
    // handleDeleteMealLogFoods
  }
};


export default useMealLogActions;
