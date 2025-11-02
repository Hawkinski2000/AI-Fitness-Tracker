import { useCallback } from "react";
import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood
} from "../types/workout-logs";
import { type Value } from 'react-calendar/dist/shared/types.js';
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import { loadMealLog } from "../../../utils/meal-logs";
import { getDateKey, normalizeDate } from "../../../utils/dates";


const useMealLogsDate = (
  currentMealLogDate: Value,
  setCurrentMealLogDate: React.Dispatch<React.SetStateAction<Value>>,
  mealLogs: Record<string, MealLog>,
  setMealLogs: React.Dispatch<React.SetStateAction<Record<string, MealLog>>>,
  setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
  setFoods: React.Dispatch<React.SetStateAction<Record<number, Food>>>,
  setBrandedFoods: React.Dispatch<React.SetStateAction<Record<number, BrandedFood>>>,
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>
) => {
  const { accessToken, setAccessToken } = useAuth();


  const getDateLabel = useCallback((currentMealLogDate: Value, today: Value) => {
    if (!currentMealLogDate || !today) {
      return "";
    }
    
    let mealLogDate: Value;
    if (Array.isArray(currentMealLogDate)) {
      mealLogDate = currentMealLogDate[0];
    } else {
      mealLogDate = currentMealLogDate;
    }
    if (!mealLogDate) {
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

    const differenceTime = mealLogDate.getTime() - todayDate.getTime();
    const differenceInDays = Math.round(differenceTime / (1000 * 60 * 60 * 24));
    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Tomorrow';
    } else if (differenceInDays === -1) {
      return 'Yesterday';
    }
    const weekday = mealLogDate.toLocaleDateString('en-US', { weekday: 'long' });
    const month = mealLogDate.toLocaleDateString('en-US', { month: 'short' });
    const day = mealLogDate.toLocaleDateString('en-US', { day: 'numeric' });
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

      if (!currentMealLogDate) {
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
      if (Array.isArray(currentMealLogDate)) {
        selectedDate = currentMealLogDate[0];
      } else {
        selectedDate = currentMealLogDate;
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
      setCurrentMealLogDate(normalizedDate);

      const dateKey = getDateKey(normalizedDate);
      if (!dateKey) {
        return;
      }

      if (mealLogs[dateKey]) {
        return;
      }
      
      await loadMealLog(
        normalizedDate,
        setMealLogs,
        setMealLogFoods,
        setFoods,
        setBrandedFoods,
        token,
        [
          "mealLogFoods",
          "mealLogFoods.food",
          "mealLogFoods.brandedFood"
        ]
      );
    
    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    currentMealLogDate,
    setCurrentMealLogDate,
    mealLogs,
    setMealLogs,
    setMealLogFoods,
    setFoods,
    setBrandedFoods
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
      
      setCurrentMealLogDate(normalizedDate);

      const dateKey = getDateKey(normalizedDate);
      if (!dateKey) {
        return;
      }

      if (mealLogs[dateKey]) {
        return;
      }

      await loadMealLog(
        normalizedDate,
        setMealLogs,
        setMealLogFoods,
        setFoods,
        setBrandedFoods,
        token,
        [
          "mealLogFoods",
          "mealLogFoods.food",
          "mealLogFoods.brandedFood"
        ]
      );
    
    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    setCurrentMealLogDate,
    mealLogs,
    setMealLogs,
    setMealLogFoods,
    setFoods,
    setBrandedFoods,
    setCalendarOpenType,
    setCalendarDate
  ])


  return {
    getDateLabel,
    handleChangeDate,
    handleSetCalendarDate
  }
};


export default useMealLogsDate;
