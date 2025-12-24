import { useState, useRef } from "react";
import { type WeightLog } from "../../types/weight-logs";
import useInitializeWeightLogsPage from "../../hooks/useInitializeWeightLogsPage";
// import useWeightLogsClickOutside from "../../hooks/useWeightLogsClickOutside";
// import useWeightLogsDate from "../../hooks/useWeightLogsDate";
// import useWeightLogActions from "../../hooks/useWeightLogActions";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Header from "../../../../components/Header/Header";
import Sidebar from "../../../../components/Sidebar/Sidebar";
// import DateNav from "../DateNav/DateNav";
// import EditMenu from "../EditMenu/EditMenu";
import WeightLogEntry from "../WeightLogEntry/WeightLogEntry";
import './WeightLogsPage.css';


export default function WeightLogsPage() {
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  
// ---------------------------------------------------------------------------

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);

// ---------------------------------------------------------------------------

  // const [editMenuOpenId, setEditMenuOpenId] = useState<number | null>(null);
  // const editMenuRef = useRef<HTMLDivElement | null>(null);

// ---------------------------------------------------------------------------

  const { userData, loading } = useInitializeWeightLogsPage(
    setTokensRemaining,
    setWeightLogs
  );

  // useWeightLogsClickOutside(
  //   setAccountMenuOpen,
  //   editMenuOpenId,
  //   setEditMenuOpenId,
  //   accountMenuRef,
  //   editMenuRef
  // );

  // const {
  //   handleAddWeightLog,
  //   handleUpdateWeightLog
  // } = useWeightLogActions(
  //   weightLogs,
  //   setWeightLogs
  // );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className='weight-logs-page'>
        <Header
          isRemovingTokens={null}
          tokensRemaining={tokensRemaining}
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
          userData={userData}
          accountMenuRef={accountMenuRef}
        />

        <div className="page-body">
          <Sidebar currentPage={'weight-logs'} />
        </div>

        <main className="weight-logs-page-main">
            <div className='weight-logs-page-content'>
              {/* <DateNav
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
              /> */}

              {/* <EditMenu
                editMenuOpenType={editMenuOpenType}
                setEditMenuOpenType={setEditMenuOpenType}
                moodScore={moodScore}
                setMoodScore={setMoodScore}
                editMenuRef={editMenuRef}
                handleUpdateMoodLog={handleUpdateMoodLog}
              /> */}

              {weightLogs.map((weightLog: WeightLog) => {
                return (
                  <WeightLogEntry weightLog={weightLog} />
                );
              })
              }
            </div>
        </main>
      </div>
    </>
  );
}
