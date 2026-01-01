import { useCallback } from "react";
import {
  type WeightLog,
  type WeightLogCreate
} from "../types/weight-logs";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import {
  createWeightLog,
  updateWeightLog
} from "../../../utils/weight-logs";


const useWeightLogActions = (
  editMenuOpenId: number | null,
  setWeightLogs: React.Dispatch<React.SetStateAction<Record<number, WeightLog>>>
) => {
  const { accessToken, setAccessToken } = useAuth();


  const handleCreateWeightLog = useCallback(async (weightLog: WeightLogCreate) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      await createWeightLog(
        weightLog,
        setWeightLogs,
        token
      );

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    setWeightLogs
  ]);


  const handleUpdateWeightLog = useCallback(async (weightLog: WeightLogCreate) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }
      
      if (!editMenuOpenId) {
        return;
      }

      await updateWeightLog(
        editMenuOpenId,
        weightLog,
        setWeightLogs,
        token
      );

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    editMenuOpenId,
    setWeightLogs
  ]);

  
  return {
    handleCreateWeightLog,
    handleUpdateWeightLog
  }
};


export default useWeightLogActions;
