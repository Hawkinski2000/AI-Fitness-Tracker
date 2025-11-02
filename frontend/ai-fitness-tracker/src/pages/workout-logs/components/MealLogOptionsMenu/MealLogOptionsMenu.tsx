import { type MealLog, type MealLogFood } from '../../types/workout-logs';
import type { Value } from 'react-calendar/dist/shared/types.js';
import { getDateKey } from '../../../../utils/dates';
import checkBoxIcon from '../../../meal-logs/components/MealLogsPage/assets/check-box-icon.svg';
import copyIcon from '../../../../assets/copy-icon.svg';
import moveIcon from '../../../../assets/move-icon.svg';
import deleteIcon from '../../../../assets/delete-icon.svg';


type MealLogOptionsMenuProps = {
  mealLogOptionsMenuOpen: boolean;
  setMealLogOptionsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectingMealLogFoods: boolean;
  setSelectingMealLogFoods: React.Dispatch<React.SetStateAction<boolean>>;
  mealLogs: Record<string, MealLog>;
  mealLogFoods: Record<number, MealLogFood[]>;
  currentMealLogDate: Value;
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealLogOptionsMenuRef: React.RefObject<HTMLDivElement | null>;
  handleDeleteMealLogFoods: () => Promise<void>;
};


export default function MealLogOptionsMenu({
  mealLogOptionsMenuOpen,
  setMealLogOptionsMenuOpen,
  selectingMealLogFoods,
  setSelectingMealLogFoods,
  mealLogs,
  mealLogFoods,
  currentMealLogDate,
  setSelectedMealLogFoodIds,
  setCalendarOpenType,
  mealLogOptionsMenuRef,
  handleDeleteMealLogFoods
}: MealLogOptionsMenuProps) {
  return (
    <div
      ref={mealLogOptionsMenuRef}
      className={
        `meal-options-menu
        ${mealLogOptionsMenuOpen &&
        'meal-options-menu-open'}`
      }
      onClick={(e) => e.stopPropagation()}
    >
      {!selectingMealLogFoods && (
        <button
          className="meal-options-menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectingMealLogFoods(true);
            setMealLogOptionsMenuOpen(false);
          }}
        >
          <img className="button-link-image" src={checkBoxIcon} />
          Select items
        </button>
      )}

      <button
        className="meal-options-menu-button"
        onClick={(e) => {
          e.stopPropagation();

          if (!selectingMealLogFoods) {
            if (!currentMealLogDate) {
              return;
            }
            const dateKey = getDateKey(currentMealLogDate);
            if (!dateKey) {
              return;
            }
            const currentMealLogId = mealLogs[dateKey].id;
            const currentMealLogFoods = mealLogFoods[currentMealLogId];
            const mealLogFoodIds = currentMealLogFoods.map(
              (mealLogFood: MealLogFood) => mealLogFood.id
            );
            setSelectedMealLogFoodIds(mealLogFoodIds);
          }

          setCalendarOpenType('copyMealLogFoods');
          setMealLogOptionsMenuOpen(false);
        }}
      >
        <img className="button-link-image" src={copyIcon} />
        Copy to...
      </button>

      <button
        className="meal-options-menu-button"
        onClick={(e) => {
          e.stopPropagation();

          if (!selectingMealLogFoods) {
            if (!currentMealLogDate) {
              return;
            }
            const dateKey = getDateKey(currentMealLogDate);
            if (!dateKey) {
              return;
            }
            const currentMealLogId = mealLogs[dateKey].id;
            const currentMealLogFoods = mealLogFoods[currentMealLogId];
            const mealLogFoodIds = currentMealLogFoods.map(
              (mealLogFood: MealLogFood) => mealLogFood.id
            );
            setSelectedMealLogFoodIds(mealLogFoodIds);
          }

          setCalendarOpenType('moveMealLogFoods');
          setMealLogOptionsMenuOpen(false);
        }}
      >
        <img className="button-link-image" src={moveIcon} />
        Move to...
      </button>

      <button
        className="meal-options-menu-button meal-options-delete-button"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteMealLogFoods();
          setMealLogOptionsMenuOpen(false);
          setSelectedMealLogFoodIds([]);
          setSelectingMealLogFoods(false);
        }}
      >
        <img className="button-link-image" src={deleteIcon} />
        {selectingMealLogFoods ? 'Delete items': 'Delete meal log'}
      </button>
    </div>
  );
}
