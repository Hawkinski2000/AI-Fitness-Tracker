import { useCallback } from "react";
import { type SleepLog, type SleepLogUpdate } from "../types/sleep-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import {
  createSleepLog,
  updateSleepLog
} from "../../../utils/sleep-logs";
import { getDateKey } from "../../../utils/dates";


const useSleepLogActions = (
  currentSleepLogDate: Value,
  sleepLogs: Record<string, SleepLog>,
  setSleepLogs: React.Dispatch<React.SetStateAction<Record<string, SleepLog>>>
) => {
  const { accessToken, setAccessToken } = useAuth();


  const handleUpdateSleepLog = useCallback(async (sleepLogUpdate: SleepLogUpdate) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      if (!currentSleepLogDate) {
        return;
      }

      const dateKey = getDateKey(currentSleepLogDate);
      if (!dateKey) {
        return;
      }

      let sleepLog: SleepLog;
      if (!sleepLogs[dateKey]) {
        sleepLog = await createSleepLog(currentSleepLogDate, setSleepLogs, token);
      }
      else {
        sleepLog = sleepLogs[dateKey];
      }

      const key = Object.keys(sleepLogUpdate)[0];
      const value = Object.values(sleepLogUpdate)[0];

      const updatedSleepLog: SleepLogUpdate = {
        time_to_bed: sleepLog.time_to_bed,
        time_awake: sleepLog.time_awake,
        duration: sleepLog.duration,
        sleep_score: sleepLog.sleep_score,
        [key]: value
      };
      
      await updateSleepLog(
        dateKey,
        sleepLog.id,
        updatedSleepLog,
        setSleepLogs,
        token
      );

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentSleepLogDate,
    sleepLogs,
    setSleepLogs
  ]);

  
  return { handleUpdateSleepLog }
};


export default useSleepLogActions;
