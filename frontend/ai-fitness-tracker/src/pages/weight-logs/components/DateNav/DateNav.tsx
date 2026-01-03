import dayjs from "dayjs";
import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import plusIcon from '../../../../assets/plus-icon.svg';
import './DateNav.css';


type DateNavProps = {
  setEditMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  setAddingWeight: React.Dispatch<React.SetStateAction<boolean>>;
  setDateRangeOffset: React.Dispatch<React.SetStateAction<number>>;
  earliestDate: dayjs.Dayjs | null;
  latestDate: dayjs.Dayjs | null;
};


export default function DateNav({
  setEditMenuOpenId,
  setAddingWeight,
  setDateRangeOffset,
  earliestDate,
  latestDate
}: DateNavProps) {
  return (
    <div className="date-nav-container">
      <nav className="date-nav">
        <button
          className="date-nav-button"
          onClick={() => setDateRangeOffset(prev => prev + 1)}
        >
          <img className="button-link-image" src={arrowLeftIcon} />
        </button>

        <p className="date-nav-text">
          {earliestDate?.format("MM/DD/YYYY")} - {latestDate?.format("MM/DD/YYYY")}
        </p>
        
        <button
          className="date-nav-button"
          onClick={() => setDateRangeOffset(prev => Math.max(prev - 1, 0))}
        >
          <img className="button-link-image" src={arrowRightIcon} />
        </button>
      </nav>
      
      <button
        className="weight-log-add-button"
        onClick={(e) => {
          e.stopPropagation();
          setEditMenuOpenId(null);
          setAddingWeight(prev => !prev);
        }}
      >
        <img className="button-link-image" src={plusIcon} />
      </button>
    </div>
  );
}
