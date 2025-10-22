import { useCallback } from "react";
import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood
} from "../types/meal-logs";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import { loadMealLogFoods, loadFood, loadBrandedFood } from "../../../utils/meal-logs";


const useMealLogsDate = (
  currentMealLogDate: string | null,
  setCurrentMealLogDate: React.Dispatch<React.SetStateAction<string | null>>,
  mealLogs: Record<string, MealLog>,
  setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
  setFoods: React.Dispatch<React.SetStateAction<Record<number, Food>>>,
  setBrandedFoods: React.Dispatch<React.SetStateAction<Record<number, BrandedFood>>>
) => {
  const { accessToken, setAccessToken } = useAuth();


  const getDateLabel = useCallback((currentMealLogDate: string | null, today: string | null) => {
    if (!currentMealLogDate || !today) {
      return "";
    }

    const mealLogDate = new Date(currentMealLogDate);
    const todayDate = new Date(today);
    mealLogDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);
    const differenceTime = mealLogDate.getTime() - todayDate.getTime();
    const differenceInDays = Math.round(differenceTime / (1000 * 60 * 60 * 24));

    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Tomorrow';
    } else if (differenceInDays === -1) {
      return 'Yesterday';
    }
    return currentMealLogDate.split("T")[0];
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

      if (!currentMealLogDate) {
        return;
      }

      let dayDifference = 0;
      if (direction === 'previous') {
        dayDifference -= 1;
      }
      else if (direction === 'next') {
        dayDifference += 1;
      }

      const prevDate = new Date(currentMealLogDate);
      prevDate.setDate(prevDate.getDate() + dayDifference);
      const newDate = prevDate.toISOString().split('T')[0];
      setCurrentMealLogDate(newDate);

      const currentMealLog = mealLogs[newDate];

      if (!currentMealLog) {
        return;
      }
      
      const currentMealLogId = currentMealLog.id;

      const loadedMealLogFoods = await loadMealLogFoods(currentMealLogId, setMealLogFoods, token);

      await Promise.all(
        Object.values(loadedMealLogFoods).map((mealLogFoodArray: MealLogFood[]) =>
          mealLogFoodArray.forEach((mealLogFoodItem: MealLogFood) => {
            loadFood(mealLogFoodItem.food_id, setFoods, token);
            loadBrandedFood(mealLogFoodItem.food_id, setBrandedFoods, token);
          })
        )
      );
    
    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentMealLogDate,
    setCurrentMealLogDate,
    mealLogs,
    setMealLogFoods,
    setFoods,
    setBrandedFoods
  ])


  return {
    getDateLabel,
    handleChangeDate
  }
};


export default useMealLogsDate;
