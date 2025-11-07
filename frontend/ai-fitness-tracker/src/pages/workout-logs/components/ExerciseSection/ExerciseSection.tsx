import {
  type WorkoutLog,
  type WorkoutLogExercise,
  type Exercise,
  type ExerciseSet
} from "../../types/workout-logs";
import type { Value } from "react-calendar/dist/shared/types.js";
import ExerciseSectionHeader from "../ExerciseSectionHeader/ExerciseSectionHeader";
import ExerciseSectionSets from "../ExerciseSectionSets/ExerciseSectionSets";
import './ExerciseSection.css';


type ExerciseSectionProps = {
  workoutLogExercise: WorkoutLogExercise;
  currentWorkoutLogDate: Value;
  workoutLogs: Record<string, WorkoutLog>;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
  exercises: Record<number, Exercise>;
  exerciseSets: Record<number, ExerciseSet[]>;
  exerciseOptionsMenuOpenName: string;
  setExerciseOptionsMenuOpenName: React.Dispatch<React.SetStateAction<string>>;
  selectedMealTypes: string[];
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedWorkoutLogExerciseIds: number[];
  setSelectedWorkoutLogExerciseIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectingWorkoutLogExercises: boolean;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>;
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  viewFoodMenuOpenId: number | null;
  exerciseOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  // handleDeleteMealLogFoods: () => Promise<void>;
};


export default function ExerciseSection({
  workoutLogExercise,
  currentWorkoutLogDate,
  workoutLogs,
  workoutLogExercises,
  exercises,
  exerciseSets,
  exerciseOptionsMenuOpenName,
  setExerciseOptionsMenuOpenName,
  selectedMealTypes,
  setAllItemsSelected,
  setSelectedMealTypes,
  selectedWorkoutLogExerciseIds,
  setSelectedWorkoutLogExerciseIds,
  selectingWorkoutLogExercises,
  setCalendarOpenType,
  exerciseOptionsMenuRefs,
  // handleDeleteMealLogFoods,
  // handleLoadFoodNutrients
}: ExerciseSectionProps) {
  return (
    <section className="exercise-section">
      <ExerciseSectionHeader
        workoutLogExercise={workoutLogExercise}
        exerciseOptionsMenuOpenName={exerciseOptionsMenuOpenName}
        setExerciseOptionsMenuOpenName={setExerciseOptionsMenuOpenName}
        exerciseOptionsMenuRefs={exerciseOptionsMenuRefs}
        workoutLogs={workoutLogs}
        workoutLogExercises={workoutLogExercises}
        exercises={exercises}
        currentWorkoutLogDate={currentWorkoutLogDate}
        setAllItemsSelected={setAllItemsSelected}
        selectedMealTypes={selectedMealTypes}
        setSelectedMealTypes={setSelectedMealTypes}
        selectedWorkoutLogExerciseIds={selectedWorkoutLogExerciseIds}
        setSelectedWorkoutLogExerciseIds={setSelectedWorkoutLogExerciseIds}
        selectingWorkoutLogExercises={selectingWorkoutLogExercises}
        setCalendarOpenType={setCalendarOpenType}
        // handleDeleteMealLogFoods={handleDeleteMealLogFoods}
      />

      <ExerciseSectionSets
        workoutLogExercise={workoutLogExercise}
        exerciseSets={exerciseSets}
      />
    </section>
  );
}
