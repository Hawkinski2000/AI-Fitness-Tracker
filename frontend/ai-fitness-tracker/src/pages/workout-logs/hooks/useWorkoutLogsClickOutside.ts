import { useEffect } from "react";
import { type Value } from "react-calendar/dist/shared/types.js";


const useWorkoutLogsClickOutside = (
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  workoutLogOptionsMenuOpen: boolean,
  setWorkoutLogOptionsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  exerciseOptionsMenuOpenId: number | null,
  setExerciseOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>,
  exercisesMenuOpen: boolean,
  setExercisesMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setExerciseSearch: React.Dispatch<React.SetStateAction<string>>,
  setExercisesMenuInputFocused: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingWorkoutLogExerciseId: React.Dispatch<React.SetStateAction<number | null>>,
  setViewExerciseMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>,
  selectedExerciseSetId: number | null,
  setSelectedExerciseSetId: React.Dispatch<React.SetStateAction<number | null>>,
  calendarOpenType: string,
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>,
  currentWorkoutLogDate: Value,
  accountMenuRef: React.RefObject<HTMLDivElement | null>,
  workoutLogOptionsMenuRef: React.RefObject<HTMLDivElement | null>,
  exerciseOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
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
        exerciseOptionsMenuOpenId &&
        exerciseOptionsMenuRefs.current[exerciseOptionsMenuOpenId] &&
        target instanceof Node &&
        !exerciseOptionsMenuRefs.current[exerciseOptionsMenuOpenId].contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('exercise-options-button'))
      ) {
        setExerciseOptionsMenuOpenId(null);
      }

      if (
        workoutLogOptionsMenuOpen &&
        workoutLogOptionsMenuRef.current &&
        target instanceof Node &&
        !workoutLogOptionsMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement &&
          target.classList.contains('workout-log-options-button'))
      ) {
        setWorkoutLogOptionsMenuOpen(false);
      }

      if (
        exercisesMenuOpen &&
        target instanceof Node &&
        !(target instanceof HTMLElement && target.classList.contains('exercise-section')) &&
        !(target instanceof HTMLElement && target.classList.contains('workout-log-add-button')) &&
        !(target instanceof HTMLElement && target.closest('.exercises-menu'))
      ) {
        setExercisesMenuOpen(false);
        setExerciseSearch('');
        setExercisesMenuInputFocused(false);
        setViewExerciseMenuOpenId(null);
      }

      if (
        selectedExerciseSetId &&
        target instanceof Node &&
        !(target instanceof HTMLElement && target.closest('.view-exercise-menu-set')) &&
        (
          !(target instanceof HTMLElement && target.classList.contains('.view-exercise-menu-section-content')) ||
          !(target instanceof HTMLElement && target.closest('.view-exercise-menu-section-content')) ||
          (target instanceof HTMLElement && target.closest('.view-exercise-menu-sets-header'))
        ) &&
        !(target instanceof HTMLElement && target.classList.contains('view-exercise-menu-text-button')) &&
        !(target instanceof HTMLElement && target.classList.contains('view-exercise-menu-input'))
      ) {
        setSelectedExerciseSetId(null);
      }

      if (
        calendarOpenType &&
        calendarRef.current &&
        target instanceof Node &&
        !calendarRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('open-calendar-button'))
      ) {
        setCalendarOpenType('');
        if (currentWorkoutLogDate) {
          setCalendarDate(currentWorkoutLogDate);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    setAccountMenuOpen,
    workoutLogOptionsMenuOpen,
    setWorkoutLogOptionsMenuOpen,
    exerciseOptionsMenuOpenId,
    setExerciseOptionsMenuOpenId,
    exercisesMenuOpen,
    setExercisesMenuOpen,
    setExerciseSearch,
    setExercisesMenuInputFocused,
    setEditingWorkoutLogExerciseId,
    setViewExerciseMenuOpenId,
    setSelectedExerciseSetId,
    selectedExerciseSetId,
    calendarOpenType,
    setCalendarOpenType,
    setCalendarDate,
    currentWorkoutLogDate,
    accountMenuRef,
    workoutLogOptionsMenuRef,
    exerciseOptionsMenuRefs,
    calendarRef
  ]);
};


export default useWorkoutLogsClickOutside;
