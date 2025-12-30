import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import plusIcon from '../../../../assets/plus-icon.svg';
import './DateNav.css';


type DateNavProps = {
  setEditMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  setAddingWeight: React.Dispatch<React.SetStateAction<boolean>>;
};


export default function DateNav({
  setEditMenuOpenId,
  setAddingWeight
}: DateNavProps) {
  return (
    <div className="date-nav-container">
      <nav className="date-nav">
        <button
          className="date-nav-button"
        >
          <img className="button-link-image" src={arrowLeftIcon} />
        </button>
        <button
          className="date-nav-button open-calendar-button"
        >
        </button>
        <button
          className="date-nav-button"
        >
          <img className="button-link-image" src={arrowRightIcon} />
        </button>
      </nav>
      
      <button
        className="weight-log-add-button"
        onClick={(e) => {
          e.stopPropagation();
          setEditMenuOpenId(null);
          setAddingWeight(true);
        }}
      >
        <img className="button-link-image" src={plusIcon} />
      </button>
    </div>
  );
}
