import axios from 'axios';
import {
  type SleepLog,
  type SleepLogUpdate
} from "../pages/sleep-logs/types/sleep-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { API_BASE_URL } from '../config/api';
import { getDateKey } from "./dates";


export const loadSleepLog = async (
  logDate: Value,
  setSleepLogs: React.Dispatch<React.SetStateAction<Record<string, SleepLog>>>,
  token: string,
) => {
  const date = getDateKey(logDate);
  if (!date) {
    return;
  }

  const sleepLogsResponse = await axios.get(`${API_BASE_URL}/sleep-logs`,
    {
      params: {
        date
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (sleepLogsResponse.data.length === 0) {
    setSleepLogs({});
    return null;
  }

  const sleepLogsResponseObject: SleepLog = sleepLogsResponse.data[0];

  setSleepLogs(prev => ({
    ...prev,
    [date]: {
      id: sleepLogsResponseObject.id,
      log_date: sleepLogsResponseObject.log_date,
      time_to_bed: sleepLogsResponseObject.time_to_bed,
      time_awake: sleepLogsResponseObject.time_awake,
      duration: sleepLogsResponseObject.duration,
      sleep_score: sleepLogsResponseObject.sleep_score
    }
  }));

  return sleepLogsResponseObject;
};

export const createSleepLog = async (
  logDate: Value,
  setSleepLogs: React.Dispatch<React.SetStateAction<Record<string, SleepLog>>>,
  token: string
) => {
  const date = getDateKey(logDate);
  if (!date) {
    return;
  }

  const sleepLogResponse = await axios.post(`${API_BASE_URL}/sleep-logs`,
    {
      log_date: date
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const sleepLog = sleepLogResponse.data;

  setSleepLogs(prev => ({
    ...prev,
    [date]: sleepLog
  }));

  return sleepLog;
};

export const updateSleepLog = async (
  logDate: string,
  sleepLogId: number,
  sleepLog: SleepLogUpdate,
  setSleepLogs: React.Dispatch<React.SetStateAction<Record<string, SleepLog>>>,
  token: string
) => {
  const sleepLogResponse = await axios.patch(`${API_BASE_URL}/sleep-logs/${sleepLogId}`,
    sleepLog,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const updatedSleepLog = sleepLogResponse.data;

  setSleepLogs(prev => ({
    ...prev,
    [logDate]: updatedSleepLog
  }));
};
