import dayjs, { Dayjs } from "dayjs";
import { type SleepLog } from "../../types/sleep-logs";
import './SleepLogSummary.css';


type SleepLogSummaryProps = {
  currentSleepLog: "" | SleepLog | null;
  setEditMenuOpenType: React.Dispatch<React.SetStateAction<string>>;
  setTime: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  setSleepScore: React.Dispatch<React.SetStateAction<number>>;
};


export default function SleepLogSummary({
  currentSleepLog,
  setEditMenuOpenType,
  setTime,
  setSleepScore
}: SleepLogSummaryProps) {
  return (
    <div className="sleep-log-summary">
      <section className="sleep-log-section">
        <div className="sleep-log-section-content">
          <p>Time asleep</p>
          <button
            className="sleep-log-text-button"
            onClick={() => {
              setEditMenuOpenType(prev => prev === 'timeAsleep' ? '' : 'timeAsleep');
              if (currentSleepLog && currentSleepLog.time_to_bed) {
                setTime(dayjs(currentSleepLog.time_to_bed));
              }
            }}
          >
            {
              currentSleepLog && currentSleepLog.time_to_bed
                ? dayjs(currentSleepLog.time_to_bed).format('hh:mm A')
                : 'Add'
            }
          </button>
        </div>
      </section>

      <section className="sleep-log-section">
        <div className="sleep-log-section-content">
          <p>Time awake</p>
          <button
            className="sleep-log-text-button"
            onClick={() => {
              setEditMenuOpenType(prev => prev === 'timeAwake' ? '' : 'timeAwake');
              if (currentSleepLog && currentSleepLog.time_awake) {
                setTime(dayjs(currentSleepLog.time_awake));
              }
            }}
          >
            {
              currentSleepLog && currentSleepLog.time_awake
                ? dayjs(currentSleepLog.time_awake).format('hh:mm A')
                : 'Add'
            }
          </button>
        </div>
      </section>

      <section className="sleep-log-section">
        <div className="sleep-log-section-content">
          <p>Duration</p>
          <p>
            {
              currentSleepLog && currentSleepLog.duration
                ? `${Math.floor(currentSleepLog.duration / 60)} hours ${currentSleepLog.duration % 60} minutes`
                : ''
            }
          </p>
        </div>
      </section>
      
      <section className="sleep-log-section">
        <div className="sleep-log-section-content">
          <p>Sleep score</p>
          <button
            className="sleep-log-text-button"
            onClick={() => {
              setEditMenuOpenType(prev => prev === 'sleepScore' ? '' : 'sleepScore');
              if (currentSleepLog && currentSleepLog.sleep_score) {
                setSleepScore(currentSleepLog.sleep_score);
              }
            }}
          >
            {currentSleepLog && currentSleepLog.sleep_score !== null ? currentSleepLog.sleep_score : 'Add'}
          </button>
        </div>
      </section>
    </div>
  );
}
