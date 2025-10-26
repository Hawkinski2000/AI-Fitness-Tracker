import axios from 'axios';
import {
  type MealLog,
  type MealLogResponse,
  type MealLogFood,
  type Food,
  type BrandedFood,
  type FoodNutrient,
  type FoodNutrientResponse,
  type Nutrient
} from "../pages/meal-logs/types/meal-logs";
import { API_BASE_URL } from '../config/api';


export const loadMealLog = async (
  date: string,
  setMealLogs: React.Dispatch<React.SetStateAction<Record<string, MealLog>>>,
  setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
  setFoods: React.Dispatch<React.SetStateAction<Record<number, Food>>>,
  setBrandedFoods: React.Dispatch<React.SetStateAction<Record<number, BrandedFood>>>,
  token: string,
  expand?: string[]
) => {
  const mealLogsResponse = await axios.get(`${API_BASE_URL}/meal-logs`,
    {
      params: {
        date,
        expand
      },
      paramsSerializer: params => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else if (value !== undefined) {
            searchParams.append(key, value as string);
          }
        });
        return searchParams.toString();
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (mealLogsResponse.data.length === 0) {
    setMealLogs({});
    return null;
  }

  const mealLogsResponseObject: MealLogResponse = mealLogsResponse.data[0];

  setMealLogs(prev => ({
    ...prev,
    [date]: {
        id: mealLogsResponseObject.id,
        log_date: mealLogsResponseObject.log_date,
        total_calories: mealLogsResponseObject.total_calories
    }
  }));

  if (mealLogsResponseObject.meal_log_foods) {
    setMealLogFoods(prev => ({
      ...prev,
      [mealLogsResponseObject.id]: mealLogsResponseObject.meal_log_foods
    }));
  }

  if (mealLogsResponseObject.foods) {
    const newFoods: Record<number, Food> = {};

     mealLogsResponseObject.foods.forEach((food: Food) => {
      newFoods[food.id] = food;
    });

    setFoods(prev => ({
      ...prev,
      ...newFoods
    }));
  }

  if (mealLogsResponseObject.branded_foods) {
    const newBrandedFoods: Record<number, BrandedFood> = {};

     mealLogsResponseObject.branded_foods.forEach((brandedFood: BrandedFood) => {
      newBrandedFoods[brandedFood.food_id] = brandedFood;
    });

    setBrandedFoods(prev => ({
      ...prev,
      ...newBrandedFoods
    }));
  }

  return mealLogsResponseObject;
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

  setMealLogFoods(prev => ({
    ...prev,
    ...mealLogFoods
  }));

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

export const updateMealLogFood = async (
  mealLogFoodId: number,
  mealLogId: number | null,
  numServings: number | null = null,
  servingSize: number | null = null,
  foodsMenuOpenMealType: string,
  setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
  token: string
) => {
  const mealLogFoodResponse = await axios.patch(`${API_BASE_URL}/meal-log-foods/${mealLogFoodId}`,
    {
      ...(mealLogId !== null && { meal_log_id: mealLogId }),
      ...(foodsMenuOpenMealType !== null && { meal_type: foodsMenuOpenMealType }),
      ...(numServings !== null && { num_servings: numServings }),
      ...(servingSize !== null && { serving_size: servingSize })
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const updatedMealLogFood = mealLogFoodResponse.data;

  setMealLogFoods(prev => {
    const currentMealLogFoods = prev[updatedMealLogFood.meal_log_id];

    const updatedMealLogFoods = currentMealLogFoods.map((mealLogFood: MealLogFood) =>
      mealLogFood.id === mealLogFoodId ? updatedMealLogFood : mealLogFood
    );

    return {
      ...prev,
      [updatedMealLogFood.meal_log_id]: updatedMealLogFoods
    };
  });
};

export const copyMealLogFoods = async (
  mealLogFoodIds: number[],
  targetMealLogId: number,
  setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
  token: string
) => {
  await axios.post(`${API_BASE_URL}/meal-log-foods/bulk`,
    {
      action: "copy",
      ids: mealLogFoodIds,
      target_meal_log_id: targetMealLogId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  await loadMealLogFoods(targetMealLogId, setMealLogFoods, token);
}

export const deleteMealLogFoods = async (
  mealLogFoodIds: number[],
  setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
  token: string
) => {
  await axios.post(`${API_BASE_URL}/meal-log-foods/bulk`,
    {
      action: "delete",
      ids: mealLogFoodIds,
    },
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
        mealLogFoodsArray.filter(mealLogFood => !mealLogFoodIds.includes(mealLogFood.id))
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
                               token: string,
                               expand?: string[],
                              ) => {
  const foodsResponse = await axios.get(`${API_BASE_URL}/foods`,
    {
      params: {
        limit,
        skip,
        search,
        expand
      },
      paramsSerializer: params => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else if (value !== undefined) {
            searchParams.append(key, value as string);
          }
        });
        return searchParams.toString();
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (foodsResponse.data.foods.length === 0) {
    return [];
  }

  const foodSearchObject = foodsResponse.data;

  setFoodSearchResults(foodsResponse.data.foods);

  return foodSearchObject;
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

export const loadFoodNutrients = async (
  foodId: number,
  setFoodNutrients: React.Dispatch<React.SetStateAction<Record<number, FoodNutrient[]>>>,
  setNutrients: React.Dispatch<React.SetStateAction<Record<number, Nutrient>>>,
  token: string,
  expand?: string[]
) => {
  const foodNutrientsResponse = await axios.get(`${API_BASE_URL}/food-nutrients/${foodId}`,
    {
      params: {
        expand
      },
      paramsSerializer: params => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v));
          } else if (value !== undefined) {
            searchParams.append(key, value as string);
          }
        });
        return searchParams.toString();
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const foodNutrientsResponseArray: FoodNutrientResponse[] = foodNutrientsResponse.data;

  if (foodNutrientsResponseArray.length === 0) {
    return [];
  }
  
  const newFoodNutrients: FoodNutrient[] = [];
  const newNutrients: Record<number, Nutrient> = {};

  foodNutrientsResponseArray.forEach((foodNutrientResponse: FoodNutrientResponse) => {
    newFoodNutrients.push({
      id: foodNutrientResponse.id,
      food_id: foodNutrientResponse.food_id,
      nutrient_id: foodNutrientResponse.nutrient_id,
      amount: foodNutrientResponse.amount,
    });

    if (foodNutrientResponse.nutrient) {
      newNutrients[foodNutrientResponse.nutrient.id] = foodNutrientResponse.nutrient;
    }
  });

  setFoodNutrients(prev => ({
    ...prev,
    [foodId]: newFoodNutrients
  }));

  setNutrients(prev => ({
    ...prev,
    ...newNutrients
  }));

  return foodNutrientsResponseArray;
};

// ---------------------------------------------------------------------------

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
