import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { type WeightLog } from "../../types/weight-logs";
import './EditMenu.css';


type EditMenuProps = {
  editMenuOpenId: number | null;
  setEditMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  // addingWeight: boolean;
  // setAddingWeight: React.Dispatch<React.SetStateAction<boolean>>;
  weightLogs: Record<number, WeightLog>;
  editMenuRef: React.RefObject<HTMLDivElement | null>;
};


export default function EditMenu({
  editMenuOpenId,
  setEditMenuOpenId,
  // addingWeight,
  // setAddingWeight,
  weightLogs,
  editMenuRef,
}: EditMenuProps) {
  const currentWeightLog = editMenuOpenId && weightLogs[editMenuOpenId];

  const [weight, setWeight] = useState<number | null>(currentWeightLog && currentWeightLog.weight);

  useEffect(() => {
    setWeight(currentWeightLog && currentWeightLog.weight)
  }, [currentWeightLog]);


  return (
    <div
      className={`weight-logs-edit-menu ${editMenuOpenId && 'edit-menu-open'}`}
      ref={editMenuRef}
    >
      <div className='edit-menu-section'>
        <p>Log date</p>

        <p>{currentWeightLog && dayjs(currentWeightLog.log_date).format("MM/DD/YYYY")}</p>
      </div>

      <div className='edit-menu-section'>
        <p>Weight</p>

        <input
          className='edit-menu-input'
          type="text"
          value={weight || 0}
        />
      </div>
      
      <div className='edit-menu-section'>
        <p>Unit</p>

        <button className='edit-menu-text-button'>
          {currentWeightLog ? currentWeightLog.unit : ''}
        </button>
      </div>

      <nav className="edit-menu-confirmation-nav">
        <button
          className="edit-menu-text-button"
          onClick={() => {
            setEditMenuOpenId(null);
          }}
        >
          Cancel
        </button>

        <button
          className={'edit-menu-text-button'}
          onClick={() => {
            // if (addingWeight) {
            //   handleAddWeightLog();
            // } else {
            //   handleUpdateWeightLog();
            // }

            setEditMenuOpenId(null);
          }}
        >
          Ok
        </button>
      </nav>
    </div>
  );
};
