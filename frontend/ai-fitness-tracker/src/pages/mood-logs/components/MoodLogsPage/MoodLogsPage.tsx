import { useState, useRef } from "react";
import { type MoodLog } from "../../types/mood-logs";
import { type Value } from 'react-calendar/dist/shared/types.js';
import { getDateKey } from '../../../../utils/dates';
import useInitializeMoodLogsPage from "../../hooks/useInitializeMoodLogsPage";
import useMoodLogsClickOutside from "../../hooks/useMoodLogsClickOutside";
import useMoodLogsDate from "../../hooks/useMoodLogsDate";
import useMoodLogActions from "../../hooks/useMoodLogActions";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Header from "../../../../components/Header/Header";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import DateNav from "../DateNav/DateNav";
import EditMenu from "../EditMenu/EditMenu";
import MoodLogSummary from "../MoodLogSummary/MoodLogSummary";
import './MoodLogsPage.css';


export default function MoodLogsPage() {
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  
// ---------------------------------------------------------------------------

const [currentMoodLogDate, setCurrentMoodLogDate] = useState<Value>(new Date());
  const [today, setToday] = useState<Value>(new Date());

// ---------------------------------------------------------------------------

  const [moodLogs, setMoodLogs] = useState<Record<string, MoodLog>>({});

  const dateKey = getDateKey(currentMoodLogDate);
  const currentMoodLog = dateKey && moodLogs[dateKey];

// ---------------------------------------------------------------------------

  const [calendarOpenType, setCalendarOpenType] = useState<string>('');
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [calendarDate, setCalendarDate] = useState<Value>(new Date());

// ---------------------------------------------------------------------------

  const [editMenuOpenType, setEditMenuOpenType] = useState<string>('');
  const editMenuRef = useRef<HTMLDivElement | null>(null);

  const [moodScore, setMoodScore] = useState<number>(0);

// ---------------------------------------------------------------------------

  const { userData, loading } = useInitializeMoodLogsPage(
    setTokensRemaining,
    setMoodLogs,
    setToday,
    setCurrentMoodLogDate
  );

  useMoodLogsClickOutside(
    setAccountMenuOpen,
    editMenuOpenType,
    setEditMenuOpenType,
    calendarOpenType,
    setCalendarOpenType,
    setCalendarDate,
    currentMoodLogDate,
    setMoodScore,
    accountMenuRef,
    editMenuRef,
    calendarRef
  );

  const {
    getDateLabel,
    handleChangeDate,
    handleSetCalendarDate
  } = useMoodLogsDate(
    currentMoodLogDate,
    setCurrentMoodLogDate,
    moodLogs,
    setMoodLogs,
    setCalendarOpenType,
    setCalendarDate
  );

  const { handleUpdateMoodLog } = useMoodLogActions(
    currentMoodLogDate,
    moodLogs,
    setMoodLogs
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className='mood-logs-page'>
        <Header
          isRemovingTokens={null}
          tokensRemaining={tokensRemaining}
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
          userData={userData}
          accountMenuRef={accountMenuRef}
        />

        <div className="page-body">
          <Sidebar currentPage={'mood-logs'} />
        </div>

        <main className="mood-logs-page-main">
            <div className='mood-logs-page-content'>
              <DateNav
                currentMoodLogDate={currentMoodLogDate}
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
                editMenuOpenType={editMenuOpenType}
                setEditMenuOpenType={setEditMenuOpenType}
                moodScore={moodScore}
                setMoodScore={setMoodScore}
                editMenuRef={editMenuRef}
                handleUpdateMoodLog={handleUpdateMoodLog}
              />

              <MoodLogSummary
                currentMoodLog={currentMoodLog}
                setEditMenuOpenType={setEditMenuOpenType}
                setMoodScore={setMoodScore}
              />
            </div>
        </main>
      </div>
    </>
  );
}
