import { useCallback } from "react";
import {
  type WeightLog,
  type WeightLogCreate,
  // type WeightLogUpdate
} from "../types/weight-logs";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import {
  createWeightLog,
  // updateWeightLog
} from "../../../utils/weight-logs";


const useWeightLogActions = (
  // editMenuOpenId: number | null,
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


  // const handleUpdateWeightLog = useCallback(async (weightLogUpdate: WeightLogUpdate) => {
  //   try {
  //     let token: string | null = accessToken;
  //     if (!accessToken || isTokenExpired(accessToken)) {
  //       token = await refreshAccessToken();  
  //       setAccessToken(token);
  //     }
  //     if (!token) {
  //       throw new Error("No access token");
  //     }

  //     const key = Object.keys(weightLogUpdate)[0];
  //     const value = Object.values(weightLogUpdate)[0];

  //     const updatedWeightLog: WeightLogUpdate = {
  //       [key]: value
  //     };
      
  //     await updateWeightLog(
  //       editMenuOpenId,
  //       updatedWeightLog,
  //       setWeightLogs,
  //       token
  //     );

  //   } catch (err) {
  //     console.error(err);
  //     setAccessToken(null);
  //   }
  // }, [
  //   accessToken,
  //   setAccessToken,
  //   editMenuOpenId,
  //   setWeightLogs
  // ]);

  
  return {
    handleCreateWeightLog,
    // handleUpdateWeightLog
  }
};


export default useWeightLogActions;
