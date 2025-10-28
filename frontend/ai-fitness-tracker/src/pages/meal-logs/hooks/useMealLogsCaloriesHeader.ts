import { useEffect } from "react";
import { type MealLog, type MealLogFood } from "../types/meal-logs";
import type { Value } from "react-calendar/dist/shared/types.js";
import { getDateKey } from "../../../utils/dates";


const useMealLogsCaloriesHeader = (
  currentMealLogDate: Value,
  mealLogs: Record<string, MealLog>,
  mealLogFoods: Record<number, MealLogFood[]>,
  setFoodCalories: React.Dispatch<React.SetStateAction<number>>
) => {
  useEffect(() => {
    if (!currentMealLogDate) {
      return;
    }

    const dateKey = getDateKey(currentMealLogDate);
    if (!dateKey) {
      return;
    }
    const currentMealLog = mealLogs[dateKey];

    if (!currentMealLog) {
      setFoodCalories(0);
      return;
    }

    const currentMealLogFoods = mealLogFoods[currentMealLog.id] || [];

    let totalCalories = 0;

    currentMealLogFoods.forEach((mealLogFood: MealLogFood) => {
      totalCalories += mealLogFood.calories || 0;
    });

    setFoodCalories(totalCalories);
  }, [
    currentMealLogDate,
    mealLogs,
    mealLogFoods,
    setFoodCalories
  ]);
};


export default useMealLogsCaloriesHeader;
