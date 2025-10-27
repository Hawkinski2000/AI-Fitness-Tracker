import { useCallback } from "react";
import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood
} from "../types/meal-logs";
import { type Value } from 'react-calendar/dist/shared/types.js';
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import { loadMealLog } from "../../../utils/meal-logs";


const useMealLogsDate = (
  currentMealLogDate: string | null,
  setCurrentMealLogDate: React.Dispatch<React.SetStateAction<string | null>>,
  mealLogs: Record<string, MealLog>,
  setMealLogs: React.Dispatch<React.SetStateAction<Record<string, MealLog>>>,
  setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
  setFoods: React.Dispatch<React.SetStateAction<Record<number, Food>>>,
  setBrandedFoods: React.Dispatch<React.SetStateAction<Record<number, BrandedFood>>>,
  setCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>
) => {
  const { accessToken, setAccessToken } = useAuth();


  const getDateLabel = useCallback((currentMealLogDate: string | null, today: string | null) => {
    if (!currentMealLogDate || !today) {
      return "";
    }

    const mealLogDate = new Date(currentMealLogDate);
    const todayDate = new Date(today);
    mealLogDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);
    const differenceTime = mealLogDate.getTime() - todayDate.getTime();
    const differenceInDays = Math.round(differenceTime / (1000 * 60 * 60 * 24));

    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Tomorrow';
    } else if (differenceInDays === -1) {
      return 'Yesterday';
    }
    return currentMealLogDate.split("T")[0];
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

      const prevDate = new Date(currentMealLogDate);
      prevDate.setDate(prevDate.getDate() + dayDifference);
      const newDate = prevDate.toISOString().split('T')[0];
      setCurrentMealLogDate(newDate);

      if (mealLogs[newDate]) {
        return;
      }
      
      await loadMealLog(
        newDate,
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

      if (!currentMealLogDate) {
        return;
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

      setCalendarOpen(false);

      const newDate = selectedDate.toISOString().split('T')[0];
      setCurrentMealLogDate(newDate);

      if (mealLogs[newDate]) {
        return;
      }
      
      await loadMealLog(
        newDate,
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
    setBrandedFoods,
    setCalendarOpen,
    setCalendarDate
  ])


  return {
    getDateLabel,
    handleChangeDate,
    handleSetCalendarDate
  }
};


export default useMealLogsDate;
