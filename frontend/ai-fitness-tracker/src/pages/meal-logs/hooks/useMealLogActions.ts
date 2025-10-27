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


const useMealLogActions = (
  currentMealLogDate: string | null,
  setCurrentMealLogDate: React.Dispatch<React.SetStateAction<string | null>>,
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
  mealLogFoods: Record<number, MealLogFood[]>,
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>,
  setMealFoodOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>,
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

      let mealLog;
      if (!mealLogs[currentMealLogDate]) {
        mealLog = await createMealLog(currentMealLogDate, setMealLogs, token);
      }
      else {
        mealLog = mealLogs[currentMealLogDate];
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

      let selectedDate: Value;
      
      if (Array.isArray(calendarDate)) {
        selectedDate = calendarDate[0];
      } else {
        selectedDate = calendarDate;
      }

      if (!selectedDate) {
        return;
      }

      setCalendarOpenType('');

      const targetDate = selectedDate.toISOString().split('T')[0];
      setCurrentMealLogDate(targetDate);

      let targetMealLog;
      if (!mealLogs[targetDate]) {
        targetMealLog = await createMealLog(targetDate, setMealLogs, token);
      }
      else {
        targetMealLog = mealLogs[targetDate];
      }

      const targetMealLogId = targetMealLog.id;

      copyMealLogFoods(selectedMealLogFoodIds, targetMealLogId, setMealLogFoods, token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);

    } finally {
      setMealFoodOptionsMenuOpenId(null);
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
    setMealFoodOptionsMenuOpenId,
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

      const currentMealLog = mealLogs[currentMealLogDate];

      const currentMealLogId = currentMealLog.id;

      let selectedDate: Value;
      
      if (Array.isArray(calendarDate)) {
        selectedDate = calendarDate[0];
      } else {
        selectedDate = calendarDate;
      }

      if (!selectedDate) {
        return;
      }

      setCalendarOpenType('');

      const targetDate = selectedDate.toISOString().split('T')[0];
      setCurrentMealLogDate(targetDate);

      let targetMealLog;
      if (!mealLogs[targetDate]) {
        targetMealLog = await createMealLog(targetDate, setMealLogs, token);
      }
      else {
        targetMealLog = mealLogs[targetDate];
      }

      const targetMealLogId = targetMealLog.id;

      moveMealLogFoods(currentMealLogId, selectedMealLogFoodIds, targetMealLogId, setMealLogFoods, token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);

    } finally {
      setMealFoodOptionsMenuOpenId(null);
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
    setMealFoodOptionsMenuOpenId
  ]);

// ---------------------------------------------------------------------------

  const handleDeleteMeal = useCallback(async (mealType: string) => {
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

      const currentMealLog = mealLogs[currentMealLogDate];

      const currentMealLogId = currentMealLog.id;

      const currentMealLogFoods = mealLogFoods[currentMealLogId];

      const mealLogFoodsInMealType = currentMealLogFoods.filter(
        (mealLogFood: MealLogFood) => mealLogFood.meal_type === mealType
      );

      const mealLogFoodIdsInMealType = mealLogFoodsInMealType.map(
        (mealLogFood: MealLogFood) => mealLogFood.id
      );

      deleteMealLogFoods(mealLogFoodIdsInMealType, setMealLogFoods, token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);

    } finally {
      setMealOptionsMenuOpenType('');
    }
  }, [
    accessToken,
    setAccessToken,
    currentMealLogDate,
    mealLogFoods,
    mealLogs,
    setMealLogFoods,
    setMealOptionsMenuOpenType
  ]);

// ---------------------------------------------------------------------------

  const handleDeleteMealLogFood = useCallback(async (mealLogFoodId: number) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      await deleteMealLogFoods([mealLogFoodId], setMealLogFoods, token);

    } catch (err) {
      console.error(err);
      setAccessToken(null);

    } finally {
      setMealFoodOptionsMenuOpenId(null);
    }
  }, [
    accessToken,
    setAccessToken,
    setMealFoodOptionsMenuOpenId,
    setMealLogFoods
  ]);

  
  return {
    handleAddFood,
    handleLoadFoodNutrients,
    handleUpdateFood,
    handleCopyMealLogFoods,
    handleMoveMealLogFoods,
    handleDeleteMeal,
    handleDeleteMealLogFood
  }
};


export default useMealLogActions;
