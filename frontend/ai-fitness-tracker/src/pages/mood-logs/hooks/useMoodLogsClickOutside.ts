import { useEffect } from "react";
import { type Value } from "react-calendar/dist/shared/types.js";


const useMoodLogsClickOutside = (
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  editMenuOpenType: string,
  setEditMenuOpenType: React.Dispatch<React.SetStateAction<string>>,
  calendarOpenType: string,
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>,
  currentMoodLogDate: Value,
  setMoodScore: React.Dispatch<React.SetStateAction<number>>,
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
        !editMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('mood-log-text-button'))
      ) {
        setEditMenuOpenType('');
        setMoodScore(0);
      }

      if (
        calendarOpenType &&
        calendarRef.current &&
        target instanceof Node &&
        !calendarRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('open-calendar-button'))
      ) {
        setCalendarOpenType('');
        if (currentMoodLogDate) {
          setCalendarDate(currentMoodLogDate);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    setAccountMenuOpen,
    editMenuOpenType,
    setEditMenuOpenType,
    setMoodScore,
    calendarOpenType,
    setCalendarOpenType,
    setCalendarDate,
    currentMoodLogDate,
    accountMenuRef,
    editMenuRef,
    calendarRef
  ]);
};


export default useMoodLogsClickOutside;
