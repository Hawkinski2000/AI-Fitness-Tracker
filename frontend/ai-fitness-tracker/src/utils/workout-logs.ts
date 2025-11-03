import axios from 'axios';
import {
  type WorkoutLog,
  type WorkoutLogResponse,
  type WorkoutLogExercise,
  type Exercise,
  type ExerciseSet
} from "../pages/workout-logs/types/workout-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { API_BASE_URL } from '../config/api';
import { getDateKey } from "./dates";


export const loadWorkoutLog = async (
  logDate: Value,
  setWorkoutLogs: React.Dispatch<React.SetStateAction<Record<string, WorkoutLog>>>,
  setWorkoutLogExercises: React.Dispatch<React.SetStateAction<Record<number, WorkoutLogExercise[]>>>,
  setExercises: React.Dispatch<React.SetStateAction<Record<number, Exercise>>>,
  setExerciseSets: React.Dispatch<React.SetStateAction<Record<number, ExerciseSet[]>>>,
  token: string,
  expand?: string[]
) => {
  const date = getDateKey(logDate);
  if (!date) {
    return;
  }

  const workoutLogsResponse = await axios.get(`${API_BASE_URL}/workout-logs`,
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

  if (workoutLogsResponse.data.length === 0) {
    setWorkoutLogs({});
    return null;
  }

  const workoutLogsResponseObject: WorkoutLogResponse = workoutLogsResponse.data[0];

  setWorkoutLogs(prev => ({
    ...prev,
    [date]: {
      id: workoutLogsResponseObject.id,
      log_date: workoutLogsResponseObject.log_date,
      workout_type: workoutLogsResponseObject.workout_type,
      total_num_sets: workoutLogsResponseObject.total_num_sets,
      total_calories_burned: workoutLogsResponseObject.total_calories_burned
    }
  }));

  if (workoutLogsResponseObject.workout_log_exercises) {
    setWorkoutLogExercises(prev => ({
      ...prev,
      [workoutLogsResponseObject.id]: workoutLogsResponseObject.workout_log_exercises
    }));
  }

  if (workoutLogsResponseObject.exercises) {
    const newExercises: Record<number, Exercise> = {};

     workoutLogsResponseObject.exercises.forEach((exercise: Exercise) => {
      newExercises[exercise.id] = exercise;
    });

    setExercises(prev => ({
      ...prev,
      ...newExercises
    }));
  }

  if (workoutLogsResponseObject.exercise_sets) {
    const newExerciseSets: Record<number, ExerciseSet[]> = {};

    workoutLogsResponseObject.exercise_sets.forEach((exerciseSet: ExerciseSet) => {
      const wleId = exerciseSet.workout_log_exercise_id;
      if (!newExerciseSets[wleId]) {
        newExerciseSets[wleId] = [];
      }
      newExerciseSets[wleId].push(exerciseSet);
    });

    setExerciseSets(prev => ({
      ...prev,
      ...newExerciseSets
    }));
  }

  return workoutLogsResponseObject;
};

// export const createMealLog = async (
//   logDate: Value,
//   setMealLogs: React.Dispatch<React.SetStateAction<Record<string, WorkoutLog>>>,
//   token: string
// ) => {
//   const date = getDateKey(logDate);
//   if (!date) {
//     return;
//   }

//   const mealLogResponse = await axios.post(`${API_BASE_URL}/meal-logs`,
//     {
//       log_date: date
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );
//   const mealLog = mealLogResponse.data;

//   setMealLogs(prev => ({
//     ...prev,
//     [date]: mealLog
//   }));

//   return mealLog;
// };

// // ---------------------------------------------------------------------------

// export const loadMealLogFoods = async (mealLogId: number,
//                                        setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
//                                        token: string) => {
//   const mealLogFoodsResponse = await axios.get(`${API_BASE_URL}/meal-log-foods/${mealLogId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   if (mealLogFoodsResponse.data.length === 0) {
//     return {};
//   }
  
//   const mealLogFoods: Record<number, MealLogFood[]> = {};
//   mealLogFoodsResponse.data.forEach((mealLogFood: MealLogFood) => {
//     const mealLogFoodObject = {
//       id: mealLogFood.id,
//       meal_log_id: mealLogFood.meal_log_id,
//       food_id: mealLogFood.food_id,
//       meal_type: mealLogFood.meal_type,
//       num_servings: mealLogFood.num_servings,
//       serving_size: mealLogFood.serving_size,
//       serving_unit: mealLogFood.serving_unit,
//       created_at: mealLogFood.created_at,
//       calories: mealLogFood.calories || null
//     };

//     mealLogFoods[mealLogId] = mealLogFoods[mealLogId] || [];
//     mealLogFoods[mealLogId].push(mealLogFoodObject);
//   });

//   setMealLogFoods(prev => ({
//     ...prev,
//     ...mealLogFoods
//   }));

//   return mealLogFoods;
// };

// export const addMealLogFood = async (mealLogId: number,
//                                      foodId: number,
//                                      numServings: number | null = null,
//                                      servingSize: number | null = null,
//                                      foodsMenuOpenMealType: string,
//                                      setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
//                                      setFoods: React.Dispatch<React.SetStateAction<Record<number, Food>>>,
//                                      token: string) => {
//   const mealLogFoodResponse = await axios.post(`${API_BASE_URL}/meal-log-foods`,
//     {
//       meal_log_id: mealLogId,
//       food_id: foodId,
//       meal_type: foodsMenuOpenMealType,
//       ...(numServings !== null && { num_servings: numServings }),
//       ...(servingSize !== null && { serving_size: servingSize })
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );
//   const mealLogFood = mealLogFoodResponse.data;

//   setMealLogFoods(prev => ({
//     ...prev,
//     [mealLogId]: [...(prev[mealLogId] || []), mealLogFood]
//   }));

//   loadFood(foodId, setFoods, token);
// };

// export const updateMealLogFood = async (
//   mealLogFoodId: number,
//   mealLogId: number | null,
//   numServings: number | null = null,
//   servingSize: number | null = null,
//   foodsMenuOpenMealType: string,
//   setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
//   token: string
// ) => {
//   const mealLogFoodResponse = await axios.patch(`${API_BASE_URL}/meal-log-foods/${mealLogFoodId}`,
//     {
//       ...(mealLogId !== null && { meal_log_id: mealLogId }),
//       ...(foodsMenuOpenMealType !== null && { meal_type: foodsMenuOpenMealType }),
//       ...(numServings !== null && { num_servings: numServings }),
//       ...(servingSize !== null && { serving_size: servingSize })
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   const updatedMealLogFood = mealLogFoodResponse.data;

//   setMealLogFoods(prev => {
//     const currentMealLogFoods = prev[updatedMealLogFood.meal_log_id];

//     const updatedMealLogFoods = currentMealLogFoods.map((mealLogFood: MealLogFood) =>
//       mealLogFood.id === mealLogFoodId ? updatedMealLogFood : mealLogFood
//     );

//     return {
//       ...prev,
//       [updatedMealLogFood.meal_log_id]: updatedMealLogFoods
//     };
//   });
// };

// export const copyMealLogFoods = async (
//   mealLogFoodIds: number[],
//   targetMealLogId: number,
//   setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
//   token: string
// ) => {
//   await axios.post(`${API_BASE_URL}/meal-log-foods/bulk`,
//     {
//       action: "copy",
//       ids: mealLogFoodIds,
//       target_meal_log_id: targetMealLogId
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   await loadMealLogFoods(targetMealLogId, setMealLogFoods, token);
// }

// export const moveMealLogFoods = async (
//   currentMealLogId: number,
//   mealLogFoodIds: number[],
//   targetMealLogId: number,
//   setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
//   token: string
// ) => {
//   await axios.post(`${API_BASE_URL}/meal-log-foods/bulk`,
//     {
//       action: "move",
//       ids: mealLogFoodIds,
//       target_meal_log_id: targetMealLogId
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   setMealLogFoods(prevMealLogFoods => {
//     const mealLogFoodEntries: [string, MealLogFood[]][] = [];
//     const targetMealLogFoodsArray: MealLogFood[] = [];

//     Object.entries(prevMealLogFoods).forEach(([logId, mealLogFoodsArray]) => {
//       if (Number(logId) === currentMealLogId) {
//         const sourceMealLogFoodsArray: MealLogFood[] = [];
//         mealLogFoodsArray.forEach(mealLogFood => {
//           if (mealLogFoodIds.includes(mealLogFood.id)) {
//             targetMealLogFoodsArray.push(mealLogFood);
//           } else {
//             sourceMealLogFoodsArray.push(mealLogFood);
//           }
//         });
//         mealLogFoodEntries.push([logId, sourceMealLogFoodsArray]);

//       } else if (Number(logId) === targetMealLogId) {
//         targetMealLogFoodsArray.push(...mealLogFoodsArray);
        
//       } else {
//         mealLogFoodEntries.push([logId, mealLogFoodsArray]);
//       }
//     });

//     mealLogFoodEntries.push([String(targetMealLogId), targetMealLogFoodsArray]);

//     const updatedMealLogFoods = Object.fromEntries(mealLogFoodEntries);

//     return updatedMealLogFoods;
//   });
// }

// export const deleteMealLogFoods = async (
//   mealLogFoodIds: number[],
//   setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
//   token: string
// ) => {
//   await axios.post(`${API_BASE_URL}/meal-log-foods/bulk`,
//     {
//       action: "delete",
//       ids: mealLogFoodIds,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   setMealLogFoods(prevMealLogFoods =>
//     Object.fromEntries(
//       Object.entries(prevMealLogFoods).map(([logId, mealLogFoodsArray]) => [
//         logId,
//         mealLogFoodsArray.filter(mealLogFood => !mealLogFoodIds.includes(mealLogFood.id))
//       ])
//     )
//   );
// }

// // ---------------------------------------------------------------------------

// export const loadFood = async (foodId: number,
//                                setFoods: React.Dispatch<React.SetStateAction<Record<number, Food>>>,
//                                token: string) => {
//   const foodResponse = await axios.get(`${API_BASE_URL}/foods/${foodId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   if (foodResponse.data.length === 0) {
//     return {};
//   }

//   const food = foodResponse.data;

//   setFoods(prev => ({
//     ...prev,
//     [foodId]: food
//   }));

//   return food;
// };

// export const getFoods = async (limit: number,
//                                skip: number,
//                                search: string,
//                                setFoodSearchResults: React.Dispatch<React.SetStateAction<Food[]>>,
//                                token: string,
//                                expand?: string[],
//                               ) => {
//   const foodsResponse = await axios.get(`${API_BASE_URL}/foods`,
//     {
//       params: {
//         limit,
//         skip,
//         search,
//         expand
//       },
//       paramsSerializer: params => {
//         const searchParams = new URLSearchParams();
//         Object.entries(params).forEach(([key, value]) => {
//           if (Array.isArray(value)) {
//             value.forEach(v => searchParams.append(key, v));
//           } else if (value !== undefined) {
//             searchParams.append(key, value as string);
//           }
//         });
//         return searchParams.toString();
//       },
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   if (foodsResponse.data.foods.length === 0) {
//     return [];
//   }

//   const foodSearchObject = foodsResponse.data;

//   setFoodSearchResults(foodsResponse.data.foods);

//   return foodSearchObject;
// };

// // ---------------------------------------------------------------------------

// export const loadBrandedFood = async (foodId: number,
//                                       setBrandedFoods: React.Dispatch<React.SetStateAction<Record<number, BrandedFood>>>,
//                                       token: string) => {
//   const brandedFoodResponse = await axios.get(`${API_BASE_URL}/branded-foods/${foodId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   if (brandedFoodResponse.data.length === 0) {
//     return {};
//   }

//   const brandedFood = brandedFoodResponse.data;

//   setBrandedFoods(prev => ({
//     ...prev,
//     [foodId]: brandedFood
//   }));

//   return brandedFood;
// };

// // ---------------------------------------------------------------------------

// export const loadFoodNutrients = async (
//   foodId: number,
//   setFoodNutrients: React.Dispatch<React.SetStateAction<Record<number, FoodNutrient[]>>>,
//   setNutrients: React.Dispatch<React.SetStateAction<Record<number, Nutrient>>>,
//   token: string,
//   expand?: string[]
// ) => {
//   const foodNutrientsResponse = await axios.get(`${API_BASE_URL}/food-nutrients/${foodId}`,
//     {
//       params: {
//         expand
//       },
//       paramsSerializer: params => {
//         const searchParams = new URLSearchParams();
//         Object.entries(params).forEach(([key, value]) => {
//           if (Array.isArray(value)) {
//             value.forEach(v => searchParams.append(key, v));
//           } else if (value !== undefined) {
//             searchParams.append(key, value as string);
//           }
//         });
//         return searchParams.toString();
//       },
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   const foodNutrientsResponseArray: FoodNutrientResponse[] = foodNutrientsResponse.data;

//   if (foodNutrientsResponseArray.length === 0) {
//     return [];
//   }
  
//   const newFoodNutrients: FoodNutrient[] = [];
//   const newNutrients: Record<number, Nutrient> = {};

//   foodNutrientsResponseArray.forEach((foodNutrientResponse: FoodNutrientResponse) => {
//     newFoodNutrients.push({
//       id: foodNutrientResponse.id,
//       food_id: foodNutrientResponse.food_id,
//       nutrient_id: foodNutrientResponse.nutrient_id,
//       amount: foodNutrientResponse.amount,
//     });

//     if (foodNutrientResponse.nutrient) {
//       newNutrients[foodNutrientResponse.nutrient.id] = foodNutrientResponse.nutrient;
//     }
//   });

//   setFoodNutrients(prev => ({
//     ...prev,
//     [foodId]: newFoodNutrients
//   }));

//   setNutrients(prev => ({
//     ...prev,
//     ...newNutrients
//   }));

//   return foodNutrientsResponseArray;
// };

// // ---------------------------------------------------------------------------

// export const loadNutrient = async (nutrient_id: number,
//                                    setNutrients: React.Dispatch<React.SetStateAction<Record<number, Nutrient>>>,
//                                    token: string) => {
//   const nutrientResponse = await axios.get(`${API_BASE_URL}/nutrients/${nutrient_id}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );

//   if (nutrientResponse.data.length === 0) {
//     return;
//   }

//   const nutrient = nutrientResponse.data;

//   setNutrients(prev => ({
//     ...prev,
//     [nutrient_id]: nutrient
//   }));

//   return nutrient;
// };
