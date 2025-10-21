import { useEffect } from "react";
import { type MealLog, type MealLogFood } from "../types/meal-logs";


const useMealLogsCaloriesHeader = (
  currentMealLogDate: string | null,
  mealLogs: Record<string, MealLog>,
  mealLogFoods: Record<number, MealLogFood[]>,
  setFoodCalories: React.Dispatch<React.SetStateAction<number>>
) => {
  useEffect(() => {
    if (!currentMealLogDate) {
      return;
    }

    const currentMealLog = mealLogs[currentMealLogDate];
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
