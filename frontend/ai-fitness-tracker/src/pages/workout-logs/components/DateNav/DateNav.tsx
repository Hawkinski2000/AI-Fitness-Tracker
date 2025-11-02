import { type MealLog, type MealLogFood } from '../../types/workout-logs';
import { type Value } from 'react-calendar/dist/shared/types.js';
import CalendarWindow from '../../../../components/CalendarWindow/CalendarWindow';
import MealLogOptionsMenu from '../MealLogOptionsMenu/MealLogOptionsMenu';
import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import dotsIcon from '../../../../assets/dots-icon.svg';
import './DateNav.css';


type DateNavProps = {
  currentMealLogDate: Value;
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
  selectingMealLogFoods: boolean;
  setSelectingMealLogFoods: React.Dispatch<React.SetStateAction<boolean>>;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  mealLogs: Record<string, MealLog>;
  mealLogFoods: Record<number, MealLogFood[]>;
  mealLogOptionsMenuRef: React.RefObject<HTMLDivElement | null>;
  handleSetCalendarDate: (value: Value) => Promise<void>;
  handleCopyMealLogFoods: () => Promise<void>;
  handleMoveMealLogFoods: () => Promise<void>;
  handleDeleteMealLogFoods: () => Promise<void>;
};


export default function DateNav({
  currentMealLogDate,
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
  selectingMealLogFoods,
  setSelectingMealLogFoods,
  setAllItemsSelected,
  setSelectedMealTypes,
  setSelectedMealLogFoodIds,
  mealLogs,
  mealLogFoods,
  mealLogOptionsMenuRef,
  handleSetCalendarDate,
  handleCopyMealLogFoods,
  handleMoveMealLogFoods,
  handleDeleteMealLogFoods
}: DateNavProps) {
  return (
    <div className="date-nav-container">
      <nav className="date-nav">
        <button
          className="date-nav-button"
          onClick={() => {
            handleChangeDate('previous');
            setSelectingMealLogFoods(false);
            setAllItemsSelected(false);
            setSelectedMealTypes([]);
            setSelectedMealLogFoodIds([]);
          }}
        >
          <img className="button-link-image" src={arrowLeftIcon} />
        </button>
        <button
          className="date-nav-button open-calendar-button"
          onClick={() => {
            if (currentMealLogDate) {
              setCalendarDate(currentMealLogDate);
            }
            setCalendarOpenType(prev => prev === 'changeMealLog' ? '' : 'changeMealLog');
            setSelectingMealLogFoods(false);
            setAllItemsSelected(false);
            setSelectedMealTypes([]);
            setSelectedMealLogFoodIds([]);
          }}
        >
          {(currentMealLogDate && today) ? getDateLabel(currentMealLogDate, today) : ""}
        </button>
        <button
          className="date-nav-button"
          onClick={() => {
            handleChangeDate('next');
            setSelectingMealLogFoods(false);
            setAllItemsSelected(false);
            setSelectedMealTypes([]);
            setSelectedMealLogFoodIds([]);
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
          currentMealLogDate={currentMealLogDate}
          setSelectingMealLogFoods={setSelectingMealLogFoods}
          setSelectedMealTypes={setSelectedMealTypes}
          setSelectedMealLogFoodIds={setSelectedMealLogFoodIds}
          handleSetCalendarDate={handleSetCalendarDate}
          handleCopyMealLogFoods={handleCopyMealLogFoods}
          handleMoveMealLogFoods={handleMoveMealLogFoods}
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

      <MealLogOptionsMenu
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
      />
    </div>
  );
}
