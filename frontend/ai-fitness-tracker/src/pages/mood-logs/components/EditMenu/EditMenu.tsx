import Slider from '@mui/material/Slider';
import { type MoodLogUpdate } from "../../types/mood-logs";
import './EditMenu.css';


type EditMenuProps = {
  editMenuOpenType: string;
  setEditMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  moodScore: number;
  setMoodScore: React.Dispatch<React.SetStateAction<number>>;
  editMenuRef: React.RefObject<HTMLDivElement | null>;
  handleUpdateMoodLog: (moodLogUpdate: MoodLogUpdate) => Promise<void>;
};


export default function EditMenu({
  editMenuOpenType,
  setEditMenuOpenType,
  moodScore,
  setMoodScore,
  editMenuRef,
  handleUpdateMoodLog
}: EditMenuProps) {
  

  return (
    <div
      className={`edit-menu ${editMenuOpenType && 'edit-menu-open'}`}
      ref={editMenuRef}
    >
      {editMenuOpenType === 'moodScore' && (
        <div className="mood-score-menu-container">
          <p>How do you feel from 0 to 100?</p>
          <Slider
            valueLabelDisplay="auto"
            onChange={(_, value) => setMoodScore(value as number)}
            value={moodScore}
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
            setMoodScore(0);
          }}
        >
          Cancel
        </button>

        <button
          className={'edit-menu-text-button'}
          onClick={() => {
            if (editMenuOpenType === 'moodScore') {
              handleUpdateMoodLog({"mood_score": moodScore});
              setEditMenuOpenType('');
            }

            setEditMenuOpenType('');
          }}
        >
          Ok
        </button>
      </nav>
    </div>
  );
};
