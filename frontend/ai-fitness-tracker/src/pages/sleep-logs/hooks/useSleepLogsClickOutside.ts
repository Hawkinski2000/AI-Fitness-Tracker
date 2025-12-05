import { useEffect } from "react";
import { Dayjs } from "dayjs";
import { type Value } from "react-calendar/dist/shared/types.js";


const useSleepLogsClickOutside = (
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  editMenuOpenType: string,
  setEditMenuOpenType: React.Dispatch<React.SetStateAction<string>>,
  calendarOpenType: string,
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>,
  currentSleepLogDate: Value,
  setTime: React.Dispatch<React.SetStateAction<Dayjs | null>>,
  accountMenuRef: React.RefObject<HTMLDivElement | null>,
  editMenuRef: React.RefObject<HTMLDivElement | null>,
  calendarRef: React.RefObject<HTMLDivElement | null>
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (
        accountMenuRef.current &&
        target instanceof Node &&
        !accountMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('account-image'))
      ) {
        setAccountMenuOpen(false);
      }

      if (
        editMenuOpenType &&
        editMenuRef.current &&
        target instanceof Node &&
        !editMenuRef.current.contains(target)
      ) {
        setEditMenuOpenType('');
        setTime(null);
      }

      if (
        calendarOpenType &&
        calendarRef.current &&
        target instanceof Node &&
        !calendarRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('open-calendar-button'))
      ) {
        setCalendarOpenType('');
        if (currentSleepLogDate) {
          setCalendarDate(currentSleepLogDate);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    setAccountMenuOpen,
    editMenuOpenType,
    setEditMenuOpenType,
    setTime,
    calendarOpenType,
    setCalendarOpenType,
    setCalendarDate,
    currentSleepLogDate,
    accountMenuRef,
    editMenuRef,
    calendarRef
  ]);
};


export default useSleepLogsClickOutside;
