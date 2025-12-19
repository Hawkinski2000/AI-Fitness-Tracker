import axios from 'axios';
import {
  type MoodLog,
  type MoodLogUpdate
} from "../pages/mood-logs/types/mood-logs";
import { type Value } from "react-calendar/dist/shared/types.js";
import { API_BASE_URL } from '../config/api';
import { getDateKey } from "./dates";


export const loadMoodLog = async (
  logDate: Value,
  setMoodLogs: React.Dispatch<React.SetStateAction<Record<string, MoodLog>>>,
  token: string,
) => {
  const date = getDateKey(logDate);
  if (!date) {
    return;
  }

  const moodLogsResponse = await axios.get(`${API_BASE_URL}/mood-logs`,
    {
      params: {
        date
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (moodLogsResponse.data.length === 0) {
    setMoodLogs({});
    return null;
  }

  const moodLogsResponseObject: MoodLog = moodLogsResponse.data[0];

  setMoodLogs(prev => ({
    ...prev,
    [date]: {
      id: moodLogsResponseObject.id,
      log_date: moodLogsResponseObject.log_date,
      mood_score: moodLogsResponseObject.mood_score
    }
  }));

  return moodLogsResponseObject;
};

export const createMoodLog = async (
  logDate: Value,
  setMoodLogs: React.Dispatch<React.SetStateAction<Record<string, MoodLog>>>,
  token: string
) => {
  const date = getDateKey(logDate);
  if (!date) {
    return;
  }

  const moodLogResponse = await axios.post(`${API_BASE_URL}/mood-logs`,
    {
      log_date: date
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const moodLog = moodLogResponse.data;

  setMoodLogs(prev => ({
    ...prev,
    [date]: moodLog
  }));

  return moodLog;
};

export const updateMoodLog = async (
  logDate: string,
  moodLogId: number,
  moodLog: MoodLogUpdate,
  setMoodLogs: React.Dispatch<React.SetStateAction<Record<string, MoodLog>>>,
  token: string
) => {
  const moodLogResponse = await axios.patch(`${API_BASE_URL}/mood-logs/${moodLogId}`,
    moodLog,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const updatedMoodLog = moodLogResponse.data;

  setMoodLogs(prev => ({
    ...prev,
    [logDate]: updatedMoodLog
  }));
};
