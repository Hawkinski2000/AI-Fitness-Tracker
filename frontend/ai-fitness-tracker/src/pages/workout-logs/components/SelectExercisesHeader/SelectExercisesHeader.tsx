import { useCallback } from 'react';
import { type WorkoutLog, type WorkoutLogExercise } from '../../types/workout-logs';
import { type Value } from 'react-calendar/dist/shared/types.js';
import { getDateKey } from '../../../../utils/dates';
import closeIcon from '../../../../assets/close-icon.svg';
import boxIcon from '../../../../assets/box-icon.svg';
import checkBoxIcon from '../../../../assets/check-box-2-icon.svg';
import './SelectExercisesHeader.css';


type SelectExercisesHeaderProps = {
  allItemsSelected: boolean;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  selectingWorkoutLogExercises: boolean;
  setSelectingWorkoutLogExercises: React.Dispatch<React.SetStateAction<boolean>>;
  selectedWorkoutLogExerciseIds: number[];
  setSelectedWorkoutLogExerciseIds: React.Dispatch<React.SetStateAction<number[]>>;
  currentWorkoutLogDate: Value;
  workoutLogs: Record<string, WorkoutLog>;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
};


export default function SelectExercisesHeader({
  allItemsSelected,
  setAllItemsSelected,
  selectingWorkoutLogExercises,
  setSelectingWorkoutLogExercises,
  selectedWorkoutLogExerciseIds,
  setSelectedWorkoutLogExerciseIds,
  currentWorkoutLogDate,
  workoutLogs,
  workoutLogExercises
}: SelectExercisesHeaderProps) {
  const handleSelectAll = useCallback(async () => {
      if (allItemsSelected) {
        setSelectedWorkoutLogExerciseIds([]);
        return;
      }
    
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
    }, [
      allItemsSelected,
      currentWorkoutLogDate,
      workoutLogs,
      workoutLogExercises,
      setSelectedWorkoutLogExerciseIds
    ]);


  return (
    <header
      className={
        `select-exercises-header
        ${selectingWorkoutLogExercises && 'select-exercises-header-open'}`
      }
    >
      <div className='select-items-header-section'>
        <button
          className='select-items-header-close-button'
          onClick={() => {
            setSelectingWorkoutLogExercises(false);
            setAllItemsSelected(false);
            setSelectedWorkoutLogExerciseIds([]);
          }}
        >
          <img className="button-link-image" src={closeIcon} />
        </button>

        <p className='select-items-header-text'>
          {selectedWorkoutLogExerciseIds.length > 0
            ? `Selected ${selectedWorkoutLogExerciseIds.length}
              item${selectedWorkoutLogExerciseIds.length !== 1 ? 's' : ''}`
            : 'Select items'
          }
        </p>
      </div>

      <div className='select-items-header-section'>
        <div
          className="check-box select-all-check-box"
          onClick={() => {
            handleSelectAll();
            setAllItemsSelected(prev => !prev);
          }}
        >
          {allItemsSelected ? (
            <img className="button-link-image" src={checkBoxIcon} />
          ) : (
            <img className="button-link-image" src={boxIcon} />
          )}
        </div>
      </div>
    </header>
  );
}
