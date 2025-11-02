import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { type UserType } from "../../../types/app";
import {
  type WorkoutLog,
  
} from "../types/workout-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, getUserFromToken } from "../../../utils/auth";
import { loadWorkoutLog } from "../../../utils/workout-logs";


const useInitializeWorkoutLogsPage = (
  setTokensRemaining: React.Dispatch<React.SetStateAction<number>>,
  setWorkoutLogs: React.Dispatch<React.SetStateAction<Record<string, WorkoutLog>>>,
  setToday: React.Dispatch<React.SetStateAction<Value>>,
  setCurrentMealLogDate: React.Dispatch<React.SetStateAction<Value>>
) => {
  const { setAccessToken } = useAuth();

  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


   useEffect(() => {
    const initializeWorkoutLogsPage = async () => {
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

        await loadWorkoutLog(
          normalizedToday,
          setWorkoutLogs,
          token,
          [
            "workoutLogExercises",
            "workoutLogExercises.exercise",
            "workoutLogExercises.exerciseSets"
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

    initializeWorkoutLogsPage();
  }, [
    setAccessToken,
    navigate,
    setTokensRemaining,
    setWorkoutLogs,
    setToday,
    setCurrentMealLogDate,
  ]);


  return { userData, loading };
};


export default useInitializeWorkoutLogsPage;
