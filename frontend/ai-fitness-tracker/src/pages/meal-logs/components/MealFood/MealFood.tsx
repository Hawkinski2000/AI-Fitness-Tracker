import MealFoodOptionsMenu from "../MealFoodOptionsMenu/MealFoodOptionsMenu";
import {
  type MealLogFood,
  type Food,
  type BrandedFood,
  type FoodNutrient,
} from "../../types/meal-logs";
import dotsIcon from '../../../../assets/dots-icon.svg';
import './MealFood.css';


type MealFoodProps = {
  mealType: string;
  mealLogFood: MealLogFood;
  foods: Record<number, Food>;
  brandedFoods: Record<number, BrandedFood>;
  foodNutrients: Record<number, FoodNutrient[]>;
  setNumServings: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSize: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSizeUnit: React.Dispatch<React.SetStateAction<string>>;
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealFoodOptionsMenuOpenId: number | null;
  setMealFoodOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  editingMealLogFoodId: number | null;
  setEditingMealLogFoodId: React.Dispatch<React.SetStateAction<number | null>>;
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>;
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  mealFoodOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  handleLoadFoodNutrients: (foodId: number) => Promise<void>;
  handleCopyMealLogFood: (mealLogFoodId: number, targetMealLogId: number) => Promise<void>;
  handleDeleteMealLogFood: (mealLogFoodId: number) => Promise<void>;
};


export default function MealFood({
  mealType,
  mealLogFood,
  foods,
  brandedFoods,
  foodNutrients,
  setNumServings,
  setServingSize,
  setServingSizeUnit,
  setMealOptionsMenuOpenType,
  mealFoodOptionsMenuOpenId,
  setMealFoodOptionsMenuOpenId,
  editingMealLogFoodId,
  setEditingMealLogFoodId,
  setFoodsMenuOpenMealType,
  setViewFoodMenuOpenId,
  mealFoodOptionsMenuRefs,
  handleLoadFoodNutrients,
  handleCopyMealLogFood,
  handleDeleteMealLogFood
}: MealFoodProps) {
  return (
    <div
      className="meal-log-food"
      onMouseDown={(e) => {
        e.stopPropagation();
        setMealOptionsMenuOpenType('');
      }}
      onClick={(e) => {
        e.stopPropagation();
        setMealFoodOptionsMenuOpenId(null);
        
        if (editingMealLogFoodId === mealLogFood.id) {
          setEditingMealLogFoodId(null);
          setFoodsMenuOpenMealType('');
          setMealFoodOptionsMenuOpenId(null);
          return;
        }

        if (!foodNutrients[mealLogFood.food_id]) {
          handleLoadFoodNutrients(mealLogFood.food_id);
        }
        if (!mealLogFood.num_servings) {
          setNumServings(1);
        }
        else {
          setNumServings(mealLogFood.num_servings);
        }
        if (!mealLogFood.serving_size) {
          setServingSize(brandedFoods[mealLogFood.food_id].serving_size || null);
        }
        else {
          setServingSize(mealLogFood.serving_size);
        }
        if (!mealLogFood.serving_unit) {
          setServingSizeUnit(brandedFoods[mealLogFood.food_id].serving_size_unit || '');
        }
        else {
          setServingSizeUnit(mealLogFood.serving_unit);
        }
        setEditingMealLogFoodId(mealLogFood.id);
        setFoodsMenuOpenMealType(mealType);
        setViewFoodMenuOpenId(mealLogFood.food_id);
      }}
    >
      <div className="meal-log-food-section">
        <p className="meal-log-food-text">{foods[mealLogFood.food_id]?.description ?? ''}</p>
        <p className="meal-log-food-serving-text">
          {
            (mealLogFood.num_servings * mealLogFood.serving_size).toFixed(1).replace(/\.0$/, '')
          }{' '}
          {mealLogFood.serving_unit}
        </p>
      </div>

      <div className="meal-log-food-section">
        <div className="meal-options-button-container">
          <button
            className="meal-log-food-options-button"
            onClick={(e) => {
              e.stopPropagation();
              setFoodsMenuOpenMealType('');
              setViewFoodMenuOpenId(null);
              setEditingMealLogFoodId(null);
              setMealFoodOptionsMenuOpenId(
                (prev) => (prev === mealLogFood.id ? null : mealLogFood.id)
              );
            }}
          >
            <img className="button-link-image" src={dotsIcon} />
          </button>
        </div>
        
        <p className="meal-log-food-text">
          {mealLogFood.calories ? `${mealLogFood.calories} calories` : ''}
        </p>

        <MealFoodOptionsMenu
          mealLogFood={mealLogFood}
          mealFoodOptionsMenuOpenId={mealFoodOptionsMenuOpenId}
          mealFoodOptionsMenuRefs={mealFoodOptionsMenuRefs}
          handleCopyMealLogFood={handleCopyMealLogFood}
          handleDeleteMealLogFood={handleDeleteMealLogFood}
        />
      </div>
    </div>
  );
}
