import { type WorkoutLogExercise } from '../../types/workout-logs';
import type { Value } from 'react-calendar/dist/shared/types.js';
import copyIcon from '../../../../assets/copy-icon.svg';
import moveIcon from '../../../../assets/move-icon.svg';
import deleteIcon from '../../../../assets/delete-icon.svg';
import './ExerciseOptionsMenu.css';


type ExerciseOptionsMenuProps = {
  workoutLogExercise: WorkoutLogExercise;
  exerciseName: string;
  exerciseOptionsMenuOpenName: string;
  setExerciseOptionsMenuOpenName: React.Dispatch<React.SetStateAction<string>>;
  exerciseOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  setSelectedWorkoutLogExerciseIds: React.Dispatch<React.SetStateAction<number[]>>;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  // handleDeleteMealLogFoods: 
};


export default function ExerciseOptionsMenu({
  workoutLogExercise,
  exerciseName,
  exerciseOptionsMenuOpenName,
  setExerciseOptionsMenuOpenName,
  exerciseOptionsMenuRefs,
  setSelectedWorkoutLogExerciseIds,
  setCalendarOpenType,
  // handleDeleteMealLogFoods
}: ExerciseOptionsMenuProps) {
  return (
    <div
      ref={el => { exerciseOptionsMenuRefs.current[exerciseName] = el }}
      className={
        `exercise-options-menu
        ${exerciseOptionsMenuOpenName === exerciseName &&
        'exercise-options-menu-open'}`
      }
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="exercise-options-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedWorkoutLogExerciseIds(prev => [...prev, workoutLogExercise.id]);
          setCalendarOpenType('copyWorkoutLogExercises');
          setExerciseOptionsMenuOpenName('');
        }}
      >
        <img className="button-link-image" src={copyIcon} />
        Copy to...
      </button>

      <button
        className="exercise-options-menu-button"
        // onClick={(e) => {
        //   e.stopPropagation();
        //   if (!currentMealLogDate) {
        //     return;
        //   }
        //   const dateKey = getDateKey(currentMealLogDate);
        //   if (!dateKey) {
        //     return;
        //   }
        //   const currentMealLogId = mealLogs[dateKey].id;
        //   const currentMealLogFoods = mealLogFoods[currentMealLogId];
        //   const mealLogFoodsInMealType = currentMealLogFoods.filter(
        //     (mealLogFood: MealLogFood) => mealLogFood.meal_type === mealType
        //   );
        //   const mealLogFoodIdsInMealType = mealLogFoodsInMealType.map(
        //     (mealLogFood: MealLogFood) => mealLogFood.id
        //   );
        //   setSelectedMealLogFoodIds(mealLogFoodIdsInMealType);
        //   setCalendarOpenType('moveMealLogFoods');
        //   setMealOptionsMenuOpenType('');
        // }}
      >
        <img className="button-link-image" src={moveIcon} />
        Move to...
      </button>

      <button
        className="exercise-options-menu-button exercise-options-delete-button"
        // onClick={(e) => {
        //   e.stopPropagation();
        //   if (!currentMealLogDate) {
        //     return;
        //   }
        //   const dateKey = getDateKey(currentMealLogDate);
        //   if (!dateKey) {
        //     return;
        //   }
        //   const currentMealLogId = mealLogs[dateKey].id;
        //   const currentMealLogFoods = mealLogFoods[currentMealLogId];
        //   const mealLogFoodsInMealType = currentMealLogFoods.filter(
        //     (mealLogFood: MealLogFood) => mealLogFood.meal_type === mealType
        //   );
        //   const mealLogFoodIdsInMealType = mealLogFoodsInMealType.map(
        //     (mealLogFood: MealLogFood) => mealLogFood.id
        //   );
        //   setSelectedMealLogFoodIds(mealLogFoodIdsInMealType);
        //   handleDeleteMealLogFoods();
        //   setMealOptionsMenuOpenType('');
        // }}
      >
        <img className="button-link-image" src={deleteIcon} />
        Delete Exercise
      </button>
    </div>
  );
}
