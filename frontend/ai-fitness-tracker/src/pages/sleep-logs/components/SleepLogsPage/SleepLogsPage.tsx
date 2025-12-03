import { useState, useRef } from "react";
import { type SleepLog } from "../../types/sleep-logs";
import { type Value } from 'react-calendar/dist/shared/types.js';
import useInitializeSleepLogsPage from "../../hooks/useInitializeSleepLogsPage";
import useSleepLogsDate from "../../hooks/useSleepLogsDate";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Header from "../../../../components/Header/Header";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import DateNav from "../DateNav/DateNav";
import SleepLogSummary from "../SleepLogSummary/SleepLogSummary";
import './SleepLogsPage.css';


export default function SleepLogsPage() {
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
    const accountMenuRef = useRef<HTMLDivElement | null>(null);
  
    const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  
  // ----------------------------------------------------------------------

    const [currentSleepLogDate, setCurrentSleepLogDate] = useState<Value>(new Date());
    const [today, setToday] = useState<Value>(new Date());
  
  // ---------------------------------------------------------------------------

    const [sleepLogs, setSleepLogs] = useState<Record<string, SleepLog>>({});

  // ---------------------------------------------------------------------------

  const [calendarOpenType, setCalendarOpenType] = useState<string>('');
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [calendarDate, setCalendarDate] = useState<Value>(new Date());

// ---------------------------------------------------------------------------

    const { userData, loading } = useInitializeSleepLogsPage(
    setTokensRemaining,
    setSleepLogs,
    setToday,
    setCurrentSleepLogDate
  );

  const {
    getDateLabel,
    handleChangeDate,
    handleSetCalendarDate
  } = useSleepLogsDate(
    currentSleepLogDate,
    setCurrentSleepLogDate,
    sleepLogs,
    setSleepLogs,
    setCalendarOpenType,
    setCalendarDate
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className='sleep-logs-page'>
        <Header
          isRemovingTokens={null}
          tokensRemaining={tokensRemaining}
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
          userData={userData}
          accountMenuRef={accountMenuRef}
        />

        <div className="page-body">
          <Sidebar currentPage={'sleep-logs'} />

          <main className="sleep-logs-page-main">
            <div className='sleep-logs-page-content'>
              <DateNav
                currentSleepLogDate={currentSleepLogDate}
                today={today}
                handleChangeDate={handleChangeDate}
                getDateLabel={getDateLabel}
                calendarOpenType={calendarOpenType}
                setCalendarOpenType={setCalendarOpenType}
                calendarRef={calendarRef}
                calendarDate={calendarDate}
                setCalendarDate={setCalendarDate}
                handleSetCalendarDate={handleSetCalendarDate}
              />

              <SleepLogSummary
                currentSleepLogDate={currentSleepLogDate}
                sleepLogs={sleepLogs}
              />
            </div>
          </main>
        </div>

      </div>
    </>
  );
}
