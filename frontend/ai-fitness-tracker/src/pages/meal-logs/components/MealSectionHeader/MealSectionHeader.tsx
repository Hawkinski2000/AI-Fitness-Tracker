import { capitalizeFirstLetter } from "../../../../utils/app";
import dotsIcon from '../../../../assets/dots-icon.svg';
import copyIcon from '../../../../assets/copy-icon.svg';
import moveIcon from '../../../../assets/move-icon.svg';
import deleteIcon from '../../../../assets/delete-icon.svg';


type MealSectionHeaderProps = {
  mealType: string;
  mealOptionsMenuOpenType: string;
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  handleDeleteMeal: (mealType: string) => Promise<void>;
};


export default function MealSectionHeader({
  mealType,
  mealOptionsMenuOpenType,
  setMealOptionsMenuOpenType,
  mealOptionsMenuRefs,
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

  {/* ---------------------------------------------------------------------- */}
  {/* ---- Meal Section Header Options Menu ---- */}

      <div
        ref={el => { mealOptionsMenuRefs.current[mealType] = el }}
        className={`meal-options-menu ${mealOptionsMenuOpenType === mealType && 'meal-options-menu-open'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="meal-options-menu-button"
          onClick={(e) => {
            e.stopPropagation();
            // handleCopyMeal(mealType, ...);
          }}
        >
          <img className="button-link-image" src={copyIcon} />
          Copy to...
        </button>

        <button
          className="meal-options-menu-button"
          onClick={(e) => {
            e.stopPropagation();
            // handleMoveMeal(mealType, ...);
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
    </div>
  );
}
