import copyIcon from '../../../../assets/copy-icon.svg';
import moveIcon from '../../../../assets/move-icon.svg';
import deleteIcon from '../../../../assets/delete-icon.svg';


type MealOptionsMenuProps = {
  mealType: string;
  mealOptionsMenuOpenType: string;
  mealOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  handleCopyMeal: (mealType: string, targetMealLogId: number) => Promise<void>;
  handleDeleteMeal: (mealType: string) => Promise<void>;
};


export default function MealOptionsMenu({
  mealType,
  mealOptionsMenuOpenType,
  mealOptionsMenuRefs,
  handleCopyMeal,
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
          const tomorrowMealLogId = 28;
          handleCopyMeal(mealType, tomorrowMealLogId);
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
  );
}
