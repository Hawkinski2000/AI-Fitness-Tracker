import { useState, useRef } from "react";
import { type WeightLog } from "../../types/weight-logs";
import useInitializeWeightLogsPage from "../../hooks/useInitializeWeightLogsPage";
// import useWeightLogsClickOutside from "../../hooks/useWeightLogsClickOutside";
// import useWeightLogsDate from "../../hooks/useWeightLogsDate";
import useWeightLogActions from "../../hooks/useWeightLogActions";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Header from "../../../../components/Header/Header";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import DateNav from "../DateNav/DateNav";
import DateRangeHeader from "../DateRangeHeader/DateRangeHeader";
import EditMenu from "../EditMenu/EditMenu";
import WeightLineChart from "../WeightLineChart/WeightLineChart";
import WeightLogEntry from "../WeightLogEntry/WeightLogEntry";
import './WeightLogsPage.css';


export default function WeightLogsPage() {
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  
// ---------------------------------------------------------------------------

  const [weightLogs, setWeightLogs] = useState<Record<number, WeightLog>>({});

// ---------------------------------------------------------------------------

  const [editMenuOpenId, setEditMenuOpenId] = useState<number | null>(null);
  const editMenuRef = useRef<HTMLDivElement | null>(null);

  const [addingWeight, setAddingWeight] = useState<boolean>(false);

// ---------------------------------------------------------------------------

  const [dateRange, setDateRange] = useState<string>("3 Months");

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

  const {
    handleCreateWeightLog,
    // handleUpdateWeightLog
  } = useWeightLogActions(
    // editMenuOpenId,
    setWeightLogs
  );

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
              <DateNav
                setEditMenuOpenId={setEditMenuOpenId}
                setAddingWeight={setAddingWeight}
              />

              <DateRangeHeader
                dateRange={dateRange}
                setDateRange={setDateRange}
              />

              <EditMenu
                editMenuOpenId={editMenuOpenId}
                setEditMenuOpenId={setEditMenuOpenId}
                addingWeight={addingWeight}
                setAddingWeight={setAddingWeight}
                weightLogs={weightLogs}
                editMenuRef={editMenuRef}
                handleCreateWeightLog={handleCreateWeightLog}
              />

              <WeightLineChart
                weightLogs={weightLogs}
                dateRange={dateRange}
              />

              <div className="weight-logs-container">
                <div className="weight-logs-page-section">
                  <div className="weight-logs-page-section-content">
                    <h3 className="weight-logs-page-text">Entries</h3>
                  </div>
                </div>

                {Object.entries(weightLogs).map(([id, weightLog]) => {
                  return (
                    <WeightLogEntry
                      key={id}
                      weightLog={weightLog}
                      setEditMenuOpenId={setEditMenuOpenId}
                    />
                  );
                })}
              </div>
            </div>
        </main>
      </div>
    </>
  );
}
