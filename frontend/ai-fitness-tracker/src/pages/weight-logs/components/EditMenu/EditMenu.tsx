import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  type WeightLog,
  type WeightLogCreate,
  // type WeightLogUpdate
} from "../../types/weight-logs";
import './EditMenu.css';


type EditMenuProps = {
  editMenuOpenId: number | null;
  setEditMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  addingWeight: boolean;
  setAddingWeight: React.Dispatch<React.SetStateAction<boolean>>;
  weightLogs: Record<number, WeightLog>;
  editMenuRef: React.RefObject<HTMLDivElement | null>;
  handleCreateWeightLog: (weightLog: WeightLogCreate) => Promise<void>;
  // handleUpdateWeightLog: (weightLogUpdate: WeightLogUpdate) => Promise<void>;
};


export default function EditMenu({
  editMenuOpenId,
  setEditMenuOpenId,
  addingWeight,
  setAddingWeight,
  weightLogs,
  editMenuRef,
  handleCreateWeightLog
}: EditMenuProps) {
  const currentWeightLog = editMenuOpenId && weightLogs[editMenuOpenId];

  const today = dayjs().format("MM/DD/YYYY");

  const [weight, setWeight] = useState<number | null>(null);

  // const [unit, setUnit] = useState<string | null>(null);

  useEffect(() => {
    setWeight(currentWeightLog && currentWeightLog.weight)
  }, [currentWeightLog]);


  return (
    <div
      className={`weight-logs-edit-menu ${(editMenuOpenId || addingWeight) && 'edit-menu-open'}`}
      ref={editMenuRef}
    >
      <div className='edit-menu-section'>
        <p>Log date</p>

        <p>
          {
            currentWeightLog
              ? dayjs(currentWeightLog.log_date).format("MM/DD/YYYY")
              : today
          }
        </p>
      </div>

      <div className='edit-menu-section'>
        <p>Weight</p>

        <input
          className='edit-menu-input'
          type="number"
          value={weight === null ? '' : weight}
          onInput={(e) => {
            e.preventDefault();
            const value = e.currentTarget.value;

            if (!value) {
              setWeight(null);
              return
            }

            const parsed = parseFloat(value);
            if (parsed < 0) {
              setWeight(0);
            }
            else {
              setWeight(parsed);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }
          }}
        />
      </div>
      
      <div className='edit-menu-section'>
        <p>Unit</p>

        <button className='edit-menu-text-button'>
          {
            currentWeightLog
              ? currentWeightLog.unit
              : 'lbs'
          }
        </button>
      </div>

      <nav className="edit-menu-confirmation-nav">
        <button
          className="edit-menu-text-button"
          onClick={() => {
            if (editMenuOpenId) {
              setEditMenuOpenId(null);
            }
            if (addingWeight) {
              setAddingWeight(false);
            }
          }}
        >
          Cancel
        </button>

        <button
          className={
            `edit-menu-text-button
            ${weight === null && 'edit-menu-text-button-disabled'}`
          }
          onClick={() => {
            if (addingWeight && weight) {
              const weightLog = {
                log_date: dayjs().format('YYYY-MM-DD'),
                weight: weight,
                unit: 'lbs'
              }
              handleCreateWeightLog(weightLog);
              setAddingWeight(false);
            } else {
              // handleUpdateWeightLog();
              setEditMenuOpenId(null);
            }

            setEditMenuOpenId(null);
          }}
        >
          Ok
        </button>
      </nav>
    </div>
  );
};
