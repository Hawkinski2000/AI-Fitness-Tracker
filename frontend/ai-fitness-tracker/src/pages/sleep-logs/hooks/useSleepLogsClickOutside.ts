import { useEffect } from "react";
import { Dayjs } from "dayjs";
import { type Value } from "react-calendar/dist/shared/types.js";


const useSleepLogsClickOutside = (
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  editMenuOpenType: string,
  setEditMenuOpenType: React.Dispatch<React.SetStateAction<string>>,
  changeDateMenuOpen: boolean,
  setChangeDateMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  calendarOpenType: string,
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>,
  currentSleepLogDate: Value,
  timeAsleepDate: string | null,
  yesterdayDate: string | null,
  setDate: React.Dispatch<React.SetStateAction<string | null>>,
  setTime: React.Dispatch<React.SetStateAction<Dayjs | null>>,
  setSleepScore: React.Dispatch<React.SetStateAction<number>>,
  accountMenuRef: React.RefObject<HTMLDivElement | null>,
  editMenuRef: React.RefObject<HTMLDivElement | null>,
  changeDateMenuRef: React.RefObject<HTMLDivElement | null>,
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
        !editMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('sleep-log-text-button'))
      ) {
        setEditMenuOpenType('');
        setTime(null);
        setSleepScore(0);
        setDate(timeAsleepDate || yesterdayDate);
      }

      if (
        changeDateMenuOpen &&
        changeDateMenuRef.current &&
        target instanceof Node &&
        !changeDateMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('open-change-date-menu-button'))
      ) {
        setChangeDateMenuOpen(false);
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
    changeDateMenuOpen,
    setChangeDateMenuOpen,
    timeAsleepDate,
    yesterdayDate,
    setDate,
    setTime,
    setSleepScore,
    calendarOpenType,
    setCalendarOpenType,
    setCalendarDate,
    currentSleepLogDate,
    accountMenuRef,
    editMenuRef,
    changeDateMenuRef,
    calendarRef
  ]);
};


export default useSleepLogsClickOutside;
