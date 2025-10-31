import { useCallback } from "react";
import MealOptionsMenu from "../MealOptionsMenu/MealOptionsMenu";
import { type MealLog, type MealLogFood } from '../../types/meal-logs';
import type { Value } from "react-calendar/dist/shared/types.js";
import { capitalizeFirstLetter } from "../../../../utils/app";
import { getDateKey } from '../../../../utils/dates';
import dotsIcon from '../../../../assets/dots-icon.svg';
import boxIcon from '../../../meal-logs/components/MealLogsPage/assets/box-icon.svg';
import checkBoxIcon from '../../../meal-logs/components/MealLogsPage/assets/check-box-2-icon.svg';
import './MealSectionHeader.css';


type MealSectionHeaderProps = {
  mealType: string;
  mealOptionsMenuOpenType: string;
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  mealLogs: Record<string, MealLog>;
  mealLogFoods: Record<number, MealLogFood[]>;
  currentMealLogDate: Value;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMealTypes: string[];
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMealLogFoodIds: number[];
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectingMealLogFoods: boolean;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteMeal: (mealType: string) => Promise<void>;
};


export default function MealSectionHeader({
  mealType,
  mealOptionsMenuOpenType,
  setMealOptionsMenuOpenType,
  mealOptionsMenuRefs,
  mealLogs,
  mealLogFoods,
  currentMealLogDate,
  setAllItemsSelected,
  selectedMealTypes,
  setSelectedMealTypes,
  selectedMealLogFoodIds,
  setSelectedMealLogFoodIds,
  selectingMealLogFoods,
  setCalendarOpenType,
  handleDeleteMeal
}: MealSectionHeaderProps) {
  const handleSelectMeal = useCallback(async () => {
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

    if (selectedMealTypes.includes(mealType)) {
      setAllItemsSelected(false);

      setSelectedMealTypes(prev =>
        prev.filter((type: string) => type !== mealType)
      )

      const selectedMealLogFoodIdsInMealType = mealLogFoodIdsInMealType.filter(
        (mealLogFoodId: number) => selectedMealLogFoodIds.includes(mealLogFoodId)
      );
      setSelectedMealLogFoodIds(prev => prev.filter(
        (mealLogFoodId: number) => !selectedMealLogFoodIdsInMealType.includes(mealLogFoodId)
      ))

      return;
    }

    const newSelectedMealLogFoodIds = mealLogFoodIdsInMealType.filter(
      (mealLogFoodId: number) => !selectedMealLogFoodIds.includes(mealLogFoodId)
    )
    setSelectedMealLogFoodIds(prev => [...prev, ...newSelectedMealLogFoodIds])

    if (selectedMealTypes.length === 3) {
      setAllItemsSelected(true);
    }

    setSelectedMealTypes(prev => [...prev, mealType]);
  }, [
    mealType,
    currentMealLogDate,
    mealLogs,
    mealLogFoods,
    selectedMealLogFoodIds,
    setSelectedMealLogFoodIds,
    setAllItemsSelected,
    selectedMealTypes,
    setSelectedMealTypes
  ]);

  
  return (
    <div
      className={`meal-type-container ${selectingMealLogFoods && 'selectable-meal-type-container'}`}
      onClick={() => handleSelectMeal()}
    >
      <h3 className="meal-type">
        {capitalizeFirstLetter(mealType)}
      </h3>

      {selectingMealLogFoods ? (
        <div className="check-box">
          {selectedMealTypes.includes(mealType) ? (
            <img className="button-link-image" src={checkBoxIcon} />
          ) : (
            <img className="button-link-image" src={boxIcon} />
          )}
        </div>
      ) : (
        <button
          className="meal-options-button"
          onClick={(e) => {
            e.stopPropagation();
            setMealOptionsMenuOpenType((prev) => (prev === mealType ? '' : mealType));
          }}
        >
          <img className="button-link-image" src={dotsIcon} />
        </button>
      )}

      <MealOptionsMenu
        mealType={mealType}
        mealOptionsMenuOpenType={mealOptionsMenuOpenType}
        setMealOptionsMenuOpenType={setMealOptionsMenuOpenType}
        mealOptionsMenuRefs={mealOptionsMenuRefs}
        mealLogs={mealLogs}
        mealLogFoods={mealLogFoods}
        currentMealLogDate={currentMealLogDate}
        setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
        setCalendarOpenType={setCalendarOpenType}
        handleDeleteMeal={handleDeleteMeal}
      />
    </div>
  );
}
