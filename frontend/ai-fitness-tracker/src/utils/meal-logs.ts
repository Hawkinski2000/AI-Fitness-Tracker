import axios from 'axios';
import { type MealLog, type MealLogFood, type Food } from "../pages/meal-logs/MealLogsPage";
import { API_BASE_URL } from '../config/api';


export const loadMealLogs = async (setMealLogs: React.Dispatch<React.SetStateAction<Record<string, MealLog>>>,
                                   token: string) => {
  const mealLogsResponse = await axios.get(`${API_BASE_URL}/meal-logs`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (mealLogsResponse.data.length === 0) {
    setMealLogs({});
    return {};
  }
  
  const mealLogs: Record<string, MealLog> = {};
  mealLogsResponse.data.forEach((mealLog: MealLog) => {
    const logDate = mealLog.log_date.split('T')[0];
    const mealLogObject = {id: mealLog.id, log_date: logDate, total_calories: mealLog.total_calories || null};

    mealLogs[logDate] = mealLogObject;
  });

  setMealLogs(mealLogs);

  return mealLogs;
};

export const loadMealLogFoods = async (mealLogId: number,
                                       setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
                                       token: string) => {
  const mealLogFoodsResponse = await axios.get(`${API_BASE_URL}/meal-log-foods/${mealLogId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (mealLogFoodsResponse.data.length === 0) {
    return {};
  }
  
  const mealLogFoods: Record<number, MealLogFood[]> = {};
  mealLogFoodsResponse.data.forEach((mealLogFood: MealLogFood) => {
    const mealLogFoodObject = {
      id: mealLogFood.id,
      meal_log_id: mealLogFood.meal_log_id,
      food_id: mealLogFood.food_id,
      meal_type: mealLogFood.meal_type,
      num_servings: mealLogFood.num_servings,
      serving_size: mealLogFood.serving_size,
      serving_unit: mealLogFood.serving_unit,
      created_at: mealLogFood.created_at,
      calories: mealLogFood.calories || null
    };

    mealLogFoods[mealLogId] = mealLogFoods[mealLogId] || [];
    mealLogFoods[mealLogId].push(mealLogFoodObject);
  });

  setMealLogFoods(mealLogFoods);

  return mealLogFoods;
};

export const loadFood = async (foodId: number,
                              setFoods: React.Dispatch<React.SetStateAction<Record<number, Food>>>,
                              token: string) => {
  const foodResponse = await axios.get(`${API_BASE_URL}/foods/${foodId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (foodResponse.data.length === 0) {
    return {};
  }

  const food = foodResponse.data;

  setFoods(prev => ({
    ...prev,
    [foodId]: food
  }));

  return food;
};
