import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import './DateNav.css';


type DateNavProps = {
  currentMealLogDate: string | null;
  today: string | null;
  handleChangeDate: (direction: string) => Promise<void>;
  getDateLabel: (currentMealLogDate: string | null, today: string | null) => string;
};


export default function DateNav({
  currentMealLogDate,
  today,
  handleChangeDate,
  getDateLabel
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
          className="date-nav-button"
        >
          {(currentMealLogDate && today) ? getDateLabel(currentMealLogDate, today) : ""}
        </button>
        <button
          className="date-nav-button"
          onClick={() => handleChangeDate('next')}
        >
          <img className="button-link-image" src={arrowRightIcon} />
        </button>
      </nav>
    </div>
  );
}
