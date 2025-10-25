import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { type UserType } from "../../../types/app"
import {
  type MealLog,
  type MealLogFood,
  type Food,
  type BrandedFood
} from "../types/meal-logs";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, getUserFromToken } from "../../../utils/auth";
import {
  loadMealLogs,
  loadMealLogFoods,
  loadFood,
  loadBrandedFood
} from "../../../utils/meal-logs";


const useInitializeMealLogsPage = (
  setTokensRemaining: React.Dispatch<React.SetStateAction<number>>,
  setMealLogs: React.Dispatch<React.SetStateAction<Record<string, MealLog>>>,
  setToday: React.Dispatch<React.SetStateAction<string | null>>,
  setCurrentMealLogDate: React.Dispatch<React.SetStateAction<string | null>>,
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

        const loadedMealLogs = await loadMealLogs(setMealLogs, token);

        const today = new Date().toISOString().split('T')[0];
        setToday(today);
        setCurrentMealLogDate(today);

        const currentMealLog = loadedMealLogs[today];

        if (!currentMealLog) {
          return;
        }
        
        const currentMealLogId = currentMealLog.id;

        const loadedMealLogFoods = await loadMealLogFoods(
          currentMealLogId, setMealLogFoods, token
        );

        await Promise.all(
          Object.values(loadedMealLogFoods).map(mealLogFood =>
            mealLogFood.forEach((mealLogFoodObject: MealLogFood) => {
              loadFood(mealLogFoodObject.food_id, setFoods, token);
              loadBrandedFood(mealLogFoodObject.food_id, setBrandedFoods, token);
            })
          )
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
