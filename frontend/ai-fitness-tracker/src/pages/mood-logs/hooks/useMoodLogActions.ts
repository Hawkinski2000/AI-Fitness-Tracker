import { useCallback } from "react";
import { type MoodLog, type MoodLogUpdate } from "../types/mood-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import {
  createMoodLog,
  updateMoodLog
} from "../../../utils/mood-logs";
import { getDateKey } from "../../../utils/dates";


const useMoodLogActions = (
  currentMoodLogDate: Value,
  moodLogs: Record<string, MoodLog>,
  setMoodLogs: React.Dispatch<React.SetStateAction<Record<string, MoodLog>>>
) => {
  const { accessToken, setAccessToken } = useAuth();


  const handleUpdateMoodLog = useCallback(async (moodLogUpdate: MoodLogUpdate) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      if (!currentMoodLogDate) {
        return;
      }

      const dateKey = getDateKey(currentMoodLogDate);
      if (!dateKey) {
        return;
      }

      let moodLog: MoodLog;
      if (!moodLogs[dateKey]) {
        moodLog = await createMoodLog(currentMoodLogDate, setMoodLogs, token);
      }
      else {
        moodLog = moodLogs[dateKey];
      }

      const key = Object.keys(moodLogUpdate)[0];
      const value = Object.values(moodLogUpdate)[0];

      const updatedMoodLog: MoodLogUpdate = {
        [key]: value
      };
      
      await updateMoodLog(
        dateKey,
        moodLog.id,
        updatedMoodLog,
        setMoodLogs,
        token
      );

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentMoodLogDate,
    moodLogs,
    setMoodLogs
  ]);

  
  return { handleUpdateMoodLog }
};


export default useMoodLogActions;
