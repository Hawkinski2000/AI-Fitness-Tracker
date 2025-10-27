import { useEffect } from "react";
import { type Value } from "react-calendar/dist/shared/types.js";


const useMealLogsClickOutside = (
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  mealOptionsMenuOpenType: string,
  setMealOptionsMenuOpenType: React.Dispatch<React.SetStateAction<string>>,
  mealFoodOptionsMenuOpenId: number | null,
  setMealFoodOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>,
  foodsMenuOpenMealType: string,
  setFoodsMenuOpenMealType: React.Dispatch<React.SetStateAction<string>>,
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
  accountMenuRef: React.RefObject<HTMLDivElement | null>,
  mealOptionsMenuRefs: React.RefObject<Record<string, HTMLDivElement | null>>,
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
        mealOptionsMenuOpenType &&
        mealOptionsMenuRefs.current[mealOptionsMenuOpenType] &&
        target instanceof Node &&
        !mealOptionsMenuRefs.current[mealOptionsMenuOpenType].contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('meal-options-button'))
      ) {
        setMealOptionsMenuOpenType('');
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
        foodsMenuOpenMealType &&
        foodsMenuRef.current &&
        target instanceof Node &&
        !foodsMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('add-food-button'))
      ) {
        setFoodsMenuOpenMealType('');
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
        setCalendarDate(new Date());
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    setAccountMenuOpen,
    mealOptionsMenuOpenType,
    setMealOptionsMenuOpenType,
    mealFoodOptionsMenuOpenId,
    setMealFoodOptionsMenuOpenId,
    foodsMenuOpenMealType,
    setFoodsMenuOpenMealType,
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
    accountMenuRef,
    mealOptionsMenuRefs,
    mealFoodOptionsMenuRefs,
    foodsMenuRef,
    selectMealMenuRef,
    selectServingSizeMenuRef,
    calendarRef
  ]);
};


export default useMealLogsClickOutside;
