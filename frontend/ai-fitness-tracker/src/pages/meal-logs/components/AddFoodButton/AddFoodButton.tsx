import './AddFoodButton.css';


type AddFoodButtonProps = {
  mealType: string;
  setFoodSearch: React.Dispatch<React.SetStateAction<string>>;
  setFoodMenuInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  editingMealLogFoodId: number | null;
  setEditingMealLogFoodId: React.Dispatch<React.SetStateAction<number | null>>;
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>;
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
};


export default function AddFoodButton({
  mealType,
  setFoodSearch,
  setFoodMenuInputFocused,
  editingMealLogFoodId,
  setEditingMealLogFoodId,
  setFoodsMenuOpenMealType,
  setViewFoodMenuOpenId
}: AddFoodButtonProps) {
  return (
    <button
      className="add-food-button"
      onClick={(e) => {
        e.stopPropagation();
        setFoodSearch('');
        setFoodMenuInputFocused(false);
        if (!editingMealLogFoodId) {
          setFoodsMenuOpenMealType((prev) => (prev === mealType ? '' : mealType));
        }
        else {
          setEditingMealLogFoodId(null);
          setViewFoodMenuOpenId(null);
          setFoodsMenuOpenMealType(mealType);
        }
      }}
    >
      Add Food
    </button>
  );
}
