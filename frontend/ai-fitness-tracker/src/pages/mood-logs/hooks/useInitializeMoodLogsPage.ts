import { useState, useEffect } from "react";
import { type MoodLog } from "../types/mood-logs";
import { useNavigate } from 'react-router-dom';
import { type UserType } from "../../../types/app";
import { type Value } from "react-calendar/dist/shared/types.js";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, getUserFromToken } from "../../../utils/auth";
import { loadMoodLog } from "../../../utils/mood-logs";


const useInitializeMoodLogsPage = (
  setTokensRemaining: React.Dispatch<React.SetStateAction<number>>,
  setMoodLogs: React.Dispatch<React.SetStateAction<Record<string, MoodLog>>>,
  setToday: React.Dispatch<React.SetStateAction<Value>>,
  setCurrentMoodLogDate: React.Dispatch<React.SetStateAction<Value>>
) => {
  const { setAccessToken } = useAuth();

  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


   useEffect(() => {
    const initializeMoodLogsPage = async () => {
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
        setCurrentMoodLogDate(new Date(normalizedToday));

        await loadMoodLog(
          normalizedToday,
          setMoodLogs,
          token
        )

      } catch (err) {
        console.error(err);
        setAccessToken(null);
        navigate("/");

      } finally {
        setLoading(false);
      }
    };

    initializeMoodLogsPage();
  }, [
    setAccessToken,
    navigate,
    setTokensRemaining,
    setMoodLogs,
    setToday,
    setCurrentMoodLogDate,
  ]);


  return { userData, loading };
};


export default useInitializeMoodLogsPage;
