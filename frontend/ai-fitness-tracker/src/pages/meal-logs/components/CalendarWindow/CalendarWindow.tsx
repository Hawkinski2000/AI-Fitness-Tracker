import Calendar from 'react-calendar';
import { type Value } from 'react-calendar/dist/shared/types.js';
import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg'
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import doubleArrowLeftIcon from './assets/double-arrow-left-icon.svg'
import doubleArrowRightIcon from './assets/double-arrow-right-icon.svg';
import 'react-calendar/dist/Calendar.css';
import './CalendarWindow.css';


type CalendarWindowProps = {
  calendarOpenType: string;
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  calendarDate: Value;
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>;
  currentMealLogDate: Value;
  setSelectingMealLogFoods: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMealTypes: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedMealLogFoodIds: React.Dispatch<React.SetStateAction<number[]>>;
  setAllItemsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetCalendarDate: (value: Value) => Promise<void>;
  handleCopyMealLogFoods: () => Promise<void>;
  handleMoveMealLogFoods: () => Promise<void>;
};


export default function CalendarWindow({
  calendarOpenType,
  setCalendarOpenType,
  calendarRef,
  calendarDate,
  setCalendarDate,
  currentMealLogDate,
  setSelectingMealLogFoods,
  setSelectedMealTypes,
  setSelectedMealLogFoodIds,
  setAllItemsSelected,
  handleSetCalendarDate,
  handleCopyMealLogFoods,
  handleMoveMealLogFoods
}: CalendarWindowProps) {  
  return (
    <div ref={calendarRef} className={`calendar ${calendarOpenType && 'calendar-open'}`}>
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
          onClick={() => {
            setCalendarOpenType('');
            if (currentMealLogDate) {
              setCalendarDate(currentMealLogDate);
            }

            setSelectingMealLogFoods(false);
            setSelectedMealTypes([]);
            setSelectedMealLogFoodIds([]);
            setAllItemsSelected(false);
          }}
        >
          Cancel
        </button>

        <button
          className='react-calendar__tile calendar-confirmation-nav-button'
          onClick={() => {
            if (calendarOpenType === 'changeMealLog') {
              handleSetCalendarDate(calendarDate);
            } else if (calendarOpenType === 'copyMealLogFoods') {
              handleCopyMealLogFoods();
            } else if (calendarOpenType === 'moveMealLogFoods') {
              handleMoveMealLogFoods();
            }
            if (currentMealLogDate) {
              setCalendarDate(currentMealLogDate);
            }

            setSelectingMealLogFoods(false);
            setSelectedMealTypes([]);
            setSelectedMealLogFoodIds([]);
            setAllItemsSelected(false);
          }}
        >
          Ok
        </button>
      </nav>
    </div>
  );
}
