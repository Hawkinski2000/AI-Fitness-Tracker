export interface MealLog {
  id: number;
  log_date: string;
  total_calories: number | null;
}


export interface MealLogResponse {
  id: number;
  log_date: string;
  total_calories: number | null;
  meal_log_foods: MealLogFood[];
  foods: Food[];
  branded_foods: BrandedFood[];
}


export interface MealLogFood {
  id: number;
  meal_log_id: number;
  food_id: number;
  meal_type: string;
  num_servings: number;
  serving_size: number;
  serving_unit: string;
  created_at: string;
  calories: number | null;
}


export interface Food {
  id: number;
  description: string;
  calories: number | null;
  user_id: number | null;
  user_created_at: string | null;
}


export interface BrandedFood {
  food_id: number;
  brand_owner: string | null;
  brand_name: string | null;
  subbrand_name: string | null;
  ingredients: string | null;
  serving_size: number | null;
  serving_size_unit: string | null;
  food_category: string | null;
}


export interface FoodNutrient {
  id: number;
  food_id: number;
  nutrient_id: number;
  amount: number;
}


export interface Nutrient {
  id: number;
  name: string;
  unit_name: string;
}
