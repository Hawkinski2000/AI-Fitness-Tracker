import MealOptionsMenu from "../MealOptionsMenu/MealOptionsMenu";
import { type MealLog, type MealLogFood } from '../../types/meal-logs';
import { capitalizeFirstLetter } from "../../../../utils/app";
import dotsIcon from '../../../../assets/dots-icon.svg';
import './MealSectionHeader.css';


type MealSectionHeaderProps = {
  mealType: string;
  mealOptionsMenuOpenType: string;
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  mealLogs: Record<string, MealLog>;
  mealLogFoods: Record<number, MealLogFood[]>;
  currentMealLogDate: string | null;
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
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
  setSelectedMealLogFoodIds,
  setCalendarOpenType,
  handleDeleteMeal
}: MealSectionHeaderProps) {
  return (
    <div className="meal-type-container">
      <h3 className="meal-type">
        {capitalizeFirstLetter(mealType)}
      </h3>

      <button
        className="meal-options-button"
        onClick={(e) => {
          e.stopPropagation();
          setMealOptionsMenuOpenType((prev) => (prev === mealType ? '' : mealType));
        }}
      >
        <img className="button-link-image" src={dotsIcon} />
      </button>

      <MealOptionsMenu
        mealType={mealType}
        mealOptionsMenuOpenType={mealOptionsMenuOpenType}
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
