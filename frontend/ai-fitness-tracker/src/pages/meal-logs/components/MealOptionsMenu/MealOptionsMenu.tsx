import { type MealLog, type MealLogFood } from '../../types/meal-logs';
import copyIcon from '../../../../assets/copy-icon.svg';
import moveIcon from '../../../../assets/move-icon.svg';
import deleteIcon from '../../../../assets/delete-icon.svg';


type MealOptionsMenuProps = {
  mealType: string;
  mealOptionsMenuOpenType: string;
  mealOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  mealLogs: Record<string, MealLog>;
  mealLogFoods: Record<number, MealLogFood[]>;
  currentMealLogDate: string | null;
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteMeal: (mealType: string) => Promise<void>;
};


export default function MealOptionsMenu({
  mealType,
  mealOptionsMenuOpenType,
  mealOptionsMenuRefs,
  mealLogs,
  mealLogFoods,
  currentMealLogDate,
  setSelectedMealLogFoodIds,
  setCalendarOpenType,
  handleDeleteMeal
}: MealOptionsMenuProps) {
  return (
    <div
      ref={el => { mealOptionsMenuRefs.current[mealType] = el }}
      className={
        `meal-options-menu
        ${mealOptionsMenuOpenType === mealType &&
        'meal-options-menu-open'}`
      }
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="meal-options-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          if (!currentMealLogDate) {
            return;
          }
          const currentMealLogId = mealLogs[currentMealLogDate].id;
          const currentMealLogFoods = mealLogFoods[currentMealLogId];
          const mealLogFoodsInMealType = currentMealLogFoods.filter(
            (mealLogFood: MealLogFood) => mealLogFood.meal_type === mealType
          );
          const mealLogFoodIdsInMealType = mealLogFoodsInMealType.map(
            (mealLogFood: MealLogFood) => mealLogFood.id
          );
          setSelectedMealLogFoodIds(mealLogFoodIdsInMealType);
          setCalendarOpenType('copyMealLogFoods');
        }}
      >
        <img className="button-link-image" src={copyIcon} />
        Copy to...
      </button>

      <button
        className="meal-options-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          if (!currentMealLogDate) {
            return;
          }
          const currentMealLogId = mealLogs[currentMealLogDate].id;
          const currentMealLogFoods = mealLogFoods[currentMealLogId];
          const mealLogFoodsInMealType = currentMealLogFoods.filter(
            (mealLogFood: MealLogFood) => mealLogFood.meal_type === mealType
          );
          const mealLogFoodIdsInMealType = mealLogFoodsInMealType.map(
            (mealLogFood: MealLogFood) => mealLogFood.id
          );
          setSelectedMealLogFoodIds(mealLogFoodIdsInMealType);
          setCalendarOpenType('moveMealLogFoods');
        }}
      >
        <img className="button-link-image" src={moveIcon} />
        Move to...
      </button>

      <button
        className="meal-options-menu-button meal-options-delete-button"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteMeal(mealType);
        }}
      >
        <img className="button-link-image" src={deleteIcon} />
        Delete Meal
      </button>
    </div>
  );
}
