import { type Value } from "react-calendar/dist/shared/types.js";


export const getDateKey = (date: Value) => {
  if (!date) {
    return null;
  }
  
  let dateObject: Value;
  if (Array.isArray(date)) {
    dateObject = date[0];
  } else {
    dateObject = date;
  }
  if (!dateObject) {
    return null;
  }
  
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export const normalizeDate = (date: Value) => {
  if (!date) {
    return null;
  }
  
  let dateObject: Value;
  if (Array.isArray(date)) {
    dateObject = date[0];
  } else {
    dateObject = date;
  }
  if (!dateObject) {
    return null;
  }
  
  const normalizedDate = new Date(
    dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate()
  );
  return normalizedDate;
};
