import { type MealLogFood } from "../../types/meal-logs";
import copyIcon from '../../../../assets/copy-icon.svg';
import moveIcon from '../../../../assets/move-icon.svg';
import deleteIcon from '../../../../assets/delete-icon.svg';
import './MealFoodOptionsMenu.css';


type MealFoodOptionsMenuProps = {
  mealLogFood: MealLogFood;
  mealFoodOptionsMenuOpenId: number | null;
  setMealFoodOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealFoodOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  handleDeleteMealLogFood: (mealLogFoodId: number) => Promise<void>;
};


export default function MealFoodOptionsMenu({
  mealLogFood,
  mealFoodOptionsMenuOpenId,
  setMealFoodOptionsMenuOpenId,
  setSelectedMealLogFoodIds,
  setCalendarOpenType,
  mealFoodOptionsMenuRefs,
  handleDeleteMealLogFood
}: MealFoodOptionsMenuProps) {
  return (
    <div
      ref={el => { mealFoodOptionsMenuRefs.current[mealLogFood.id] = el }}
      className={
        `meal-options-menu
        meal-log-food-options-menu
        ${mealFoodOptionsMenuOpenId === mealLogFood.id && 'meal-options-menu-open'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="meal-options-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedMealLogFoodIds([mealLogFood.id]);
          setCalendarOpenType('copyMealLogFoods');
          setMealFoodOptionsMenuOpenId(null);
        }}
      >
        <img className="button-link-image" src={copyIcon} />
        Copy to...
      </button>

      <button
        className="meal-options-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedMealLogFoodIds([mealLogFood.id]);
          setCalendarOpenType('moveMealLogFoods');
          setMealFoodOptionsMenuOpenId(null);
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
          setMealFoodOptionsMenuOpenId(null);
        }}
      >
        <img className="button-link-image" src={deleteIcon} />
        Delete Entry
      </button>
    </div>
  );
}
