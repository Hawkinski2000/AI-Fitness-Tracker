import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood,
  type FoodNutrient,
} from "../../types/workout-logs";
import type { Value } from "react-calendar/dist/shared/types.js";
import MealFood from "../MealFood/MealFood";
import { getDateKey } from "../../../../utils/dates";


type MealSectionFoodsProps = {
  mealType: string;
  currentMealLogDate: Value;
  mealLogs: Record<string, MealLog>;
  mealLogFoods: Record<number, MealLogFood[]>;
  foods: Record<number, Food>;
  brandedFoods: Record<number, BrandedFood>;
  foodNutrients: Record<number, FoodNutrient[]>;
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>;
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  viewFoodMenuOpenId: number | null;
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealFoodOptionsMenuOpenId: number | null;
  setMealFoodOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMealLogFoodIds: number[];
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectingMealLogFoods: boolean;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  editingMealLogFoodId: number | null;
  setEditingMealLogFoodId: React.Dispatch<React.SetStateAction<number | null>>;
  setNumServings: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSize: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSizeUnit: React.Dispatch<React.SetStateAction<string>>;
  mealFoodOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  handleLoadFoodNutrients: (foodId: number) => Promise<void>;
  handleDeleteMealLogFoods: (mealLogFoodId: number) => Promise<void>;
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
  viewFoodMenuOpenId,
  setMealOptionsMenuOpenType,
  mealFoodOptionsMenuOpenId,
  setMealFoodOptionsMenuOpenId,
  setAllItemsSelected,
  setSelectedMealTypes,
  selectedMealLogFoodIds,
  setSelectedMealLogFoodIds,
  selectingMealLogFoods,
  setCalendarOpenType,
  editingMealLogFoodId,
  setEditingMealLogFoodId,
  setNumServings,
  setServingSize,
  setServingSizeUnit,
  mealFoodOptionsMenuRefs,
  handleLoadFoodNutrients,
  handleDeleteMealLogFoods
}: MealSectionFoodsProps) {
  const dateKey = getDateKey(currentMealLogDate);

  return (
    <>
      {
        currentMealLogDate &&
        dateKey &&
        mealLogs[dateKey] &&
        mealLogFoods[mealLogs[dateKey].id]
          ?.filter(mealLogFoodItem => mealLogFoodItem.meal_type === mealType)
          .map((mealLogFood: MealLogFood) => {
            return (
              <MealFood
                key={mealLogFood.id}
                mealType={mealType}
                mealLogFood={mealLogFood}
                currentMealLogDate={currentMealLogDate}
                mealLogs={mealLogs}
                mealLogFoods={mealLogFoods}
                foods={foods}
                brandedFoods={brandedFoods}
                foodNutrients={foodNutrients}
                setNumServings={setNumServings}
                setServingSize={setServingSize}
                setServingSizeUnit={setServingSizeUnit}
                setSelectedMealTypes={setSelectedMealTypes}
                setMealOptionsMenuOpenType={setMealOptionsMenuOpenType}
                mealFoodOptionsMenuOpenId={mealFoodOptionsMenuOpenId}
                setAllItemsSelected={setAllItemsSelected}
                setMealFoodOptionsMenuOpenId={setMealFoodOptionsMenuOpenId}
                selectedMealLogFoodIds={selectedMealLogFoodIds}
                setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
                selectingMealLogFoods={selectingMealLogFoods}
                setCalendarOpenType={setCalendarOpenType}
                editingMealLogFoodId={editingMealLogFoodId}
                setEditingMealLogFoodId={setEditingMealLogFoodId}
                setFoodsMenuOpenMealType={setFoodsMenuOpenMealType}
                viewFoodMenuOpenId={viewFoodMenuOpenId}
                setViewFoodMenuOpenId={setViewFoodMenuOpenId}
                mealFoodOptionsMenuRefs={mealFoodOptionsMenuRefs}
                handleLoadFoodNutrients={handleLoadFoodNutrients}
                handleDeleteMealLogFoods={handleDeleteMealLogFoods}
              />
            )
          })
      }
    </>
  );
}
