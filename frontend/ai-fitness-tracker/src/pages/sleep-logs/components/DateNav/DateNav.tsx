import { type Value } from 'react-calendar/dist/shared/types.js';
import CalendarWindow from '../CalendarWindow/CalendarWindow';
import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import './DateNav.css';


type DateNavProps = {
  currentSleepLogDate: Value;
  today: Value;
  handleChangeDate: (direction: string) => Promise<void>;
  getDateLabel: (currentWorkoutLogDate: Value, today: Value) => string | undefined;
  calendarOpenType: string;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  calendarDate: Value;
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>;
  handleSetCalendarDate: (value: Value) => Promise<void>;
};


export default function DateNav({
  currentSleepLogDate,
  today,
  handleChangeDate,
  getDateLabel,
  calendarOpenType,
  setCalendarOpenType,
  calendarRef,
  calendarDate,
  setCalendarDate,
  handleSetCalendarDate,
}: DateNavProps) {
  return (
    <div className="date-nav-container">
      <nav className="date-nav">
        <button
          className="date-nav-button"
          onClick={() => {
            handleChangeDate('previous');
          }}
        >
          <img className="button-link-image" src={arrowLeftIcon} />
        </button>
        <button
          className="date-nav-button open-calendar-button"
          onClick={() => {
            if (currentSleepLogDate) {
              setCalendarDate(currentSleepLogDate);
            }
            setCalendarOpenType(prev => prev === 'changeWorkoutLog' ? '' : 'changeWorkoutLog');
          }}
        >
          {(currentSleepLogDate && today) ? getDateLabel(currentSleepLogDate, today) : ""}
        </button>
        <button
          className="date-nav-button"
          onClick={() => {
            handleChangeDate('next');
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
          currentSleepLogDate={currentSleepLogDate}
          handleSetCalendarDate={handleSetCalendarDate}
        />
      </nav>
    </div>
  );
}
