import { type Value } from 'react-calendar/dist/shared/types.js';
import CalendarWindow from '../../../../components/CalendarWindow/CalendarWindow';
import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import './DateNav.css';


type DateNavProps = {
  currentMealLogDate: string | null;
  today: string | null;
  handleChangeDate: (direction: string) => Promise<void>;
  getDateLabel: (currentMealLogDate: string | null, today: string | null) => string;
  calendarOpenType: string;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  calendarDate: Value;
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>;
  handleSetCalendarDate: (value: Value) => Promise<void>;
  handleCopyMealLogFoods: () => Promise<void>;
  handleMoveMealLogFoods: () => Promise<void>;
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
  handleSetCalendarDate,
  handleCopyMealLogFoods,
  handleMoveMealLogFoods
}: DateNavProps) {
  return (
    <div className="date-nav-container">
      <nav className="date-nav">
        <button
          className="date-nav-button"
          onClick={() => handleChangeDate('previous')}
        >
          <img className="button-link-image" src={arrowLeftIcon} />
        </button>
        <button
          className="date-nav-button open-calendar-button"
          onClick={() => setCalendarOpenType(prev => prev === 'changeMealLog' ? '' : 'changeMealLog')}
        >
          {(currentMealLogDate && today) ? getDateLabel(currentMealLogDate, today) : ""}
        </button>
        <button
          className="date-nav-button"
          onClick={() => handleChangeDate('next')}
        >
          <img className="button-link-image" src={arrowRightIcon} />
        </button>

        <CalendarWindow
          calendarOpenType={calendarOpenType}
          setCalendarOpenType={setCalendarOpenType}
          calendarRef={calendarRef}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          handleSetCalendarDate={handleSetCalendarDate}
          handleCopyMealLogFoods={handleCopyMealLogFoods}
          handleMoveMealLogFoods={handleMoveMealLogFoods}
        />
      </nav>
    </div>
  );
}
