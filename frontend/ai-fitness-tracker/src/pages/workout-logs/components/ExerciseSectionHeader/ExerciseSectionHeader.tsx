import { useCallback } from "react";
import ExerciseOptionsMenu from "../ExerciseOptionsMenu/ExerciseOptionsMenu";
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
  exerciseOptionsMenuOpenName: string;
  setExerciseOptionsMenuOpenName: React.Dispatch<React.SetStateAction<string>>;
  exerciseOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  workoutLogs: Record<string, WorkoutLog>;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
  exercises: Record<number, Exercise>;
  currentWorkoutLogDate: Value;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMealTypes: string[];
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedWorkoutLogExerciseIds: number[];
  setSelectedWorkoutLogExerciseIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectingWorkoutLogExercises: boolean;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteWorkoutLogExercises: (ids: number[]) => Promise<void>;
};


export default function ExerciseSectionHeader({
  workoutLogExercise,
  exerciseOptionsMenuOpenName,
  setExerciseOptionsMenuOpenName,
  exerciseOptionsMenuRefs,
  workoutLogs,
  workoutLogExercises,
  exercises,
  currentWorkoutLogDate,
  setAllItemsSelected,
  selectedWorkoutLogExerciseIds,
  setSelectedWorkoutLogExerciseIds,
  selectingWorkoutLogExercises,
  setCalendarOpenType,
  handleDeleteWorkoutLogExercises
}: ExerciseSectionHeaderProps) {
  const exerciseName = workoutLogExercise && capitalizeFirstLetter(exercises[workoutLogExercise.exercise_id].name);

  // const handleSelectExercise = useCallback(async () => {
  //   if (!currentWorkoutLogDate) {
  //       return;
  //   }
  //   const dateKey = getDateKey(currentWorkoutLogDate);
  //   if (!dateKey) {
  //     return;
  //   }
  //   const currentWorkoutLogId = workoutLogs[dateKey].id;

  // }, [

  // ]);
  return (
    <div
      className={`exercise-container ${selectingWorkoutLogExercises && 'selectable-exercise-container'}`}
      // onClick={() => handleSelectExercise()}
    >
      <h3>
        {exerciseName}
      </h3>

      <button
        className="exercise-options-button"
        onClick={(e) => {
          e.stopPropagation();
          setExerciseOptionsMenuOpenName((prev) => (prev === exerciseName ? '' : exerciseName));
        }}
      >
        <img className="button-link-image" src={dotsIcon} />
      </button>

      <ExerciseOptionsMenu
        workoutLogExercise={workoutLogExercise}
        exerciseName={exerciseName}
        exerciseOptionsMenuOpenName={exerciseOptionsMenuOpenName}
        setExerciseOptionsMenuOpenName={setExerciseOptionsMenuOpenName}
        exerciseOptionsMenuRefs={exerciseOptionsMenuRefs}
        selectedWorkoutLogExerciseIds={selectedWorkoutLogExerciseIds}
        setSelectedWorkoutLogExerciseIds={setSelectedWorkoutLogExerciseIds}
        setCalendarOpenType={setCalendarOpenType}
        handleDeleteWorkoutLogExercises={handleDeleteWorkoutLogExercises}
      />
    </div>
  );
}
