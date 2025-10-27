import Calendar from 'react-calendar';
import { type Value } from 'react-calendar/dist/shared/types.js';
import arrowLeftIcon from '../../assets/arrow-left-icon.svg'
import arrowRightIcon from '../../assets/arrow-right-icon.svg';
import doubleArrowLeftIcon from './assets/double-arrow-left-icon.svg'
import doubleArrowRightIcon from './assets/double-arrow-right-icon.svg';
import 'react-calendar/dist/Calendar.css';
import './CalendarWindow.css';


type CalendarWindowProps = {
  calendarOpen: boolean;
  setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  calendarDate: Value;
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>;
  handleSetCalendarDate: (value: Value) => Promise<void>;
};


export default function CalendarWindow({
  calendarOpen,
  setCalendarOpen,
  calendarRef,
  calendarDate,
  setCalendarDate,
  handleSetCalendarDate
}: CalendarWindowProps) {  
  return (
    <div ref={calendarRef} className={`calendar ${calendarOpen && 'calendar-open'}`}>
      <Calendar
        onChange={(value) => {
          setCalendarDate(value);
        }}
        value={calendarDate}
        nextLabel={<img className="button-link-image" src={arrowRightIcon} />}
        next2Label={<img className="button-link-image" src={doubleArrowRightIcon} />}
        prevLabel={<img className="button-link-image" src={arrowLeftIcon} />}
        prev2Label={<img className="button-link-image" src={doubleArrowLeftIcon} />}
      />

      <nav className='calendar-confirmation-nav'>
        <button
          className='react-calendar__tile calendar-confirmation-nav-button'
          onClick={() => setCalendarOpen(false)}
        >
          Cancel
        </button>

        <button
          className='react-calendar__tile calendar-confirmation-nav-button'
          onClick={() => handleSetCalendarDate(calendarDate)}
        >
          Ok
        </button>
      </nav>
    </div>
  );
}
