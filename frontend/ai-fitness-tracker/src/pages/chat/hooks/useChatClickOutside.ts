import { useEffect } from "react";


const useChatClickOutside = (
  chatOptionsMenuOpenId: number | null,
  setChatOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>,
  editingChatTitleId: number | null,
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  chatOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  editingChatTitleRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  accountMenuRef: React.RefObject<HTMLDivElement | null>,
  handleUpdateChatTitle: (chatId: number) => Promise<void>
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (
        chatOptionsMenuOpenId &&
        chatOptionsMenuRefs.current[chatOptionsMenuOpenId] &&
        target instanceof Node &&
        !chatOptionsMenuRefs.current[chatOptionsMenuOpenId].contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('chat-options-button'))
      ) {
        setChatOptionsMenuOpenId(null);
      }

      if (
        editingChatTitleId &&
        editingChatTitleRefs.current[editingChatTitleId] &&
        target instanceof Node &&
        !editingChatTitleRefs.current[editingChatTitleId].contains(target)
      ) {
        handleUpdateChatTitle(editingChatTitleId);
      }

      if (
        accountMenuRef.current &&
        target instanceof Node &&
        !accountMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('account-image'))
      ) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    chatOptionsMenuOpenId,
    setChatOptionsMenuOpenId,
    editingChatTitleId,
    setAccountMenuOpen,
    chatOptionsMenuRefs,
    editingChatTitleRefs,
    accountMenuRef,
    handleUpdateChatTitle
  ]);
};


export default useChatClickOutside;
