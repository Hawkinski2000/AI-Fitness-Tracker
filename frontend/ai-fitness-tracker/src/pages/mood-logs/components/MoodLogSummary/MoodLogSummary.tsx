import { type MoodLog } from "../../types/mood-logs";
import './MoodLogSummary.css';


type SleepLogSummaryProps = {
  currentMoodLog: "" | MoodLog | null;
  setEditMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  setMoodScore: React.Dispatch<React.SetStateAction<number>>;
};


export default function SleepLogSummary({
  currentMoodLog,
  setEditMenuOpenType,
  setMoodScore,
}: SleepLogSummaryProps) {
  return (
    <div className="mood-log-summary">
      <section className="mood-log-section">
        <div className="mood-log-section-content">
          <p>Mood score</p>
          <button
            className="mood-log-text-button"
            onClick={() => {
              setEditMenuOpenType(prev => prev === 'moodScore' ? '' : 'moodScore');
              if (currentMoodLog && currentMoodLog.mood_score) {
                setMoodScore(currentMoodLog.mood_score);
              }
              else {
                setMoodScore(0);
              }
            }}
          >
            {currentMoodLog && currentMoodLog.mood_score !== null ? currentMoodLog.mood_score : 'Add'}
          </button>
        </div>
      </section>
    </div>
  );
}
