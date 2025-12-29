import { useState, useEffect } from "react";
import { type WeightLog } from "../types/weight-logs";
import { useNavigate } from 'react-router-dom';
import { type UserType } from "../../../types/app";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, getUserFromToken } from "../../../utils/auth";
import { loadWeightLogs } from "../../../utils/weight-logs";


const useInitializeWeightLogsPage = (
  setTokensRemaining: React.Dispatch<React.SetStateAction<number>>,
  setWeightLogs: React.Dispatch<React.SetStateAction<Record<number, WeightLog>>>
) => {
  const { setAccessToken } = useAuth();

  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


   useEffect(() => {
    const initializeWeightLogsPage = async () => {
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

        await loadWeightLogs(
          setWeightLogs,
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

    initializeWeightLogsPage();
  }, [
    setAccessToken,
    navigate,
    setTokensRemaining,
    setWeightLogs
  ]);


  return { userData, loading };
};


export default useInitializeWeightLogsPage;
