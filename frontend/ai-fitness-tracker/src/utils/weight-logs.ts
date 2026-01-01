import axios from 'axios';
import {
  type WeightLog,
  type WeightLogCreate
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

export const createWeightLog = async (
  weightLog: WeightLogCreate,
  setWeightLogs: React.Dispatch<React.SetStateAction<Record<number, WeightLog>>>,
  token: string
) => {
  const weightLogResponse = await axios.post(`${API_BASE_URL}/weight-logs`,
    weightLog,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const newWeightLog: WeightLog = weightLogResponse.data;

  setWeightLogs(prev => ({
    ...prev,
    [newWeightLog.id]: newWeightLog
  }));

  return newWeightLog;
};

export const updateWeightLog = async (
  editMenuOpenId: number,
  weightLog: WeightLogCreate,
  setWeightLogs: React.Dispatch<React.SetStateAction<Record<number, WeightLog>>>,
  token: string
) => {
  const weightLogResponse = await axios.put(`${API_BASE_URL}/weight-logs/${editMenuOpenId}`,
    weightLog,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const updatedWeightLog = weightLogResponse.data;

  setWeightLogs(prev => ({
    ...prev,
    [editMenuOpenId]: updatedWeightLog
  }));
};


