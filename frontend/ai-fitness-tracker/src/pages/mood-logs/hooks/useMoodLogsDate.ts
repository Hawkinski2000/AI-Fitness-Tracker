import { useCallback } from "react";
import { type MoodLog } from "../types/mood-logs";
import { type Value } from 'react-calendar/dist/shared/types.js';
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import { loadMoodLog } from "../../../utils/mood-logs";
import { getDateKey, normalizeDate } from "../../../utils/dates";


const useMoodLogsDate = (
  currentMoodLogDate: Value,
  setCurrentMoodLogDate: React.Dispatch<React.SetStateAction<Value>>,
  moodLogs: Record<string, MoodLog>,
  setMoodLogs: React.Dispatch<React.SetStateAction<Record<string, MoodLog>>>,
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>
) => {
  const { accessToken, setAccessToken } = useAuth();


  const getDateLabel = useCallback((currentMoodLogDate: Value, today: Value) => {
    if (!currentMoodLogDate || !today) {
      return "";
    }
    
    let moodLogDate: Value;
    if (Array.isArray(currentMoodLogDate)) {
      moodLogDate = currentMoodLogDate[0];
    } else {
      moodLogDate = currentMoodLogDate;
    }
    if (!moodLogDate) {
      return;
    }

    let todayDate: Value;
    if (Array.isArray(today)) {
      todayDate = today[0];
    } else {
      todayDate = today;
    }
    if (!todayDate) {
      return;
    }

    const differenceTime = moodLogDate.getTime() - todayDate.getTime();
    const differenceInDays = Math.round(differenceTime / (1000 * 60 * 60 * 24));
    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Tomorrow';
    } else if (differenceInDays === -1) {
      return 'Yesterday';
    }
    const weekday = moodLogDate.toLocaleDateString('en-US', { weekday: 'long' });
    const month = moodLogDate.toLocaleDateString('en-US', { month: 'short' });
    const day = moodLogDate.toLocaleDateString('en-US', { day: 'numeric' });
    return `${weekday}, ${month} ${day}`;
  }, []);

// ---------------------------------------------------------------------------

  const handleChangeDate = useCallback(async (direction: string) => {
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

      let dayDifference = 0;
      if (direction === 'previous') {
        dayDifference -= 1;
      }
      else if (direction === 'next') {
        dayDifference += 1;
      }

      let selectedDate: Value;
      if (Array.isArray(currentMoodLogDate)) {
        selectedDate = currentMoodLogDate[0];
      } else {
        selectedDate = currentMoodLogDate;
      }
      if (!selectedDate) {
        return;
      }

      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + dayDifference);
      const normalizedDate = normalizeDate(newDate);
      if (!normalizedDate) {
        return;
      }
      setCurrentMoodLogDate(normalizedDate);

      const dateKey = getDateKey(normalizedDate);
      if (!dateKey) {
        return;
      }

      if (moodLogs[dateKey]) {
        return;
      }

      await loadMoodLog(
        normalizedDate,
        setMoodLogs,
        token
      )
    
    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentMoodLogDate,
    setCurrentMoodLogDate,
    moodLogs,
    setMoodLogs
  ])

// ---------------------------------------------------------------------------
  
const handleSetCalendarDate = useCallback(async (value: Value) => {
  try {
    let token: string | null = accessToken;
    if (!accessToken || isTokenExpired(accessToken)) {
      token = await refreshAccessToken();  
      setAccessToken(token);
    }
    if (!token) {
      throw new Error("No access token");
    }

    setCalendarDate(value);

    let selectedDate: Value;
    if (Array.isArray(value)) {
      selectedDate = value[0];
    } else {
      selectedDate = value;
    }
    if (!selectedDate) {
      return;
    }

    setCalendarOpenType('');

    const normalizedDate = normalizeDate(selectedDate);
    if (!normalizedDate) {
      return;
    }
    
    setCurrentMoodLogDate(normalizedDate);

    const dateKey = getDateKey(normalizedDate);
    if (!dateKey) {
      return;
    }

    if (moodLogs[dateKey]) {
      return;
    }

    await loadMoodLog(
      normalizedDate,
      setMoodLogs,
      token
    )
    
  } catch (err) {
    console.error(err);
    setAccessToken(null);
  }
  }, [
    accessToken,
    setAccessToken,
    setCurrentMoodLogDate,
    moodLogs,
    setMoodLogs,
    setCalendarOpenType,
    setCalendarDate
  ])


  return {
    getDateLabel,
    handleChangeDate,
    handleSetCalendarDate
  }
};


export default useMoodLogsDate;
