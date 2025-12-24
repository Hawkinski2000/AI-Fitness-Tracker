import dayjs from "dayjs";
import { type WeightLog } from "../../types/weight-logs";
import dotsIcon from '../../../../assets/dots-icon.svg';


type WeightLogEntryProps = {
  weightLog: WeightLog
};


export default function WeightLogEntry({
  weightLog
}: WeightLogEntryProps) {  
  return (
    <div className="weight-log">
      <div className="weight-log-content">
        <div className="weight-log-section">
          <p className="weight-log-text">{dayjs(weightLog.log_date).format("MM/DD/YYYY")}</p>
          <p className="weight-log-weight-text">
            {weightLog.weight}{' '}
            {weightLog.unit}
          </p>
        </div>

        <div className="weight-log-section">
          <div className="weight-log-options-button-container">
            <button className="weight-log-options-button">
              <img className="button-link-image" src={dotsIcon} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
