import {
  type WorkoutLog,
  type WorkoutLogExercise
} from "../../types/workout-logs";
import { type Value } from 'react-calendar/dist/shared/types.js';
import CalendarWindow from '../CalendarWindow/CalendarWindow';
import WorkoutLogOptionsMenu from '../WorkoutLogOptionsMenu/WorkoutLogOptionsMenu';
import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import dotsIcon from '../../../../assets/dots-icon.svg';
import plusIcon from '../../../../assets/plus-icon.svg';
import './DateNav.css';


type DateNavProps = {
  currentWorkoutLogDate: Value;
  today: Value;
  handleChangeDate: (direction: string) => Promise<void>;
  getDateLabel: (currentWorkoutLogDate: Value, today: Value) => string | undefined;
  calendarOpenType: string;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  calendarDate: Value;
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>;
  setExercisesMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  viewExerciseMenuOpenId: number | null;
  setViewExerciseMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingWorkoutLogExerciseId: React.Dispatch<React.SetStateAction<number | null>>;
  workoutLogOptionsMenuOpen: boolean;
  setWorkoutLogOptionsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectingWorkoutLogExercises: boolean;
  setSelectingWorkoutLogExercises: React.Dispatch<React.SetStateAction<boolean>>;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  selectedWorkoutLogExerciseIds: number[];
  setSelectedWorkoutLogExerciseIds: React.Dispatch<React.SetStateAction<number[]>>;
  workoutLogs: Record<string, WorkoutLog>;
  workoutLogExercises: Record<number, WorkoutLogExercise[]>;
  workoutLogOptionsMenuRef: React.RefObject<HTMLDivElement | null>;
  handleSetCalendarDate: (value: Value) => Promise<void>;
  handleCopyWorkoutLogExercises: () => Promise<void>;
  handleMoveWorkoutLogExercises: () => Promise<void>;
  handleDeleteWorkoutLogExercises: (ids: number[]) => Promise<void>;
};


export default function DateNav({
  currentWorkoutLogDate,
  today,
  handleChangeDate,
  getDateLabel,
  calendarOpenType,
  setCalendarOpenType,
  calendarRef,
  calendarDate,
  setCalendarDate,
  setExercisesMenuOpen,
  viewExerciseMenuOpenId,
  setViewExerciseMenuOpenId,
  setEditingWorkoutLogExerciseId,
  workoutLogOptionsMenuOpen,
  setWorkoutLogOptionsMenuOpen,
  selectingWorkoutLogExercises,
  setSelectingWorkoutLogExercises,
  setAllItemsSelected,
  selectedWorkoutLogExerciseIds,
  setSelectedWorkoutLogExerciseIds,
  workoutLogs,
  workoutLogExercises,
  workoutLogOptionsMenuRef,
  handleSetCalendarDate,
  handleCopyWorkoutLogExercises,
  handleMoveWorkoutLogExercises,
  handleDeleteWorkoutLogExercises
}: DateNavProps) {
  return (
    <div className="date-nav-container">
      <nav className="date-nav">
        <button
          className="date-nav-button"
          onClick={() => {
            handleChangeDate('previous');
            setSelectingWorkoutLogExercises(false);
            setAllItemsSelected(false);
            setSelectedWorkoutLogExerciseIds([]);
          }}
        >
          <img className="button-link-image" src={arrowLeftIcon} />
        </button>
        <button
          className="date-nav-button open-calendar-button"
          onClick={() => {
            if (currentWorkoutLogDate) {
              setCalendarDate(currentWorkoutLogDate);
            }
            setCalendarOpenType(prev => prev === 'changeWorkoutLog' ? '' : 'changeWorkoutLog');
            setSelectingWorkoutLogExercises(false);
            setAllItemsSelected(false);
            setSelectedWorkoutLogExerciseIds([]);
          }}
        >
          {(currentWorkoutLogDate && today) ? getDateLabel(currentWorkoutLogDate, today) : ""}
        </button>
        <button
          className="date-nav-button"
          onClick={() => {
            handleChangeDate('next');
            setSelectingWorkoutLogExercises(false);
            setAllItemsSelected(false);
            setSelectedWorkoutLogExerciseIds([]);
          }}
        >
          <img className="button-link-image" src={arrowRightIcon} />
        </button>

        <CalendarWindow
          calendarOpenType={calendarOpenType}
          setCalendarOpenType={setCalendarOpenType}
          calendarRef={calendarRef}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          currentWorkoutLogDate={currentWorkoutLogDate}
          setSelectingWorkoutLogExercises={setSelectingWorkoutLogExercises}
          setSelectedWorkoutLogExerciseIds={setSelectedWorkoutLogExerciseIds}
          setAllItemsSelected={setAllItemsSelected}
          handleSetCalendarDate={handleSetCalendarDate}
          handleCopyWorkoutLogExercises={handleCopyWorkoutLogExercises}
          handleMoveWorkoutLogExercises={handleMoveWorkoutLogExercises}
        />
      </nav>

      <button
        className="workout-log-add-button"
        onClick={(e) => {
          e.stopPropagation();
          setEditingWorkoutLogExerciseId(null);
          setViewExerciseMenuOpenId(null);
          if (!viewExerciseMenuOpenId) {
            setExercisesMenuOpen(prev => !prev);
          }
        }}
      >
        <img className="button-link-image" src={plusIcon} />
      </button>

      <button
        className="workout-log-options-button"
        onClick={(e) => {
          e.stopPropagation();
          setWorkoutLogOptionsMenuOpen(prev => !prev);
        }}
      >
        <img className="button-link-image" src={dotsIcon} />
      </button>

      <WorkoutLogOptionsMenu
        workoutLogOptionsMenuOpen={workoutLogOptionsMenuOpen}
        setWorkoutLogOptionsMenuOpen={setWorkoutLogOptionsMenuOpen}
        selectingWorkoutLogExercises={selectingWorkoutLogExercises}
        setSelectingWorkoutLogExercises={setSelectingWorkoutLogExercises}
        workoutLogs={workoutLogs}
        workoutLogExercises={workoutLogExercises}
        currentWorkoutLogDate={currentWorkoutLogDate}
        selectedWorkoutLogExerciseIds={selectedWorkoutLogExerciseIds}
        setSelectedWorkoutLogExerciseIds={setSelectedWorkoutLogExerciseIds}
        setCalendarOpenType={setCalendarOpenType}
        workoutLogOptionsMenuRef={workoutLogOptionsMenuRef}
        handleDeleteWorkoutLogExercises={handleDeleteWorkoutLogExercises}
      />
    </div>
  );
}
