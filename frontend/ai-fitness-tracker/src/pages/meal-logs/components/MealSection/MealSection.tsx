import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood,
  type FoodNutrient,
} from "../../types/meal-logs";
import MealSectionHeader from "../MealSectionHeader/MealSectionHeader";
import dotsIcon from '../../../../assets/dots-icon.svg';
import copyIcon from '../../../../assets/copy-icon.svg';
import moveIcon from '../../../../assets/move-icon.svg';
import deleteIcon from '../../../../assets/delete-icon.svg';


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

  {/* ---------------------------------------------------------------------- */}
  {/* ---- Meal Section Foods ---- */}

      {
        currentMealLogDate &&
        mealLogs[currentMealLogDate] &&
        mealLogFoods[mealLogs[currentMealLogDate].id]
          ?.filter(mealLogFoodItem => mealLogFoodItem.meal_type === mealType)
          .map((mealLogFood: MealLogFood) => {
            return (
              <div
                key={mealLogFood.id}
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
                    {(mealLogFood.num_servings * mealLogFood.serving_size).toFixed(1).replace(/\.0$/, '')}{' '}
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
                        setMealFoodOptionsMenuOpenId((prev) => (prev === mealLogFood.id ? null : mealLogFood.id));
                      }}
                    >
                      <img className="button-link-image" src={dotsIcon} />
                    </button>
                    </div>
                    <p className="meal-log-food-text">{mealLogFood.calories ? `${mealLogFood.calories} calories` : ''}</p>

  {/* ---------------------------------------------------------------------- */}
  {/* ---- Meal Section Foods Options Menu ---- */}

                  <div
                    ref={el => { mealFoodOptionsMenuRefs.current[mealLogFood.id] = el }}
                    className={`meal-options-menu meal-log-food-options-menu ${mealFoodOptionsMenuOpenId === mealLogFood.id && 'meal-options-menu-open'}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="meal-options-menu-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleCopyMealFood(mealType, ...);
                      }}
                    >
                      <img className="button-link-image" src={copyIcon} />
                      Copy to...
                    </button>

                    <button
                      className="meal-options-menu-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // handleMoveMealFood(mealType, ...);
                      }}
                    >
                      <img className="button-link-image" src={moveIcon} />
                      Move to...
                    </button>

                    <button
                      className="meal-options-menu-button meal-options-delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMealLogFood(mealLogFood.id);
                      }}
                    >
                      <img className="button-link-image" src={deleteIcon} />
                      Delete Entry
                    </button>
                  </div>
                </div>
              </div>
            )
          })
      }
    
  {/* ---------------------------------------------------------------------- */}

      <button
        className="add-food-button"
        onClick={(e) => {
          e.stopPropagation();
          setFoodSearch('');
          setFoodMenuInputFocused(false);
          if (!editingMealLogFoodId) {
            setFoodsMenuOpenMealType((prev) => (prev === mealType ? '' : mealType));
          }
          else {
            setEditingMealLogFoodId(null);
            setViewFoodMenuOpenId(null);
            setFoodsMenuOpenMealType(mealType);
          }
        }}
      >
        Add Food
      </button>
    </section>
  );
}
