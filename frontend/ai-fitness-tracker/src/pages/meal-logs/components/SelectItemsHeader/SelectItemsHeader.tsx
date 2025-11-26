import { useCallback } from 'react';
import { type MealLog, type MealLogFood } from '../../types/meal-logs';
import { type Value } from 'react-calendar/dist/shared/types.js';
import { getDateKey } from '../../../../utils/dates';
import closeIcon from '../../../../assets/close-icon.svg';
import boxIcon from '../../../../assets/box-icon.svg';
import checkBoxIcon from '../../../../assets/check-box-2-icon.svg';
import './SelectItemsHeader.css';


type SelectItemsHeaderProps = {
  allItemsSelected: boolean;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectingMealLogFoods: boolean;
  setSelectingMealLogFoods: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMealLogFoodIds: number[];
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  currentMealLogDate: Value;
  mealLogs: Record<string, MealLog>;
  mealLogFoods: Record<number, MealLogFood[]>;
};


export default function SelectItemsHeader({
  allItemsSelected,
  setAllItemsSelected,
  setSelectedMealTypes,
  selectingMealLogFoods,
  setSelectingMealLogFoods,
  selectedMealLogFoodIds,
  setSelectedMealLogFoodIds,
  currentMealLogDate,
  mealLogs,
  mealLogFoods
}: SelectItemsHeaderProps) {
  const handleSelectAll = useCallback(async () => {
      if (allItemsSelected) {
        setSelectedMealTypes([]);
        setSelectedMealLogFoodIds([]);
        return;
      }
    
      if (!currentMealLogDate) {
          return;
      }
      const dateKey = getDateKey(currentMealLogDate);
      if (!dateKey) {
        return;
      }
      setSelectedMealTypes(['breakfast', 'lunch', 'dinner', 'snacks']);
      const currentMealLogId = mealLogs[dateKey].id;
      const currentMealLogFoods = mealLogFoods[currentMealLogId];
      const mealLogFoodIds = currentMealLogFoods.map(
        (mealLogFood: MealLogFood) => mealLogFood.id
      );
      setSelectedMealLogFoodIds(mealLogFoodIds);
    }, [
      allItemsSelected,
      setSelectedMealTypes,
      currentMealLogDate,
      mealLogs,
      mealLogFoods,
      setSelectedMealLogFoodIds,
    ]);


  return (
    <header
      className={
        `select-items-header
        ${selectingMealLogFoods && 'select-items-header-open'}`
      }
    >
      <div className='select-items-header-section'>
        <button
          className='select-items-header-close-button'
          onClick={() => {
            setSelectingMealLogFoods(false);
            setAllItemsSelected(false);
            setSelectedMealTypes([]);
            setSelectedMealLogFoodIds([]);
          }}
        >
          <img className="button-link-image" src={closeIcon} />
        </button>

        <p className='select-items-header-text'>
          {selectedMealLogFoodIds.length > 0
            ? `Selected ${selectedMealLogFoodIds.length}
              item${selectedMealLogFoodIds.length !== 1 ? 's' : ''}`
            : 'Select items'
          }
        </p>
      </div>

      <div className='select-items-header-section'>
        <div
          className="check-box select-all-check-box"
          onClick={() => {
            handleSelectAll();
            setAllItemsSelected(prev => !prev);
          }}
        >
          {allItemsSelected ? (
            <img className="button-link-image" src={checkBoxIcon} />
          ) : (
            <img className="button-link-image" src={boxIcon} />
          )}
        </div>
      </div>
    </header>
  );
}
