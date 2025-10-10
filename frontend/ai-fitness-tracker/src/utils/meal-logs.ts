import axios from 'axios';
import { type MealLog, type MealLogFood, type Food, type BrandedFood, type FoodNutrient, type Nutrient } from "../pages/meal-logs/MealLogsPage";
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

export const createMealLog = async (logDate: string,
                                    setMealLogs: React.Dispatch<React.SetStateAction<Record<string, MealLog>>>,
                                    token: string) => {
  const mealLogResponse = await axios.post(`${API_BASE_URL}/meal-logs`,
    {
      log_date: logDate
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const mealLog = mealLogResponse.data;

  setMealLogs(prev => ({
    ...prev,
    [logDate]: mealLog
  }));

  return mealLog;
};

// ---------------------------------------------------------------------------

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

export const addMealLogFood = async (mealLogId: number,
                                     foodId: number,
                                     numServings: number | null = null,
                                     servingSize: number | null = null,
                                     foodsMenuOpenMealType: string,
                                     setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
                                     setFoods: React.Dispatch<React.SetStateAction<Record<number, Food>>>,
                                     token: string) => {
  const mealLogFoodResponse = await axios.post(`${API_BASE_URL}/meal-log-foods`,
    {
      meal_log_id: mealLogId,
      food_id: foodId,
      meal_type: foodsMenuOpenMealType,
      ...(numServings !== null && { num_servings: numServings }),
      ...(servingSize !== null && { serving_size: servingSize })
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const mealLogFood = mealLogFoodResponse.data;

  setMealLogFoods(prev => ({
    ...prev,
    [mealLogId]: [...(prev[mealLogId] || []), mealLogFood]
  }));

  loadFood(foodId, setFoods, token);
};

export const deleteMealLogFood = async (mealLogFoodId: number,
                                        setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
                                        token: string) => {
  await axios.delete(`${API_BASE_URL}/meal-log-foods/${mealLogFoodId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setMealLogFoods(prevMealLogFoods =>
    Object.fromEntries(
      Object.entries(prevMealLogFoods).map(([logId, mealLogFoodsArray]) => [
        logId,
        mealLogFoodsArray.filter(mealLogFood => mealLogFood.id !== mealLogFoodId)
      ])
    )
  );
}

// ---------------------------------------------------------------------------

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

export const getFoods = async (limit: number,
                               skip: number,
                               search: string,
                               setFoodSearchResults: React.Dispatch<React.SetStateAction<Food[]>>,
                               token: string) => {
  const foodsResponse = await axios.get(`${API_BASE_URL}/foods`,
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

  if (foodsResponse.data.length === 0) {
    return [];
  }

  const foods = foodsResponse.data;

  setFoodSearchResults(foods);

  return foods;
};

// ---------------------------------------------------------------------------

export const loadBrandedFood = async (foodId: number,
                                      setBrandedFoods: React.Dispatch<React.SetStateAction<Record<number, BrandedFood>>>,
                                      token: string) => {
  const brandedFoodResponse = await axios.get(`${API_BASE_URL}/branded-foods/${foodId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (brandedFoodResponse.data.length === 0) {
    return {};
  }

  const brandedFood = brandedFoodResponse.data;

  setBrandedFoods(prev => ({
    ...prev,
    [foodId]: brandedFood
  }));

  return brandedFood;
};

// ---------------------------------------------------------------------------

export const loadFoodNutrients = async (foodId: number,
                                        setFoodNutrients: React.Dispatch<React.SetStateAction<Record<number, FoodNutrient[]>>>,
                                       token: string) => {
  const foodNutrientsResponse = await axios.get(`${API_BASE_URL}/food-nutrients/${foodId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (foodNutrientsResponse.data.length === 0) {
    return [];
  }
  
  const newFoodNutrients: FoodNutrient[] = foodNutrientsResponse.data.map((foodNutrient: FoodNutrient) => ({
    id: foodNutrient.id,
    food_id: foodNutrient.food_id,
    nutrient_id: foodNutrient.nutrient_id,
    amount: foodNutrient.amount,
  }));

  setFoodNutrients(prev => ({
    ...prev,
    [foodId]: newFoodNutrients
  }));

  return newFoodNutrients;
};

export const loadNutrient = async (nutrient_id: number,
                                   setNutrients: React.Dispatch<React.SetStateAction<Record<number, Nutrient>>>,
                                   token: string) => {
  const nutrientResponse = await axios.get(`${API_BASE_URL}/nutrients/${nutrient_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (nutrientResponse.data.length === 0) {
    return;
  }

  const nutrient = nutrientResponse.data;

  setNutrients(prev => ({
    ...prev,
    [nutrient_id]: nutrient
  }));

  return nutrient;
};
