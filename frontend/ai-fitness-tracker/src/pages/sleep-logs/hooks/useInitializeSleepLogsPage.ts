import { useState, useEffect } from "react";
import { type SleepLog } from "../types/sleep-logs";
import { useNavigate } from 'react-router-dom';
import { type UserType } from "../../../types/app";
import { type Value } from "react-calendar/dist/shared/types.js";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, getUserFromToken } from "../../../utils/auth";
import { loadSleepLog } from "../../../utils/sleep-logs";


const useInitializeSleepLogsPage = (
  setTokensRemaining: React.Dispatch<React.SetStateAction<number>>,
  setSleepLogs: React.Dispatch<React.SetStateAction<Record<string, SleepLog>>>,
  setToday: React.Dispatch<React.SetStateAction<Value>>,
  setCurrentSleepLogDate: React.Dispatch<React.SetStateAction<Value>>
) => {
  const { setAccessToken } = useAuth();

  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


   useEffect(() => {
    const initializeSleepLogsPage = async () => {
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
        setCurrentSleepLogDate(new Date(normalizedToday));

        await loadSleepLog(
          normalizedToday,
          setSleepLogs,
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

    initializeSleepLogsPage();
  }, [
    setAccessToken,
    navigate,
    setTokensRemaining,
    setSleepLogs,
    setToday,
    setCurrentSleepLogDate,
  ]);


  return { userData, loading };
};


export default useInitializeSleepLogsPage;
