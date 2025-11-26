import ExerciseOptionsMenu from "../ExerciseOptionsMenu/ExerciseOptionsMenu";
import {
  type WorkoutLog,
  type WorkoutLogExercise,
  type Exercise
} from '../../types/workout-logs';
import type { Value } from "react-calendar/dist/shared/types.js";
import { capitalizeFirstLetter } from "../../../../utils/app";
import dotsIcon from '../../../../assets/dots-icon.svg';
import boxIcon from '../../../../assets/box-icon.svg';
import checkBoxIcon from '../../../../assets/check-box-2-icon.svg';
import './ExerciseSectionHeader.css';


type ExerciseSectionHeaderProps = {
  workoutLogExercise: WorkoutLogExercise;
  exerciseOptionsMenuOpenId: number | null;
  setExerciseOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  exerciseOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  workoutLogs: Record<string, WorkoutLog>;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
  exercises: Record<number, Exercise>;
  currentWorkoutLogDate: Value;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  selectedWorkoutLogExerciseIds: number[];
  setSelectedWorkoutLogExerciseIds: React.Dispatch<React.SetStateAction<number[]>>;
  selectingWorkoutLogExercises: boolean;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteWorkoutLogExercises: (ids: number[]) => Promise<void>;
};


export default function ExerciseSectionHeader({
  workoutLogExercise,
  exerciseOptionsMenuOpenId,
  setExerciseOptionsMenuOpenId,
  exerciseOptionsMenuRefs,
  exercises,
  selectedWorkoutLogExerciseIds,
  setSelectedWorkoutLogExerciseIds,
  selectingWorkoutLogExercises,
  setCalendarOpenType,
  handleDeleteWorkoutLogExercises
}: ExerciseSectionHeaderProps) {
  const exerciseName = (
    workoutLogExercise &&
    exercises[workoutLogExercise.exercise_id] &&
    capitalizeFirstLetter(exercises[workoutLogExercise.exercise_id].name)
  );


  return (
    <div className='exercise-container'>
      <h3>
        {exerciseName}
      </h3>

      {selectingWorkoutLogExercises ? (
        <div className="check-box">
          {selectedWorkoutLogExerciseIds.includes(workoutLogExercise.id) ? (
            <img className="button-link-image" src={checkBoxIcon} />
          ) : (
            <img className="button-link-image" src={boxIcon} />
          )}
        </div>
      ) : (
        <button
          className="exercise-options-button"
          onClick={(e) => {
            e.stopPropagation();
            setExerciseOptionsMenuOpenId((prev) => (prev === workoutLogExercise.id ? null : workoutLogExercise.id));
          }}
        >
          <img className="button-link-image" src={dotsIcon} />
        </button>
      )}

      <ExerciseOptionsMenu
        workoutLogExercise={workoutLogExercise}
        exerciseOptionsMenuOpenId={exerciseOptionsMenuOpenId}
        setExerciseOptionsMenuOpenId={setExerciseOptionsMenuOpenId}
        exerciseOptionsMenuRefs={exerciseOptionsMenuRefs}
        selectedWorkoutLogExerciseIds={selectedWorkoutLogExerciseIds}
        setSelectedWorkoutLogExerciseIds={setSelectedWorkoutLogExerciseIds}
        setCalendarOpenType={setCalendarOpenType}
        handleDeleteWorkoutLogExercises={handleDeleteWorkoutLogExercises}
      />
    </div>
  );
}
