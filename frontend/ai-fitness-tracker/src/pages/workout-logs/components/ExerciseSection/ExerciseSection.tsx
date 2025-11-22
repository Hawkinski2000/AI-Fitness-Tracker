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
  setExercisesMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  viewExerciseMenuOpenId: number | null;
  setViewExerciseMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  editingWorkoutLogExerciseId: number | null;
  setEditingWorkoutLogExerciseId: React.Dispatch<React.SetStateAction<number | null>>;
  exerciseOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  handleDeleteWorkoutLogExercises: (ids: number[]) => Promise<void>;
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
  setExercisesMenuOpen,
  viewExerciseMenuOpenId,
  setViewExerciseMenuOpenId,
  editingWorkoutLogExerciseId,
  setEditingWorkoutLogExerciseId,
  exerciseOptionsMenuRefs,
  handleDeleteWorkoutLogExercises,
}: ExerciseSectionProps) {
  return (
    <section
      className="exercise-section"
      onClick={(e) => {
        e.stopPropagation();

        if (viewExerciseMenuOpenId === workoutLogExercise.exercise_id) {
          setEditingWorkoutLogExerciseId(null);
          setExercisesMenuOpen(false);
          setViewExerciseMenuOpenId(null);
          return;
        }

        if (editingWorkoutLogExerciseId === workoutLogExercise.id) {
          setEditingWorkoutLogExerciseId(null);
          setExercisesMenuOpen(false);
          return;
        }

        setEditingWorkoutLogExerciseId(workoutLogExercise.id);
        setExercisesMenuOpen(true);
        setViewExerciseMenuOpenId(workoutLogExercise.exercise_id);
      }}
    >
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
        handleDeleteWorkoutLogExercises={handleDeleteWorkoutLogExercises}
      />

      <ExerciseSectionSets
        workoutLogExercise={workoutLogExercise}
        exerciseSets={exerciseSets}
      />
    </section>
  );
}
