import { useEffect } from "react";
import { type Value } from "react-calendar/dist/shared/types.js";


const useWorkoutLogsClickOutside = (
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  mealLogOptionsMenuOpen: boolean,
  setMealLogOptionsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  exerciseOptionsMenuOpenName: string,
  setExerciseOptionsMenuOpenName: React.Dispatch<React.SetStateAction<string>>,
  mealFoodOptionsMenuOpenId: number | null,
  setMealFoodOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>,
  exercisesMenuOpen: boolean,
  setExercisesMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setFoodSearch: React.Dispatch<React.SetStateAction<string>>,
  setFoodMenuInputFocused: React.Dispatch<React.SetStateAction<boolean>>,
  setEditingMealLogFoodId: React.Dispatch<React.SetStateAction<number | null>>,
  setViewFoodMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>,
  selectMealMenuOpenType: string,
  setSelectMealMenuOpenType: React.Dispatch<React.SetStateAction<string>>,
  selectServingSizeMenuOpen: boolean,
  setSelectServingSizeMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  calendarOpenType: string,
  setCalendarOpenType: React.Dispatch<React.SetStateAction<string>>,
  setCalendarDate: React.Dispatch<React.SetStateAction<Value>>,
  currentMealLogDate: Value,
  accountMenuRef: React.RefObject<HTMLDivElement | null>,
  mealLogOptionsMenuRef: React.RefObject<HTMLDivElement | null>,
  exerciseOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>,
  mealFoodOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  foodsMenuRef: React.RefObject<HTMLDivElement | null>,
  selectMealMenuRef: React.RefObject<HTMLDivElement | null>,
  selectServingSizeMenuRef: React.RefObject<HTMLDivElement | null>,
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
        exerciseOptionsMenuOpenName &&
        exerciseOptionsMenuRefs.current[exerciseOptionsMenuOpenName] &&
        target instanceof Node &&
        !exerciseOptionsMenuRefs.current[exerciseOptionsMenuOpenName].contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('exercise-options-button'))
      ) {
        setExerciseOptionsMenuOpenName('');
      }

      if (
        mealFoodOptionsMenuOpenId &&
        mealFoodOptionsMenuRefs.current[mealFoodOptionsMenuOpenId] &&
        target instanceof Node &&
        !mealFoodOptionsMenuRefs.current[mealFoodOptionsMenuOpenId].contains(target) &&
        !(target instanceof HTMLElement &&
          target.classList.contains('meal-log-food-options-button'))
      ) {
        setMealFoodOptionsMenuOpenId(null);
      }

      if (
        mealLogOptionsMenuOpen &&
        mealLogOptionsMenuRef.current &&
        target instanceof Node &&
        !mealLogOptionsMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement &&
          target.classList.contains('meal-log-options-button'))
      ) {
        setMealLogOptionsMenuOpen(false);
      }

      if (
        exercisesMenuOpen &&
        foodsMenuRef.current &&
        target instanceof Node &&
        !foodsMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('add-food-button'))
      ) {
        setExercisesMenuOpen(false);
        setFoodSearch('');
        setFoodMenuInputFocused(false);
        setEditingMealLogFoodId(null);
      }

      if (target instanceof HTMLElement && target.classList.contains('add-food-button')) {
        setViewFoodMenuOpenId(null);
      }

      if (
        selectMealMenuOpenType &&
        selectMealMenuRef.current &&
        target instanceof Node &&
        !selectMealMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('select-meal-button'))
      ) {
        setSelectMealMenuOpenType('');
      }

      if (
        selectServingSizeMenuOpen &&
        selectServingSizeMenuRef.current &&
        target instanceof Node &&
        !selectServingSizeMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('serving-size-button'))
      ) {
        setSelectServingSizeMenuOpen(false);
      }

      if (
        calendarOpenType &&
        calendarRef.current &&
        target instanceof Node &&
        !calendarRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('open-calendar-button'))
      ) {
        setCalendarOpenType('');
        if (currentMealLogDate) {
          setCalendarDate(currentMealLogDate);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    setAccountMenuOpen,
    mealLogOptionsMenuOpen,
    setMealLogOptionsMenuOpen,
    exerciseOptionsMenuOpenName,
    setExerciseOptionsMenuOpenName,
    mealFoodOptionsMenuOpenId,
    setMealFoodOptionsMenuOpenId,
    exercisesMenuOpen,
    setExercisesMenuOpen,
    setFoodSearch,
    setFoodMenuInputFocused,
    setEditingMealLogFoodId,
    setViewFoodMenuOpenId,
    selectMealMenuOpenType,
    setSelectMealMenuOpenType,
    selectServingSizeMenuOpen,
    setSelectServingSizeMenuOpen,
    calendarOpenType,
    setCalendarOpenType,
    setCalendarDate,
    currentMealLogDate,
    accountMenuRef,
    mealLogOptionsMenuRef,
    exerciseOptionsMenuRefs,
    mealFoodOptionsMenuRefs,
    foodsMenuRef,
    selectMealMenuRef,
    selectServingSizeMenuRef,
    calendarRef
  ]);
};


export default useWorkoutLogsClickOutside;
