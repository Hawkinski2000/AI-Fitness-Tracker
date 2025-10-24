import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood,
  type FoodNutrient,
} from "../../types/meal-logs";
import MealSectionHeader from "../MealSectionHeader/MealSectionHeader";
import MealSectionFoods from "../MealSectionFoods/MealSectionFoods";
import AddFoodButton from "../AddFoodButton/AddFoodButton";
import './MealSection.css';


type MealSectionProps = {
  mealType: string;
  currentMealLogDate: string | null;
  mealLogs: Record<string, MealLog>;
  mealLogFoods: Record<number, MealLogFood[]>;
  foods: Record<number, Food>;
  brandedFoods: Record<number, BrandedFood>;
  foodNutrients: Record<number, FoodNutrient[]>;
  mealOptionsMenuOpenType: string;
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealFoodOptionsMenuOpenId: number | null;
  setMealFoodOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  editingMealLogFoodId: number | null;
  setEditingMealLogFoodId: React.Dispatch<React.SetStateAction<number | null>>;
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>;
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  setNumServings: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSize: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSizeUnit: React.Dispatch<React.SetStateAction<string>>;
  setFoodSearch: React.Dispatch<React.SetStateAction<string>>;
  setFoodMenuInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  mealOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  mealFoodOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  handleDeleteMeal: (mealType: string) => Promise<void>;
  handleDeleteMealLogFood: (mealLogFoodId: number) => Promise<void>;
  handleLoadFoodNutrients: (foodId: number) => Promise<void>;
};


export default function MealSection({
  mealType,
  currentMealLogDate,
  mealLogs,
  mealLogFoods,
  foods,
  brandedFoods,
  foodNutrients,
  mealOptionsMenuOpenType,
  setMealOptionsMenuOpenType,
  mealFoodOptionsMenuOpenId,
  setMealFoodOptionsMenuOpenId,
  editingMealLogFoodId,
  setEditingMealLogFoodId,
  setFoodsMenuOpenMealType,
  setViewFoodMenuOpenId,
  setNumServings,
  setServingSize,
  setServingSizeUnit,
  setFoodSearch,
  setFoodMenuInputFocused,
  mealOptionsMenuRefs,
  mealFoodOptionsMenuRefs,
  handleDeleteMeal,
  handleDeleteMealLogFood,
  handleLoadFoodNutrients
}: MealSectionProps) {
  return (
    <section className="meal-section">
      <MealSectionHeader
        mealType={mealType}
        mealOptionsMenuOpenType={mealOptionsMenuOpenType}
        setMealOptionsMenuOpenType={setMealOptionsMenuOpenType}
        mealOptionsMenuRefs={mealOptionsMenuRefs}
        handleDeleteMeal={handleDeleteMeal}
      />

      <MealSectionFoods
        mealType={mealType}
        currentMealLogDate={currentMealLogDate}
        mealLogs={mealLogs}
        mealLogFoods={mealLogFoods}
        foods={foods}
        brandedFoods={brandedFoods}
        foodNutrients={foodNutrients}
        setFoodsMenuOpenMealType={setFoodsMenuOpenMealType}
        setViewFoodMenuOpenId={setViewFoodMenuOpenId}
        setMealOptionsMenuOpenType={setMealOptionsMenuOpenType}
        mealFoodOptionsMenuOpenId={mealFoodOptionsMenuOpenId}
        setMealFoodOptionsMenuOpenId={setMealFoodOptionsMenuOpenId}
        editingMealLogFoodId={editingMealLogFoodId}
        setEditingMealLogFoodId={setEditingMealLogFoodId}
        setNumServings={setNumServings}
        setServingSize={setServingSize}
        setServingSizeUnit={setServingSizeUnit}
        mealFoodOptionsMenuRefs={mealFoodOptionsMenuRefs}
        handleLoadFoodNutrients={handleLoadFoodNutrients}
        handleDeleteMealLogFood={handleDeleteMealLogFood}
      />
    
      <AddFoodButton
        mealType={mealType}
        setFoodSearch={setFoodSearch}
        setFoodMenuInputFocused={setFoodMenuInputFocused}
        editingMealLogFoodId={editingMealLogFoodId}
        setEditingMealLogFoodId={setEditingMealLogFoodId}
        setFoodsMenuOpenMealType={setFoodsMenuOpenMealType}
        setViewFoodMenuOpenId={setViewFoodMenuOpenId}
      />
    </section>
  );
}
