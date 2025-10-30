import { useCallback } from "react";
import MealFoodOptionsMenu from "../MealFoodOptionsMenu/MealFoodOptionsMenu";
import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood,
  type FoodNutrient,
} from "../../types/meal-logs";
import type { Value } from "react-calendar/dist/shared/types.js";
import { getDateKey } from "../../../../utils/dates";
import dotsIcon from '../../../../assets/dots-icon.svg';
import boxIcon from '../../../meal-logs/components/MealLogsPage/assets/box-icon.svg';
import checkBoxIcon from '../../../meal-logs/components/MealLogsPage/assets/check-box-2-icon.svg';
import './MealFood.css';


type MealFoodProps = {
  mealType: string;
  mealLogFood: MealLogFood;
  currentMealLogDate: Value;
  mealLogs: Record<string, MealLog>;
  mealLogFoods: Record<number, MealLogFood[]>;
  foods: Record<number, Food>;
  brandedFoods: Record<number, BrandedFood>;
  foodNutrients: Record<number, FoodNutrient[]>;
  setNumServings: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSize: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSizeUnit: React.Dispatch<React.SetStateAction<string>>;
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealFoodOptionsMenuOpenId: number | null;
  setMealFoodOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMealLogFoodIds: number[];
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectingMealLogFoods: boolean;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  editingMealLogFoodId: number | null;
  setEditingMealLogFoodId: React.Dispatch<React.SetStateAction<number | null>>;
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>;
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  mealFoodOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  handleLoadFoodNutrients: (foodId: number) => Promise<void>;
  handleDeleteMealLogFood: (mealLogFoodId: number) => Promise<void>;
};


export default function MealFood({
  mealType,
  mealLogFood,
  currentMealLogDate,
  mealLogs,
  mealLogFoods,
  foods,
  brandedFoods,
  foodNutrients,
  setNumServings,
  setServingSize,
  setServingSizeUnit,
  setMealOptionsMenuOpenType,
  mealFoodOptionsMenuOpenId,
  setMealFoodOptionsMenuOpenId,
  selectedMealLogFoodIds,
  setSelectedMealLogFoodIds,
  setSelectedMealTypes,
  selectingMealLogFoods,
  setCalendarOpenType,
  editingMealLogFoodId,
  setEditingMealLogFoodId,
  setFoodsMenuOpenMealType,
  setViewFoodMenuOpenId,
  mealFoodOptionsMenuRefs,
  handleLoadFoodNutrients,
  handleDeleteMealLogFood
}: MealFoodProps) {
  const handleSelectMealFood = useCallback(async () => {
    if (selectedMealLogFoodIds.includes(mealLogFood.id)) {
      setSelectedMealLogFoodIds(prev =>
        prev.filter((mealLogFoodId: number) => mealLogFoodId !== mealLogFood.id)
      )

      setSelectedMealTypes(prev => prev.filter((type: string) => type !== mealType))

      return;
    }

    if (!currentMealLogDate) {
      return;
    }
    const dateKey = getDateKey(currentMealLogDate);
    if (!dateKey) {
      return;
    }
    const currentMealLogId = mealLogs[dateKey].id;
    const currentMealLogFoods = mealLogFoods[currentMealLogId];
    const mealLogFoodsInMealType = currentMealLogFoods.filter(
      (mealLogFood: MealLogFood) => mealLogFood.meal_type === mealType
    );
    const mealLogFoodIdsInMealType = mealLogFoodsInMealType.map(
      (mealLogFood: MealLogFood) => mealLogFood.id
    );
    const selectedMealLogFoodIdsInMealType = mealLogFoodIdsInMealType.filter(
      (mealLogFoodId: number) => selectedMealLogFoodIds.includes(mealLogFoodId)
    );
    if (mealLogFoodIdsInMealType.length === selectedMealLogFoodIdsInMealType.length + 1) {
      setSelectedMealTypes(prev => [...prev, mealType]);
    }

    setSelectedMealLogFoodIds(prev => [...prev, mealLogFood.id]);
  }, [
    mealType,
    mealLogFood,
    currentMealLogDate,
    mealLogs,
    mealLogFoods,
    setSelectedMealTypes,
    selectedMealLogFoodIds,
    setSelectedMealLogFoodIds,
  ]);

  
  return (
    <div
      className="meal-log-food"
      onMouseDown={(e) => {
        e.stopPropagation();
        setMealOptionsMenuOpenType('');
      }}
      onClick={(e) => {
        e.stopPropagation();

        if (selectingMealLogFoods) {
          handleSelectMealFood();
          return;
        }

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

      {selectingMealLogFoods ? (
        <div className="meal-log-food-section">
          <div className="check-box">
            {selectedMealLogFoodIds && selectedMealLogFoodIds.includes(mealLogFood.id) ? (
              <img className="button-link-image" src={checkBoxIcon} />
            ) : (
              <img className="button-link-image" src={boxIcon} />
            )}
          </div>
        </div>
      ) : (
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
            setMealFoodOptionsMenuOpenId={setMealFoodOptionsMenuOpenId}
            setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
            setCalendarOpenType={setCalendarOpenType}
            mealFoodOptionsMenuRefs={mealFoodOptionsMenuRefs}
            handleDeleteMealLogFood={handleDeleteMealLogFood}
          />
        </div>
      )}
    </div>
  );
}
