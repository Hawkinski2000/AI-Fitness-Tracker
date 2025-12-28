import arrowLeftIcon from '../../../../assets/arrow-left-icon.svg';
import arrowRightIcon from '../../../../assets/arrow-right-icon.svg';
import plusIcon from '../../../../assets/plus-icon.svg';
import './DateNav.css';


export default function DateNav() {
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
          // setEditMenuOpenId(null);
          // setAddingWeight(True);
        }}
      >
        <img className="button-link-image" src={plusIcon} />
      </button>
    </div>
  );
}
