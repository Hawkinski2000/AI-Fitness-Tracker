import axios from 'axios';
import { type MealLog } from "../pages/meal-logs/MealLogsPage";
import { API_BASE_URL } from '../config/api';


export const loadMealLogs = async (setMealLogs: React.Dispatch<React.SetStateAction<Record<string, MealLog>>>,
                                   token: string) => {
  const mealLogsResponse = await axios.get(`${API_BASE_URL}/meal-logs`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (mealLogsResponse.data.length === 0) {
    return []
  }
  
  const mealLogs: MealLog[] = [];
  mealLogsResponse.data.forEach((mealLog: MealLog) => {
    const logDate = mealLog.log_date.split('T')[0];
    const mealLogObject = {id: mealLog.id, log_date: logDate, total_calories: mealLog.total_calories || null};

    mealLogs.push(mealLogObject);

    setMealLogs(prev => ({
      ...prev,
      [logDate]: mealLogObject
    }));
  });

  return mealLogs;
};
