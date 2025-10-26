import MealOptionsMenu from "../MealOptionsMenu/MealOptionsMenu";
import { capitalizeFirstLetter } from "../../../../utils/app";
import dotsIcon from '../../../../assets/dots-icon.svg';
import './MealSectionHeader.css';


type MealSectionHeaderProps = {
  mealType: string;
  mealOptionsMenuOpenType: string;
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  handleCopyMeal: (mealType: string, targetMealLogId: number) => Promise<void>;
  handleMoveMeal: (mealType: string, targetMealLogId: number) => Promise<void>;
  handleDeleteMeal: (mealType: string) => Promise<void>;
};


export default function MealSectionHeader({
  mealType,
  mealOptionsMenuOpenType,
  setMealOptionsMenuOpenType,
  mealOptionsMenuRefs,
  handleCopyMeal,
  handleMoveMeal,
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
        handleCopyMeal={handleCopyMeal}
        handleMoveMeal={handleMoveMeal}
        handleDeleteMeal={handleDeleteMeal}
      />
    </div>
  );
}
