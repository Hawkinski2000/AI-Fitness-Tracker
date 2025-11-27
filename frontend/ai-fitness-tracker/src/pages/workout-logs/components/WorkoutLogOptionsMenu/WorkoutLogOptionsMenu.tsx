import { type WorkoutLog, type WorkoutLogExercise } from '../../types/workout-logs';
import type { Value } from 'react-calendar/dist/shared/types.js';
import { getDateKey } from '../../../../utils/dates';
import checkBoxIcon from '../../../../assets/check-box-icon.svg';
import copyIcon from '../../../../assets/copy-icon.svg';
import moveIcon from '../../../../assets/move-icon.svg';
import deleteIcon from '../../../../assets/delete-icon.svg';


type WorkoutLogOptionsMenuProps = {
  workoutLogOptionsMenuOpen: boolean;
  setWorkoutLogOptionsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectingWorkoutLogExercises: boolean;
  setSelectingWorkoutLogExercises: React.Dispatch<React.SetStateAction<boolean>>;
  workoutLogs: Record<string, WorkoutLog>;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
  currentWorkoutLogDate: Value;
  selectedWorkoutLogExerciseIds: number[];
  setSelectedWorkoutLogExerciseIds: React.Dispatch<React.SetStateAction<number[]>>;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  workoutLogOptionsMenuRef: React.RefObject<HTMLDivElement | null>;
  handleDeleteWorkoutLogExercises: (ids: number[]) => Promise<void>;
};


export default function WorkoutLogOptionsMenu({
  workoutLogOptionsMenuOpen,
  setWorkoutLogOptionsMenuOpen,
  selectingWorkoutLogExercises,
  setSelectingWorkoutLogExercises,
  workoutLogs,
  workoutLogExercises,
  currentWorkoutLogDate,
  selectedWorkoutLogExerciseIds,
  setSelectedWorkoutLogExerciseIds,
  setCalendarOpenType,
  workoutLogOptionsMenuRef,
  handleDeleteWorkoutLogExercises
}: WorkoutLogOptionsMenuProps) {
  return (
    <div
      ref={workoutLogOptionsMenuRef}
      className={
        `exercise-options-menu
        ${workoutLogOptionsMenuOpen &&
        'exercise-options-menu-open'}`
      }
      onClick={(e) => e.stopPropagation()}
    >
      {!selectingWorkoutLogExercises && (
        <button
          className="exercise-options-menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectingWorkoutLogExercises(true);
            setWorkoutLogOptionsMenuOpen(false);
          }}
        >
          <img className="button-link-image" src={checkBoxIcon} />
          Select items
        </button>
      )}

      <button
        className="exercise-options-menu-button"
        onClick={(e) => {
          e.stopPropagation();

          if (!selectingWorkoutLogExercises) {
            if (!currentWorkoutLogDate) {
              return;
            }
            const dateKey = getDateKey(currentWorkoutLogDate);
            if (!dateKey) {
              return;
            }
            const currentWorkoutLogId = workoutLogs[dateKey].id;
            const currentWorkoutLogExercises = workoutLogExercises[currentWorkoutLogId];
            const workoutLogExerciseIds = currentWorkoutLogExercises.map(
              (workoutLogExercise: WorkoutLogExercise) => workoutLogExercise.id
            );
            setSelectedWorkoutLogExerciseIds(workoutLogExerciseIds);
          }

          setCalendarOpenType('copyWorkoutLogExercises');
          setWorkoutLogOptionsMenuOpen(false);
        }}
      >
        <img className="button-link-image" src={copyIcon} />
        Copy to...
      </button>

      <button
        className="exercise-options-menu-button"
        onClick={(e) => {
          e.stopPropagation();

          if (!selectingWorkoutLogExercises) {
            if (!currentWorkoutLogDate) {
              return;
            }
            const dateKey = getDateKey(currentWorkoutLogDate);
            if (!dateKey) {
              return;
            }
            const currentWorkoutLogId = workoutLogs[dateKey].id;
            const currentWorkoutLogExercises = workoutLogExercises[currentWorkoutLogId];
            const workoutLogExerciseIds = currentWorkoutLogExercises.map(
              (workoutLogExercise: WorkoutLogExercise) => workoutLogExercise.id
            );
            setSelectedWorkoutLogExerciseIds(workoutLogExerciseIds);
          }

          setCalendarOpenType('moveWorkoutLogExercises');
          setWorkoutLogOptionsMenuOpen(false);
        }}
      >
        <img className="button-link-image" src={moveIcon} />
        Move to...
      </button>

      <button
        className="exercise-options-menu-button exercise-options-delete-button"
        onClick={(e) => {
          e.stopPropagation();

          if (!selectingWorkoutLogExercises) {
            if (!currentWorkoutLogDate) {
              return;
            }
            const dateKey = getDateKey(currentWorkoutLogDate);
            if (!dateKey) {
              return;
            }
            const currentWorkoutLogId = workoutLogs[dateKey].id;
            const currentWorkoutLogExercises = workoutLogExercises[currentWorkoutLogId];
            const workoutLogExerciseIds = currentWorkoutLogExercises.map(
              (workoutLogExercise: WorkoutLogExercise) => workoutLogExercise.id
            );
            handleDeleteWorkoutLogExercises(workoutLogExerciseIds);
          } else {
            handleDeleteWorkoutLogExercises(selectedWorkoutLogExerciseIds);
            setSelectedWorkoutLogExerciseIds([]);
            setSelectingWorkoutLogExercises(false);
          }
          
          setWorkoutLogOptionsMenuOpen(false);
        }}
      >
        <img className="button-link-image" src={deleteIcon} />
        {selectingWorkoutLogExercises ? 'Delete items': 'Delete workout log'}
      </button>
    </div>
  );
}
