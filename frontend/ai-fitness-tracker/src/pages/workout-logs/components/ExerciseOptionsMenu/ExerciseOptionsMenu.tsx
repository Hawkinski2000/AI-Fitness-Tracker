import { type WorkoutLogExercise } from '../../types/workout-logs';
import copyIcon from '../../../../assets/copy-icon.svg';
import moveIcon from '../../../../assets/move-icon.svg';
import deleteIcon from '../../../../assets/delete-icon.svg';
import './ExerciseOptionsMenu.css';


type ExerciseOptionsMenuProps = {
  workoutLogExercise: WorkoutLogExercise;
  exerciseOptionsMenuOpenId: number | null;
  setExerciseOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  exerciseOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  selectedWorkoutLogExerciseIds: number[];
  setSelectedWorkoutLogExerciseIds: React.Dispatch<React.SetStateAction<number[]>>;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteWorkoutLogExercises: (ids: number[]) => Promise<void>;
};


export default function ExerciseOptionsMenu({
  workoutLogExercise,
  exerciseOptionsMenuOpenId,
  setExerciseOptionsMenuOpenId,
  exerciseOptionsMenuRefs,
  selectedWorkoutLogExerciseIds,
  setSelectedWorkoutLogExerciseIds,
  setCalendarOpenType,
  handleDeleteWorkoutLogExercises
}: ExerciseOptionsMenuProps) {
  return (
    <div
      ref={el => { exerciseOptionsMenuRefs.current[workoutLogExercise.id] = el }}
      className={
        `exercise-options-menu
        ${exerciseOptionsMenuOpenId === workoutLogExercise.id &&
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
          setExerciseOptionsMenuOpenId(null);
        }}
      >
        <img className="button-link-image" src={copyIcon} />
        Copy to...
      </button>

      <button
        className="exercise-options-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedWorkoutLogExerciseIds(prev => [...prev, workoutLogExercise.id]);
          setCalendarOpenType('moveWorkoutLogExercises');
          setExerciseOptionsMenuOpenId(null);
        }}
      >
        <img className="button-link-image" src={moveIcon} />
        Move to...
      </button>

      <button
        className="exercise-options-menu-button exercise-options-delete-button"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteWorkoutLogExercises(
            [...selectedWorkoutLogExerciseIds, workoutLogExercise.id]
          );
          setExerciseOptionsMenuOpenId(null);
        }}
      >
        <img className="button-link-image" src={deleteIcon} />
        Delete Exercise
      </button>
    </div>
  );
}
