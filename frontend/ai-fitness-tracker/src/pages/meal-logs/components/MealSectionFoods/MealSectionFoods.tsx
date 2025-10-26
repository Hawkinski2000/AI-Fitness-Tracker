import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood,
  type FoodNutrient,
} from "../../types/meal-logs";
import MealFood from "../MealFood/MealFood";


type MealSectionFoodsProps = {
  mealType: string;
  currentMealLogDate: string | null;
  mealLogs: Record<string, MealLog>;
  mealLogFoods: Record<number, MealLogFood[]>;
  foods: Record<number, Food>;
  brandedFoods: Record<number, BrandedFood>;
  foodNutrients: Record<number, FoodNutrient[]>;
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>;
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealFoodOptionsMenuOpenId: number | null;
  setMealFoodOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  editingMealLogFoodId: number | null;
  setEditingMealLogFoodId: React.Dispatch<React.SetStateAction<number | null>>;
  setNumServings: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSize: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSizeUnit: React.Dispatch<React.SetStateAction<string>>;
  mealFoodOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  handleLoadFoodNutrients: (foodId: number) => Promise<void>;
  handleCopyMealLogFood: (mealLogFoodId: number, targetMealLogId: number) => Promise<void>;
  handleMoveMealLogFood: (mealLogFoodId: number, targetMealLogId: number) => Promise<void>;
  handleDeleteMealLogFood: (mealLogFoodId: number) => Promise<void>;
}


export default function MealSectionFoods({
  mealType,
  currentMealLogDate,
  mealLogs,
  mealLogFoods,
  foods,
  brandedFoods,
  foodNutrients,
  setFoodsMenuOpenMealType,
  setViewFoodMenuOpenId,
  setMealOptionsMenuOpenType,
  mealFoodOptionsMenuOpenId,
  setMealFoodOptionsMenuOpenId,
  editingMealLogFoodId,
  setEditingMealLogFoodId,
  setNumServings,
  setServingSize,
  setServingSizeUnit,
  mealFoodOptionsMenuRefs,
  handleLoadFoodNutrients,
  handleCopyMealLogFood,
  handleMoveMealLogFood,
  handleDeleteMealLogFood
}: MealSectionFoodsProps) {
  return (
    <>
      {
        currentMealLogDate &&
        mealLogs[currentMealLogDate] &&
        mealLogFoods[mealLogs[currentMealLogDate].id]
          ?.filter(mealLogFoodItem => mealLogFoodItem.meal_type === mealType)
          .map((mealLogFood: MealLogFood) => {
            return (
              <MealFood
                key={mealLogFood.id}
                mealType={mealType}
                mealLogFood={mealLogFood}
                foods={foods}
                brandedFoods={brandedFoods}
                foodNutrients={foodNutrients}
                setNumServings={setNumServings}
                setServingSize={setServingSize}
                setServingSizeUnit={setServingSizeUnit}
                setMealOptionsMenuOpenType={setMealOptionsMenuOpenType}
                mealFoodOptionsMenuOpenId={mealFoodOptionsMenuOpenId}
                setMealFoodOptionsMenuOpenId={setMealFoodOptionsMenuOpenId}
                editingMealLogFoodId={editingMealLogFoodId}
                setEditingMealLogFoodId={setEditingMealLogFoodId}
                setFoodsMenuOpenMealType={setFoodsMenuOpenMealType}
                setViewFoodMenuOpenId={setViewFoodMenuOpenId}
                mealFoodOptionsMenuRefs={mealFoodOptionsMenuRefs}
                handleLoadFoodNutrients={handleLoadFoodNutrients}
                handleCopyMealLogFood={handleCopyMealLogFood}
                handleMoveMealLogFood={handleMoveMealLogFood}
                handleDeleteMealLogFood={handleDeleteMealLogFood}
              />
            )
          })
      }
    </>
  );
}
