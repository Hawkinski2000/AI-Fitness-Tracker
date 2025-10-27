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
  calendarOpen: boolean;
  setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  calendarDate: Value;
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>;
  handleSetCalendarDate: (value: Value) => Promise<void>;
};


export default function DateNav({
  currentMealLogDate,
  today,
  handleChangeDate,
  getDateLabel,
  calendarOpen,
  setCalendarOpen,
  calendarRef,
  calendarDate,
  setCalendarDate,
  handleSetCalendarDate
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
          onClick={() => setCalendarOpen(prev => !prev)}
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
          calendarOpen={calendarOpen}
          setCalendarOpen={setCalendarOpen}
          calendarRef={calendarRef}
          calendarDate={calendarDate}
          setCalendarDate={setCalendarDate}
          handleSetCalendarDate={handleSetCalendarDate}
        />
      </nav>
    </div>
  );
}
