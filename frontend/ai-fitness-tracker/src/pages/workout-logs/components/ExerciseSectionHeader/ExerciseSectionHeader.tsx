import { useCallback } from "react";
import MealOptionsMenu from "../MealOptionsMenu/MealOptionsMenu";
import {
  type WorkoutLog,
  type WorkoutLogExercise,
  type Exercise
} from '../../types/workout-logs';
import type { Value } from "react-calendar/dist/shared/types.js";
import { capitalizeFirstLetter } from "../../../../utils/app";
import { getDateKey } from '../../../../utils/dates';
import dotsIcon from '../../../../assets/dots-icon.svg';
import boxIcon from '../../../meal-logs/components/MealLogsPage/assets/box-icon.svg';
import checkBoxIcon from '../../../meal-logs/components/MealLogsPage/assets/check-box-2-icon.svg';
import './ExerciseSectionHeader.css';


type ExerciseSectionHeaderProps = {
  workoutLogExercise: WorkoutLogExercise;
  mealOptionsMenuOpenType: string;
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  workoutLogs: Record<string, WorkoutLog>;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
  exercises: Record<number, Exercise>;
  currentWorkoutLogDate: Value;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMealTypes: string[];
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMealLogFoodIds: number[];
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectingMealLogFoods: boolean;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteMealLogFoods: () => Promise<void>;
};


export default function ExerciseSectionHeader({
  workoutLogExercise,
  mealOptionsMenuOpenType,
  setMealOptionsMenuOpenType,
  mealOptionsMenuRefs,
  workoutLogs,
  workoutLogExercises,
  exercises,
  currentWorkoutLogDate,
  setAllItemsSelected,
  selectedMealTypes,
  setSelectedMealTypes,
  selectedMealLogFoodIds,
  setSelectedMealLogFoodIds,
  selectingMealLogFoods,
  setCalendarOpenType,
  handleDeleteMealLogFoods
}: ExerciseSectionHeaderProps) {
  const handleSelectMeal = useCallback(async () => {
    if (!currentWorkoutLogDate) {
        return;
    }
    const dateKey = getDateKey(currentWorkoutLogDate);
    if (!dateKey) {
      return;
    }
    const currentWorkoutLogId = workoutLogs[dateKey].id;
    const currentWorkoutLogExercises = workoutLogExercises[currentWorkoutLogId];
    const currentExercise = currentWorkoutLogExercises.map(
      (workoutLogExercise: WorkoutLogExercise) => exercises[workoutLogExercise.exercise_id]
    );
  }, [

  ]);
  return (
    <div
      className={`meal-type-container ${selectingMealLogFoods && 'selectable-meal-type-container'}`}
      onClick={() => handleSelectMeal()}
    >
      <h3>
        {workoutLogExercise && capitalizeFirstLetter(exercises[workoutLogExercise.exercise_id].name)}
      </h3>

      {/* <MealOptionsMenu
        mealType={mealType}
        mealOptionsMenuOpenType={mealOptionsMenuOpenType}
        setMealOptionsMenuOpenType={setMealOptionsMenuOpenType}
        mealOptionsMenuRefs={mealOptionsMenuRefs}
        mealLogs={mealLogs}
        mealLogFoods={mealLogFoods}
        currentMealLogDate={currentMealLogDate}
        setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
        setCalendarOpenType={setCalendarOpenType}
        handleDeleteMealLogFoods={handleDeleteMealLogFoods}
      /> */}
    </div>
  );
}
