import { type Value } from 'react-calendar/dist/shared/types.js';
import CalendarWindow from '../CalendarWindow/CalendarWindow';
import MealLogOptionsMenu from '../MealLogOptionsMenu/MealLogOptionsMenu';
import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import dotsIcon from '../../../../assets/dots-icon.svg';
import './DateNav.css';


type DateNavProps = {
  currentWorkoutLogDate: Value;
  today: Value;
  handleChangeDate: (direction: string) => Promise<void>;
  getDateLabel: (currentMealLogDate: Value, today: Value) => string | undefined;
  calendarOpenType: string;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  calendarDate: Value;
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>;
  mealLogOptionsMenuOpen: boolean;
  setMealLogOptionsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectingWorkoutLogExercises: boolean;
  setSelectingWorkoutLogExercises: React.Dispatch<React.SetStateAction<boolean>>;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedWorkoutLogExerciseIds: React.Dispatch<React.SetStateAction<number[]>>;
  // mealLogs: Record<string, MealLog>;
  // mealLogFoods: Record<number, MealLogFood[]>;
  // mealLogOptionsMenuRef: React.RefObject<HTMLDivElement | null>;
  handleSetCalendarDate: (value: Value) => Promise<void>;
  // handleCopyMealLogFoods: () => Promise<void>;
  // handleMoveMealLogFoods: () => Promise<void>;
  // handleDeleteMealLogFoods: () => Promise<void>;
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
  mealLogOptionsMenuOpen,
  setMealLogOptionsMenuOpen,
  selectingWorkoutLogExercises,
  setSelectingWorkoutLogExercises,
  setAllItemsSelected,
  setSelectedMealTypes,
  setSelectedWorkoutLogExerciseIds,
  // mealLogs,
  // mealLogFoods,
  // mealLogOptionsMenuRef,
  handleSetCalendarDate,
  // handleCopyMealLogFoods,
  // handleMoveMealLogFoods,
  // handleDeleteMealLogFoods
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
            setSelectedMealTypes([]);
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
            setCalendarOpenType(prev => prev === 'changeMealLog' ? '' : 'changeMealLog');
            setSelectingWorkoutLogExercises(false);
            setAllItemsSelected(false);
            setSelectedMealTypes([]);
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
            setSelectedMealTypes([]);
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
          setSelectedMealTypes={setSelectedMealTypes}
          setSelectedWorkoutLogExerciseIds={setSelectedWorkoutLogExerciseIds}
          handleSetCalendarDate={handleSetCalendarDate}
          // handleCopyMealLogFoods={handleCopyMealLogFoods}
          // handleMoveMealLogFoods={handleMoveMealLogFoods}
        />
      </nav>

      <button
        className="meal-log-options-button"
        onClick={(e) => {
          e.stopPropagation();
          setMealLogOptionsMenuOpen(prev => !prev);
        }}
      >
        <img className="button-link-image" src={dotsIcon} />
      </button>

      {/* <MealLogOptionsMenu
        mealLogOptionsMenuOpen={mealLogOptionsMenuOpen}
        setMealLogOptionsMenuOpen={setMealLogOptionsMenuOpen}
        selectingMealLogFoods={selectingMealLogFoods}
        setSelectingMealLogFoods={setSelectingMealLogFoods}
        mealLogs={mealLogs}
        mealLogFoods={mealLogFoods}
        currentMealLogDate={currentMealLogDate}
        setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
        setCalendarOpenType={setCalendarOpenType}
        mealLogOptionsMenuRef={mealLogOptionsMenuRef}
        handleDeleteMealLogFoods={handleDeleteMealLogFoods}
      /> */}
    </div>
  );
}
