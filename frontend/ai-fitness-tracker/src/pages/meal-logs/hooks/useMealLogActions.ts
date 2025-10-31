import { useCallback } from "react";
import {
  type MealLog,
  type MealLogFood,
  type Food,
  type FoodNutrient,
  type FoodNutrientResponse,
  type Nutrient
} from "../types/meal-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import {
  createMealLog,
  addMealLogFood,
  loadFoodNutrients,
  updateMealLogFood,
  copyMealLogFoods,
  moveMealLogFoods,
  deleteMealLogFoods
} from "../../../utils/meal-logs";
import { getDateKey, normalizeDate } from "../../../utils/dates";


const useMealLogActions = (
  currentMealLogDate: Value,
  setCurrentMealLogDate: React.Dispatch<React.SetStateAction<Value>>,
  calendarDate: Value,
  mealLogs: Record<string, MealLog>,
  setMealLogs: React.Dispatch<React.SetStateAction<Record<string, MealLog>>>,
  foodsMenuOpenMealType: string,
  setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
  setFoods: React.Dispatch<React.SetStateAction<Record<number, Food>>>,
  setFoodNutrients: React.Dispatch<React.SetStateAction<Record<number, FoodNutrient[]>>>,
  setNutrients: React.Dispatch<React.SetStateAction<Record<number, Nutrient>>>,
  setMacroAmountsGrams: React.Dispatch<React.SetStateAction<Record<number, Record<number, number>>>>,
  setFoodCaloriesFromMacros: React.Dispatch<React.SetStateAction<Record<number, number>>>,
  selectedMealLogFoodIds: number[],
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
) => {
  const { accessToken, setAccessToken } = useAuth();


  const handleAddFood = useCallback(async (
    foodId: number,
    numServings: number | null = null,
    servingSize: number | null = null
  ) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      if (!currentMealLogDate) {
        return;
      }

      const dateKey = getDateKey(currentMealLogDate);
      if (!dateKey) {
        return;
      }

      let mealLog;
      if (!mealLogs[dateKey]) {
        mealLog = await createMealLog(currentMealLogDate, setMealLogs, token);
      }
      else {
        mealLog = mealLogs[dateKey];
      }

      const mealLogId = mealLog.id;

      await addMealLogFood(mealLogId,
                            foodId,
                            numServings,
                            servingSize,
                            foodsMenuOpenMealType,
                            setMealLogFoods,
                            setFoods,
                            token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentMealLogDate,
    mealLogs,
    setMealLogs,
    foodsMenuOpenMealType,
    setMealLogFoods,
    setFoods
  ]);

// ---------------------------------------------------------------------------

  const handleLoadFoodNutrients = useCallback(async (foodId: number) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      const foodNutrientsResponseArray = await loadFoodNutrients(
        foodId,
        setFoodNutrients,
        setNutrients,
        token,
        ["nutrient"]
      );

      const macros = foodNutrientsResponseArray.filter(
        (foodNutrientResponse: FoodNutrientResponse) =>
          [1003, 1004, 1005].includes(foodNutrientResponse.nutrient_id)
      );

      const caloriesFromMacros = macros.reduce((sum, macro) =>
        sum + macro.amount * (macro.nutrient_id === 1004 ? 9 : 4)
      , 1);

      macros.forEach((macro: FoodNutrient) =>
        setMacroAmountsGrams(prev => ({
          ...prev,
          [foodId]: {
            ...(prev[foodId] || {}),
            [macro.nutrient_id]: macro.amount
          }
        })
      ));

      setFoodCaloriesFromMacros(prev => ({
        ...prev,
        [foodId]: caloriesFromMacros
      }));

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    setFoodNutrients,
    setNutrients,
    setMacroAmountsGrams,
    setFoodCaloriesFromMacros
  ]);

// ---------------------------------------------------------------------------

  const handleUpdateFood = useCallback(async (
    mealLogFoodId: number,
    mealLogId: number | null,
    numServings: number | null = null,
    servingSize: number | null = null
  ) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      await updateMealLogFood(
        mealLogFoodId,
        mealLogId,
        numServings,
        servingSize,
        foodsMenuOpenMealType,
        setMealLogFoods,
        token
      );

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    foodsMenuOpenMealType,
    setMealLogFoods
  ]);

// ---------------------------------------------------------------------------

const handleCopyMealLogFoods = useCallback(async () => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      if (!currentMealLogDate) {
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
      
      setCurrentMealLogDate(normalizedTargetDate);

      const targetDateKey = getDateKey(normalizedTargetDate);
      if (!targetDateKey) {
        return;
      }

      let targetMealLog;
      if (!mealLogs[targetDateKey]) {
        targetMealLog = await createMealLog(normalizedTargetDate, setMealLogs, token);
      }
      else {
        targetMealLog = mealLogs[targetDateKey];
      }

      const targetMealLogId = targetMealLog.id;

      await copyMealLogFoods(selectedMealLogFoodIds, targetMealLogId, setMealLogFoods, token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    mealLogs,
    setMealLogs,
    setCalendarOpenType,
    currentMealLogDate,
    calendarDate,
    setCurrentMealLogDate,
    setMealLogFoods,
    selectedMealLogFoodIds
  ]);

// ---------------------------------------------------------------------------

const handleMoveMealLogFoods = useCallback(async () => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      if (!currentMealLogDate) {
        return;
      }

      const currentDateKey = getDateKey(currentMealLogDate);
      if (!currentDateKey) {
        return;
      }

      const currentMealLog = mealLogs[currentDateKey];

      const currentMealLogId = currentMealLog.id;

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
      
      setCurrentMealLogDate(normalizedTargetDate);

      const targetDateKey = getDateKey(normalizedTargetDate);
      if (!targetDateKey) {
        return;
      }

      let targetMealLog;
      if (!mealLogs[targetDateKey]) {
        targetMealLog = await createMealLog(normalizedTargetDate, setMealLogs, token);
      }
      else {
        targetMealLog = mealLogs[targetDateKey];
      }

      const targetMealLogId = targetMealLog.id;

      await moveMealLogFoods(currentMealLogId, selectedMealLogFoodIds, targetMealLogId, setMealLogFoods, token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentMealLogDate,
    setCurrentMealLogDate,
    calendarDate,
    setCalendarOpenType,
    selectedMealLogFoodIds,
    setMealLogFoods,
    mealLogs,
    setMealLogs,
  ]);

// ---------------------------------------------------------------------------

  const handleDeleteMealLogFoods = useCallback(async () => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      await deleteMealLogFoods(selectedMealLogFoodIds, setMealLogFoods, token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    setMealLogFoods,
    selectedMealLogFoodIds
  ]);

  
  return {
    handleAddFood,
    handleLoadFoodNutrients,
    handleUpdateFood,
    handleCopyMealLogFoods,
    handleMoveMealLogFoods,
    handleDeleteMealLogFoods
  }
};


export default useMealLogActions;
