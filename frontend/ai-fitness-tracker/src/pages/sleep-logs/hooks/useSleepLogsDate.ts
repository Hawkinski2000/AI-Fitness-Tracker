import { useCallback } from "react";
import { type Value } from 'react-calendar/dist/shared/types.js';
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import { getDateKey, normalizeDate } from "../../../utils/dates";


const useSleepLogsDate = (
  currentSleepLogDate: Value,
  setCurrentSleepLogDate: React.Dispatch<React.SetStateAction<Value>>,
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>
) => {
  const { accessToken, setAccessToken } = useAuth();


  const getDateLabel = useCallback((currentSleepLogDate: Value, today: Value) => {
    if (!currentSleepLogDate || !today) {
      return "";
    }
    
    let sleepLogDate: Value;
    if (Array.isArray(currentSleepLogDate)) {
      sleepLogDate = currentSleepLogDate[0];
    } else {
      sleepLogDate = currentSleepLogDate;
    }
    if (!sleepLogDate) {
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

    const differenceTime = sleepLogDate.getTime() - todayDate.getTime();
    const differenceInDays = Math.round(differenceTime / (1000 * 60 * 60 * 24));
    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Tomorrow';
    } else if (differenceInDays === -1) {
      return 'Yesterday';
    }
    const weekday = sleepLogDate.toLocaleDateString('en-US', { weekday: 'long' });
    const month = sleepLogDate.toLocaleDateString('en-US', { month: 'short' });
    const day = sleepLogDate.toLocaleDateString('en-US', { day: 'numeric' });
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

      if (!currentSleepLogDate) {
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
      if (Array.isArray(currentSleepLogDate)) {
        selectedDate = currentSleepLogDate[0];
      } else {
        selectedDate = currentSleepLogDate;
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
      setCurrentSleepLogDate(normalizedDate);

      const dateKey = getDateKey(normalizedDate);
      if (!dateKey) {
        return;
      }
    
    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentSleepLogDate,
    setCurrentSleepLogDate,
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
    
    setCurrentSleepLogDate(normalizedDate);

    const dateKey = getDateKey(normalizedDate);
    if (!dateKey) {
      return;
    }
    
  } catch (err) {
    console.error(err);
    setAccessToken(null);
  }
  }, [
    accessToken,
    setAccessToken,
    setCurrentSleepLogDate,
    setCalendarOpenType,
    setCalendarDate
  ])


  return {
    getDateLabel,
    handleChangeDate,
    handleSetCalendarDate
  }
};


export default useSleepLogsDate;
