import dayjs from "dayjs";
import { type WeightLog } from "../../types/weight-logs";
import WeightEntryOptionsMenu from "../WeightEntryOptionsMenu/WeightEntryOptionsMenu";
import dotsIcon from '../../../../assets/dots-icon.svg';
import './WeightLogEntry.css';


type WeightLogEntryProps = {
  weightLog: WeightLog;
  setEditMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  weightEntryOptionsMenuOpenId: number | null;
  setWeightEntryOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  weightEntryOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  handleDeleteWeightLog: (weightLogId: number) => Promise<void>;
};


export default function WeightLogEntry({
  weightLog,
  setEditMenuOpenId,
  weightEntryOptionsMenuOpenId,
  setWeightEntryOptionsMenuOpenId,
  weightEntryOptionsMenuRefs,
  handleDeleteWeightLog
}: WeightLogEntryProps) {  
  return (
    <div
      className="weight-log"
      onClick={() => setEditMenuOpenId(prev => prev === weightLog.id ? null : weightLog.id)}
    >
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
            <button
              className="weight-log-options-button"
              onClick={(e) => {
                e.stopPropagation();
                setWeightEntryOptionsMenuOpenId(
                  (prev) => (prev === weightLog.id ? null : weightLog.id)
                );
              }}
            >
              <img className="button-link-image" src={dotsIcon} />
            </button>
          </div>
        </div>

        <WeightEntryOptionsMenu
          weightLog={weightLog}
          weightEntryOptionsMenuOpenId={weightEntryOptionsMenuOpenId}
          setWeightEntryOptionsMenuOpenId={setWeightEntryOptionsMenuOpenId}
          weightEntryOptionsMenuRefs={weightEntryOptionsMenuRefs}
          handleDeleteWeightLog={handleDeleteWeightLog}
        />
      </div>
    </div>
  );
}
