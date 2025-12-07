import { useState, useRef } from "react";
import { Dayjs } from "dayjs";
import { type SleepLog } from "../../types/sleep-logs";
import { type Value } from 'react-calendar/dist/shared/types.js';
import useInitializeSleepLogsPage from "../../hooks/useInitializeSleepLogsPage";
import useSleepLogsClickOutside from "../../hooks/useSleepLogsClickOutside";
import useSleepLogsDate from "../../hooks/useSleepLogsDate";
import useSleepLogActions from "../../hooks/useSleepLogActions";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Header from "../../../../components/Header/Header";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import DateNav from "../DateNav/DateNav";
import EditMenu from "../EditMenu/EditMenu";
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

  const [editMenuOpenType, setEditMenuOpenType] = useState<string>('');
  const editMenuRef = useRef<HTMLDivElement | null>(null);

  const [time, setTime] = useState<Dayjs | null>(null);

// ---------------------------------------------------------------------------

  const { userData, loading } = useInitializeSleepLogsPage(
    setTokensRemaining,
    setSleepLogs,
    setToday,
    setCurrentSleepLogDate
  );

  useSleepLogsClickOutside(
    setAccountMenuOpen,
    editMenuOpenType,
    setEditMenuOpenType,
    calendarOpenType,
    setCalendarOpenType,
    setCalendarDate,
    currentSleepLogDate,
    setTime,
    accountMenuRef,
    editMenuRef,
    calendarRef
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

  const { handleUpdateSleepLog } = useSleepLogActions(
    currentSleepLogDate,
    sleepLogs,
    setSleepLogs
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

              <EditMenu
                currentSleepLogDate={currentSleepLogDate}
                editMenuOpenType={editMenuOpenType}
                setEditMenuOpenType={setEditMenuOpenType}
                time={time}
                setTime={setTime}
                editMenuRef={editMenuRef}
                handleUpdateSleepLog={handleUpdateSleepLog}
              />

              <SleepLogSummary
                currentSleepLogDate={currentSleepLogDate}
                sleepLogs={sleepLogs}
                setEditMenuOpenType={setEditMenuOpenType}
                setTime={setTime}
              />
            </div>
          </main>
        </div>

      </div>
    </>
  );
}
