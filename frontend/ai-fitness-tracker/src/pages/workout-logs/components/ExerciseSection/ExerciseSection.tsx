import {
  type WorkoutLog,
  type WorkoutLogExercise,
  type Exercise,
  type ExerciseSet
} from "../../types/workout-logs";
import type { Value } from "react-calendar/dist/shared/types.js";
import ExerciseSectionHeader from "../ExerciseSectionHeader/ExerciseSectionHeader";
import MealSectionFoods from "../MealSectionFoods/MealSectionFoods";
import './ExerciseSection.css';


type ExerciseSectionProps = {
  workoutLogExercise: WorkoutLogExercise;
  currentWorkoutLogDate: Value;
  workoutLogs: Record<string, WorkoutLog>;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
  exercises: Record<number, Exercise>;
  exerciseSets: Record<number, ExerciseSet[]>;
  mealOptionsMenuOpenType: string;
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  mealFoodOptionsMenuOpenId: number | null;
  setMealFoodOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedMealTypes: string[];
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMealLogFoodIds: number[];
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectingMealLogFoods: boolean;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  editingMealLogFoodId: number | null;
  setEditingMealLogFoodId: React.Dispatch<React.SetStateAction<number | null>>;
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>;
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  viewFoodMenuOpenId: number | null;
  setNumServings: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSize: React.Dispatch<React.SetStateAction<number | null>>;
  setServingSizeUnit: React.Dispatch<React.SetStateAction<string>>;
  mealOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  mealFoodOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  // handleDeleteMealLogFoods: () => Promise<void>;
  // handleLoadFoodNutrients: (foodId: number) => Promise<void>;
};


export default function ExerciseSection({
  workoutLogExercise,
  currentWorkoutLogDate,
  workoutLogs,
  workoutLogExercises,
  exercises,
  exerciseSets,
  mealOptionsMenuOpenType,
  setMealOptionsMenuOpenType,
  mealFoodOptionsMenuOpenId,
  setMealFoodOptionsMenuOpenId,
  selectedMealTypes,
  setAllItemsSelected,
  setSelectedMealTypes,
  selectedMealLogFoodIds,
  setSelectedMealLogFoodIds,
  selectingMealLogFoods,
  setCalendarOpenType,
  editingMealLogFoodId,
  setEditingMealLogFoodId,
  setFoodsMenuOpenMealType,
  setViewFoodMenuOpenId,
  viewFoodMenuOpenId,
  setNumServings,
  setServingSize,
  setServingSizeUnit,
  mealOptionsMenuRefs,
  mealFoodOptionsMenuRefs,
  // handleDeleteMealLogFoods,
  // handleLoadFoodNutrients
}: ExerciseSectionProps) {
  return (
    <section className="meal-section">
      <ExerciseSectionHeader
        workoutLogExercise={workoutLogExercise}
        mealOptionsMenuOpenType={mealOptionsMenuOpenType}
        setMealOptionsMenuOpenType={setMealOptionsMenuOpenType}
        mealOptionsMenuRefs={mealOptionsMenuRefs}
        workoutLogs={workoutLogs}
        workoutLogExercises={workoutLogExercises}
        exercises={exercises}
        currentWorkoutLogDate={currentWorkoutLogDate}
        setAllItemsSelected={setAllItemsSelected}
        selectedMealTypes={selectedMealTypes}
        setSelectedMealTypes={setSelectedMealTypes}
        selectedMealLogFoodIds={selectedMealLogFoodIds}
        setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
        selectingMealLogFoods={selectingMealLogFoods}
        setCalendarOpenType={setCalendarOpenType}
        // handleDeleteMealLogFoods={handleDeleteMealLogFoods}
      />

      {/* <MealSectionFoods
        currentMealLogDate={currentMealLogDate}
        mealLogs={mealLogs}
        mealLogFoods={mealLogFoods}
        foods={foods}
        brandedFoods={brandedFoods}
        foodNutrients={foodNutrients}
        setFoodsMenuOpenMealType={setFoodsMenuOpenMealType}
        viewFoodMenuOpenId={viewFoodMenuOpenId}
        setViewFoodMenuOpenId={setViewFoodMenuOpenId}
        setMealOptionsMenuOpenType={setMealOptionsMenuOpenType}
        mealFoodOptionsMenuOpenId={mealFoodOptionsMenuOpenId}
        setMealFoodOptionsMenuOpenId={setMealFoodOptionsMenuOpenId}
        setAllItemsSelected={setAllItemsSelected}
        setSelectedMealTypes={setSelectedMealTypes}
        selectedMealLogFoodIds={selectedMealLogFoodIds}
        setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
        selectingMealLogFoods={selectingMealLogFoods}
        setCalendarOpenType={setCalendarOpenType}
        editingMealLogFoodId={editingMealLogFoodId}
        setEditingMealLogFoodId={setEditingMealLogFoodId}
        setNumServings={setNumServings}
        setServingSize={setServingSize}
        setServingSizeUnit={setServingSizeUnit}
        mealFoodOptionsMenuRefs={mealFoodOptionsMenuRefs}
        handleLoadFoodNutrients={handleLoadFoodNutrients}
        handleDeleteMealLogFoods={handleDeleteMealLogFoods}
      /> */}
    </section>
  );
}
