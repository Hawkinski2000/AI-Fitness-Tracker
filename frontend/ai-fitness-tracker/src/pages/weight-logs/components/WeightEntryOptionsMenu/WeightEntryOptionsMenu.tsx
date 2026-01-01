import { type WeightLog } from "../../types/weight-logs";
import deleteIcon from '../../../../assets/delete-icon.svg';
import './WeightEntryOptionsMenu.css';


type WeightEntryOptionsMenuProps = {
  weightLog: WeightLog;
  weightEntryOptionsMenuOpenId: number | null;
  setWeightEntryOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  weightEntryOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  // handleDeleteWeightLog: (weightLogId: number) => Promise<void>;
};


export default function WeightEntryOptionsMenu({
  weightLog,
  weightEntryOptionsMenuOpenId,
  setWeightEntryOptionsMenuOpenId,
  weightEntryOptionsMenuRefs,
  // handleDeleteWeightLog
}: WeightEntryOptionsMenuProps) {
  return (
    <div
      ref={el => { weightEntryOptionsMenuRefs.current[weightLog.id] = el }}
      className={
        `weight-entry-options-menu
        ${weightEntryOptionsMenuOpenId === weightLog.id && 'weight-entry-options-menu-open'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="weight-entry-options-menu-button weight-entry-options-delete-button"
        onClick={(e) => {
          e.stopPropagation();
          // handleDeleteWeightLog(weightLog.id);
          setWeightEntryOptionsMenuOpenId(null);
        }}
      >
        <img className="button-link-image" src={deleteIcon} />
        Delete Entry
      </button>
    </div>
  );
}
