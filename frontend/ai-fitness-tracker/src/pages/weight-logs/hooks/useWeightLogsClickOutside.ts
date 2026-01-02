import { useEffect } from "react";


const useWeightLogsClickOutside = (
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  editMenuOpenId: number | null,
  setEditMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>,
  addingWeight: boolean,
  setAddingWeight: React.Dispatch<React.SetStateAction<boolean>>,
  weightEntryOptionsMenuOpenId: number | null,
  setWeightEntryOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>,
  accountMenuRef: React.RefObject<HTMLDivElement | null>,
  editMenuRef: React.RefObject<HTMLDivElement | null>,
  weightEntryOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>
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
        (editMenuOpenId || addingWeight) &&
        editMenuRef.current &&
        target instanceof Node &&
        !editMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.closest('.weight-log')) &&
        !(target instanceof HTMLElement && target.closest('.weight-log-add-button')) ||
        target instanceof HTMLElement && target.classList.contains('weight-log-options-button')
      ) {
        setEditMenuOpenId(null);
        setAddingWeight(false);
      }

      if (
        weightEntryOptionsMenuOpenId &&
        weightEntryOptionsMenuRefs.current[weightEntryOptionsMenuOpenId] &&
        target instanceof Node &&
        !weightEntryOptionsMenuRefs.current[weightEntryOptionsMenuOpenId].contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('weight-log-options-button'))
      ) {
        setWeightEntryOptionsMenuOpenId(null);
      }      
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    setAccountMenuOpen,
    editMenuOpenId,
    setEditMenuOpenId,
    addingWeight,
    setAddingWeight,
    weightEntryOptionsMenuOpenId,
    setWeightEntryOptionsMenuOpenId,
    accountMenuRef,
    editMenuRef,
    weightEntryOptionsMenuRefs
  ]);
};


export default useWeightLogsClickOutside;
