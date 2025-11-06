import {
  type WorkoutLogExercise,
  type ExerciseSet,
  type Exercise
} from "../../types/workout-logs";
import type { Value } from "react-calendar/dist/shared/types.js";
import ExerciseSectionSet from "../ExerciseSectionSet/ExerciseSectionSet";


type ExerciseSectionSetsProps = {
  workoutLogExercise: WorkoutLogExercise;
  currentWorkoutLogDate: Value;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
  exercises: Record<number, Exercise>;
  exerciseSets: Record<number, ExerciseSet[]>
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>;
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  viewFoodMenuOpenId: number | null;
  setExerciseOptionsMenuOpenName: React.Dispatch<React.SetStateAction<string>>;
  mealFoodOptionsMenuOpenId: number | null;
  setMealFoodOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMealLogFoodIds: number[];
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectingWorkoutLogExercises: boolean;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  editingMealLogFoodId: number | null;
  setEditingMealLogFoodId: React.Dispatch<React.SetStateAction<number | null>>;
  setNumServings: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSize: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSizeUnit: React.Dispatch<React.SetStateAction<string>>;
  mealFoodOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  // handleLoadFoodNutrients: (foodId: number) => Promise<void>;
  // handleDeleteMealLogFoods: (mealLogFoodId: number) => Promise<void>;
}


export default function ExerciseSectionSets({
  workoutLogExercise,
  currentWorkoutLogDate,
  workoutLogExercises,
  exercises,
  exerciseSets,
  setFoodsMenuOpenMealType,
  setViewFoodMenuOpenId,
  viewFoodMenuOpenId,
  setExerciseOptionsMenuOpenName,
  mealFoodOptionsMenuOpenId,
  setMealFoodOptionsMenuOpenId,
  setAllItemsSelected,
  setSelectedMealTypes,
  selectedMealLogFoodIds,
  setSelectedMealLogFoodIds,
  selectingWorkoutLogExercises,
  setCalendarOpenType,
  editingMealLogFoodId,
  setEditingMealLogFoodId,
  setNumServings,
  setServingSize,
  setServingSizeUnit,
  mealFoodOptionsMenuRefs,
  // handleLoadFoodNutrients,
  // handleDeleteMealLogFoods
}: ExerciseSectionSetsProps) {
  return (
    <>
      {
        workoutLogExercise.id &&
        exerciseSets &&
        exerciseSets[workoutLogExercise.id]
          .map((exerciseSet: ExerciseSet) => {
            return (
              <ExerciseSectionSet
                key={exerciseSet.id}
                exerciseSet={exerciseSet}
              />
            )
          })
      }
    </>
  );
}
