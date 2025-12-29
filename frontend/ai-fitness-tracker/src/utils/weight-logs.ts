import axios from 'axios';
import {
  type WeightLog,
  // type WeightLogUpdate
} from "../pages/weight-logs/types/weight-logs";
import { API_BASE_URL } from '../config/api';


export const loadWeightLogs = async (
  setWeightLogs: React.Dispatch<React.SetStateAction<Record<number, WeightLog>>>,
  token: string,
) => {
  const weightLogsResponse = await axios.get(`${API_BASE_URL}/weight-logs`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (weightLogsResponse.data.length === 0) {
    setWeightLogs({});
    return null;
  }

  const weightLogsObjects: Record<number, WeightLog> = {};
  weightLogsResponse.data.forEach((weightLog: WeightLog) => {
    weightLogsObjects[weightLog.id] = {
      id: weightLog.id,
      log_date: weightLog.log_date,
      weight: weightLog.weight,
      unit: weightLog.unit
    };
  });

  setWeightLogs(weightLogsObjects);

  return weightLogsObjects;
};

// export const createMoodLog = async (
//   logDate: Value,
//   setMoodLogs: React.Dispatch<React.SetStateAction<Record<string, MoodLog>>>,
//   token: string
// ) => {
//   const date = getDateKey(logDate);
//   if (!date) {
//     return;
//   }

//   const moodLogResponse = await axios.post(`${API_BASE_URL}/mood-logs`,
//     {
//       log_date: date
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );
//   const moodLog = moodLogResponse.data;

//   setMoodLogs(prev => ({
//     ...prev,
//     [date]: moodLog
//   }));

//   return moodLog;
// };

// export const updateMoodLog = async (
//   logDate: string,
//   moodLogId: number,
//   moodLog: MoodLogUpdate,
//   setMoodLogs: React.Dispatch<React.SetStateAction<Record<string, MoodLog>>>,
//   token: string
// ) => {
//   const moodLogResponse = await axios.patch(`${API_BASE_URL}/mood-logs/${moodLogId}`,
//     moodLog,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   );
//   const updatedMoodLog = moodLogResponse.data;

//   setMoodLogs(prev => ({
//     ...prev,
//     [logDate]: updatedMoodLog
//   }));
// };
