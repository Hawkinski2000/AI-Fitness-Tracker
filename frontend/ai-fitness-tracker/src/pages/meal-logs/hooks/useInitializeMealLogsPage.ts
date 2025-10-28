import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { type UserType } from "../../../types/app";
import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood
} from "../types/meal-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, getUserFromToken } from "../../../utils/auth";
import { loadMealLog } from "../../../utils/meal-logs";


const useInitializeMealLogsPage = (
  setTokensRemaining: React.Dispatch<React.SetStateAction<number>>,
  setMealLogs: React.Dispatch<React.SetStateAction<Record<string, MealLog>>>,
  setToday: React.Dispatch<React.SetStateAction<Value>>,
  setCurrentMealLogDate: React.Dispatch<React.SetStateAction<Value>>,
  setMealLogFoods: React.Dispatch<React.SetStateAction<Record<number, MealLogFood[]>>>,
  setFoods: React.Dispatch<React.SetStateAction<Record<number, Food>>>,
  setBrandedFoods: React.Dispatch<React.SetStateAction<Record<number, BrandedFood>>>
) => {
  const { setAccessToken } = useAuth();

  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


   useEffect(() => {
    const initializeMealLogsPage = async () => {
      try {
        const token = await refreshAccessToken();  

        if (!token) {
          throw new Error("No access token");
        }

        setAccessToken(token);

        const userData = await getUserFromToken(token);
        setUserData(userData);
        setTokensRemaining(
          Math.min(userData.input_tokens_remaining, userData.output_tokens_remaining)
        )

        const today = new Date();
        const normalizedToday = new Date(
          today.getFullYear(), today.getMonth(), today.getDate()
        );
        setToday(normalizedToday);
        setCurrentMealLogDate(new Date(normalizedToday));

        await loadMealLog(
          normalizedToday,
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
        navigate("/");

      } finally {
        setLoading(false);
      }
    };

    initializeMealLogsPage();
  }, [
    setAccessToken,
    navigate,
    setTokensRemaining,
    setMealLogs,
    setToday,
    setCurrentMealLogDate,
    setMealLogFoods,
    setFoods,
    setBrandedFoods
  ]);


  return { userData, loading };
};


export default useInitializeMealLogsPage;
