import { type SleepLog } from "../../types/sleep-logs";
import { type Value } from 'react-calendar/dist/shared/types.js';
import { getDateKey } from '../../../../utils/dates';
import './SleepLogSummary.css';


type SleepLogSummaryProps = {
  currentSleepLogDate: Value;
  sleepLogs: Record<string, SleepLog>;
};


export default function SleepLogSummary({
  currentSleepLogDate,
  sleepLogs
}: SleepLogSummaryProps) {
  const date = getDateKey(currentSleepLogDate);
  const currentSleepLog = date && sleepLogs[date]


  return (
    <div className="sleep-log-summary">
      <section className="sleep-log-section">
        <div className="sleep-log-section-content">
          <p>Time asleep</p>
          <button className="sleep-log-text-button">
            {currentSleepLog ? currentSleepLog.time_to_bed : 'Add'}
          </button>
        </div>
      </section>

      <section className="sleep-log-section">
        <div className="sleep-log-section-content">
          <p>Time awake</p>
          <button className="sleep-log-text-button">
            {currentSleepLog ? currentSleepLog.time_awake : 'Add'}
          </button>
        </div>
      </section>

      <section className="sleep-log-section">
        <div className="sleep-log-section-content">
          <p>Duration</p>
          <p>{currentSleepLog ? currentSleepLog.duration : ''}</p>
        </div>
      </section>
      
      <section className="sleep-log-section">
        <div className="sleep-log-section-content">
          <p>Sleep score</p>
          <button className="sleep-log-text-button">
            {currentSleepLog ? currentSleepLog.sleep_score : 'Add'}
          </button>
        </div>
      </section>
    </div>
  );
}
