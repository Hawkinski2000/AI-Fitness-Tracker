import { useState } from "react";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';
import Slider from '@mui/material/Slider';
import { type SleepLogUpdate } from "../../types/sleep-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { getDateKey } from '../../../../utils/dates';
import './EditMenu.css';


type EditMenuProps = {
  currentSleepLogDate: Value;
  editMenuOpenType: string;
  setEditMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  changeDateMenuOpen: boolean;
  setChangeDateMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  time: Dayjs | null;
  setTime: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  sleepScore: number;
  setSleepScore: React.Dispatch<React.SetStateAction<number>>;
  editMenuRef: React.RefObject<HTMLDivElement | null>;
  handleUpdateSleepLog: (sleepLogUpdate: SleepLogUpdate) => Promise<void>;
};


export default function EditMenu({
  currentSleepLogDate,
  editMenuOpenType,
  setEditMenuOpenType,
  changeDateMenuOpen,
  setChangeDateMenuOpen,
  time,
  setTime,
  sleepScore,
  setSleepScore,
  editMenuRef,
  handleUpdateSleepLog
}: EditMenuProps) {
  const todayDate = getDateKey(currentSleepLogDate);

  const [date, setDate] = useState<string | null>(todayDate);

  const sleepLogDate = Array.isArray(currentSleepLogDate) ? currentSleepLogDate[0] : currentSleepLogDate;
  if (!sleepLogDate) {
    return;
  }
  const yesterdaySleepLogDate = new Date(sleepLogDate);
  yesterdaySleepLogDate.setDate(yesterdaySleepLogDate.getDate() - 1);
  const yesterdayDate = getDateKey(yesterdaySleepLogDate);

  return (
    <div
      className={`edit-menu ${editMenuOpenType && 'edit-menu-open'}`}
      ref={editMenuRef}
    >
      {(editMenuOpenType === 'timeAsleep' || editMenuOpenType === 'timeAwake') && (
        <div>
          <div className="edit-menu-date-section">
            <p>Date</p>

            <button
              className="edit-menu-text-button"
              onClick={(e) => {
                e.stopPropagation();
                setChangeDateMenuOpen((prev) => !prev);
              }}
            >
              {date}
            </button>

            <div
              className={
                `change-date-menu
                ${changeDateMenuOpen && 'change-date-menu-open'}`
              }
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="change-date-menu-button"
                onClick={() => {
                  setDate(prev => prev === yesterdayDate ? todayDate : yesterdayDate);
                  setChangeDateMenuOpen(false);
                }}
              >
                {date === todayDate ? yesterdayDate : todayDate}
              </button>
            </div>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticTimePicker
              onChange={(e) => setTime(e)}
              value={time}
              slotProps={{
                toolbar: {
                  sx: {
                    "& .MuiTypography-root": { color: "#8085a6", fontFamily: "Outfit" },
                    "& .MuiTypography-overline": {
                      color: "#eceff4",
                      fontSize: "16px",
                      fontFamily: "Outfit",
                      textTransform: "none"
                    },
                    "& .MuiPickersToolbar-root [data-selected='true']": { color: "#eceff4" },
                    "& .MuiTouchRipple-root": { color: "#1e1e3f" },
                    "& .MuiButtonBase-root:hover": { backgroundColor: "rgba(128, 133, 166, 0.5)" }
                  }
                },
                layout: {
                  sx: {
                    backgroundColor: "#2e2e5e",
                    "& .MuiClock-pin": { backgroundColor: "#00ffcc" },                          
                    "& .MuiClockPointer-root": { backgroundColor: "#00ffcc" },
                    "& .MuiClockPointer-thumb": {
                      borderColor: "#00ffcc",
                      backgroundColor: "#00ffcc"
                    },
                    "& .MuiClock-squareMask": {
                      backgroundColor: "#1e1e3f",
                    },
                    "& .MuiClockNumber-root": {
                      color: "#8085a6",
                      fontFamily: "Outfit"
                      },
                    "& .Mui-selected": { color: "#eceff4" },
                  }
                },
                previousIconButton: {
                  sx: {
                    "& .MuiSvgIcon-root path": { fill: "#eceff4" },
                    "&.Mui-disabled": {
                      "& .MuiSvgIcon-root path": { fill: "#8085a6" }
                    },
                    "& .MuiTouchRipple-root": { color: "#1e1e3f" }
                  }
                },
                nextIconButton: {
                  sx: {
                    "& .MuiSvgIcon-root path": { fill: "#eceff4" },
                    "&.Mui-disabled": {
                      "& .MuiSvgIcon-root path": { fill: "#8085a6" }
                    },
                    "& .MuiTouchRipple-root": { color: "#1e1e3f" }
                  }
                },
                actionBar: { actions : [] }
              }}
            />
          </LocalizationProvider>
        </div>
      )}

      {editMenuOpenType === 'sleepScore' && (
        <div className="sleep-score-menu-container">
          <p>How rested do you feel from 0 to 100?</p>
          <Slider
            valueLabelDisplay="auto"
            onChange={(_, value) => setSleepScore(value as number)}
            value={sleepScore}
            sx={{
              color: "#00ffcc",

              "& .MuiSlider-thumb:hover": {
                boxShadow: "0 0 0 8px rgb(0, 255, 204, 0.1)",
              },

              "& .MuiSlider-thumb:active": {
                boxShadow: "0 0 0 14px rgb(0, 255, 204, 0.1)",
              },

              "& .MuiSlider-valueLabel": {
                backgroundColor: "#8085a6",
                color: "#eceff4",
                fontFamily: "Outfit"
              }
            }}
          />
        </div>
      )}

      <nav className="edit-menu-confirmation-nav">
        <button
          className="edit-menu-text-button"
          onClick={() => {
            setEditMenuOpenType('');
            setTime(null);
            setSleepScore(0);
          }}
        >
          Cancel
        </button>

        <button
          className="edit-menu-text-button"
          onClick={() => {
            if (editMenuOpenType === 'sleepScore') {
              handleUpdateSleepLog({"sleep_score": sleepScore});
              setEditMenuOpenType('');
              setTime(null);
            }

            if (!time) {
              return;
            }
            
            if (time && currentSleepLogDate instanceof Date) {
              time = time
                .set("year", currentSleepLogDate.getFullYear())
                .set("month", currentSleepLogDate.getMonth())
                .set("date", currentSleepLogDate.getDate());
            }

            if (editMenuOpenType === 'timeAsleep') {
              handleUpdateSleepLog({"time_to_bed": time.subtract(1, 'day').toISOString()});
            }
            else if (editMenuOpenType === 'timeAwake') {
              handleUpdateSleepLog({"time_awake": time.toISOString()});
            }

            setEditMenuOpenType('');
            setTime(null);
          }}
        >
          Ok
        </button>
      </nav>
    </div>
  );
};
