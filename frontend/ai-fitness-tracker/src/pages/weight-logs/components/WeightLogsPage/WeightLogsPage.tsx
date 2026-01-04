import { useState, useRef, useMemo } from "react";
import dayjs from "dayjs";
import { type WeightLog } from "../../types/weight-logs";
import useInitializeWeightLogsPage from "../../hooks/useInitializeWeightLogsPage";
import useWeightLogsClickOutside from "../../hooks/useWeightLogsClickOutside";
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

  const sortedEntries = useMemo(() => {
    return Object.entries(weightLogs).sort((a, b) => {
      const aDate = dayjs(a[1].log_date);
      const bDate = dayjs(b[1].log_date);
      return aDate.isBefore(bDate) ? 1 : -1;
    });
  }, [weightLogs]);

// ---------------------------------------------------------------------------

  const [editMenuOpenId, setEditMenuOpenId] = useState<number | null>(null);
  const editMenuRef = useRef<HTMLDivElement | null>(null);

  const [addingWeight, setAddingWeight] = useState<boolean>(false);

// ---------------------------------------------------------------------------

  const [dateRange, setDateRange] = useState<string>("3 Months");
  const [dateRangeOffset, setDateRangeOffset] = useState<number>(0);

  const earliestDate = useMemo(() => {
    switch (dateRange) {
      case "Week":
        return dayjs().subtract(1 * (dateRangeOffset + 1), "week");
      case "Month":
        return dayjs().subtract(1 * (dateRangeOffset + 1), "month");
      case "3 Months":
        return dayjs().subtract(3 * (dateRangeOffset + 1), "month");
      case "Year":
        return dayjs().subtract(1 * (dateRangeOffset + 1), "year");
      default:
        return dayjs(sortedEntries[sortedEntries.length - 1][1].log_date);
    }
  }, [dateRange, dateRangeOffset, sortedEntries]);

  const latestDate = useMemo(() => {
    switch (dateRange) {
      case "Week":
        return dayjs().subtract(1 * dateRangeOffset, "week");
      case "Month":
        return dayjs().subtract(1 * dateRangeOffset, "month");
      case "3 Months":
        return dayjs().subtract(3 * dateRangeOffset, "month");
      case "Year":
        return dayjs().subtract(1 * dateRangeOffset, "year");
      default:
        return dayjs(sortedEntries[0][1].log_date);
    }
  }, [dateRange, dateRangeOffset, sortedEntries]);

// ---------------------------------------------------------------------------

  const [weightEntryOptionsMenuOpenId, setWeightEntryOptionsMenuOpenId] = useState<number | null>(null);
  const weightEntryOptionsMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

// ---------------------------------------------------------------------------

  const { userData, loading } = useInitializeWeightLogsPage(
    setTokensRemaining,
    setWeightLogs
  );

  useWeightLogsClickOutside(
    setAccountMenuOpen,
    editMenuOpenId,
    setEditMenuOpenId,
    addingWeight,
    setAddingWeight,
    weightEntryOptionsMenuOpenId,
    setWeightEntryOptionsMenuOpenId,
    accountMenuRef,
    editMenuRef,
    weightEntryOptionsMenuRefs
  );

  const {
    handleCreateWeightLog,
    handleUpdateWeightLog,
    handleDeleteWeightLog
  } = useWeightLogActions(
    editMenuOpenId,
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
                dateRangeOffset={dateRangeOffset}
                setDateRangeOffset={setDateRangeOffset}
                earliestDate={earliestDate}
                latestDate={latestDate}
                dateRange={dateRange}
              />

              <DateRangeHeader
                dateRange={dateRange}
                setDateRange={setDateRange}
                setDateRangeOffset={setDateRangeOffset}
              />

              <EditMenu
                editMenuOpenId={editMenuOpenId}
                setEditMenuOpenId={setEditMenuOpenId}
                addingWeight={addingWeight}
                setAddingWeight={setAddingWeight}
                weightLogs={weightLogs}
                editMenuRef={editMenuRef}
                handleCreateWeightLog={handleCreateWeightLog}
                handleUpdateWeightLog={handleUpdateWeightLog}
              />

              <WeightLineChart
                sortedEntries={sortedEntries}
                earliestDate={earliestDate}
                latestDate={latestDate}
              />

              <div className="weight-logs-container">
                <div className="weight-logs-page-section">
                  <div className="weight-logs-page-section-content">
                    <h3 className="weight-logs-page-text">Entries</h3>
                  </div>
                </div>

                {sortedEntries.map(([id, weightLog]) => (
                  <WeightLogEntry
                    key={id}
                    weightLog={weightLog}
                    setEditMenuOpenId={setEditMenuOpenId}
                    weightEntryOptionsMenuOpenId={weightEntryOptionsMenuOpenId}
                    setWeightEntryOptionsMenuOpenId={setWeightEntryOptionsMenuOpenId}
                    weightEntryOptionsMenuRefs={weightEntryOptionsMenuRefs}
                    handleDeleteWeightLog={handleDeleteWeightLog}
                  />
                ))}
              </div>
            </div>
        </main>
      </div>
    </>
  );
}
