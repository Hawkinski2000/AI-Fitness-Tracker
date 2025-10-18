import { useState, useCallback } from "react";
import { type Chat, type ConversationItemType } from "../types/chat";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import {
  loadChatHistory,
  createChat,
  deleteChat,
  generateChatTitle,
  updateChatTitle
} from "../utils/chat";


const useChatActions = (
  chats: Chat[],
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>,
  setConversations: React.Dispatch<React.SetStateAction<Record<number, ConversationItemType[]>>>,
  setDistanceFromBottom: React.Dispatch<React.SetStateAction<number>>,
  setEditingChatTitleId: React.Dispatch<React.SetStateAction<number | null>>,
  chatsLoadedRef: React.RefObject<Record<number, boolean>>,
  conversationRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  userScrolledUpRef: React.RefObject<boolean>,
  editingChatTitleRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  scrollToBottom: (chatId: number, behavior?: ScrollBehavior) => void,
) => {
  const { accessToken, setAccessToken } = useAuth();

  const [newChatTitle, setNewChatTitle] = useState<string | null>(null);


  const handleSelectChat = useCallback(async (chatId: number) => {
    userScrolledUpRef.current = false;
    setDistanceFromBottom(0);

    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      setCurrentChatId(chatId);

      if (!chatsLoadedRef.current[chatId]) {
        await loadChatHistory(chatId, setConversations, token);
        chatsLoadedRef.current[chatId] = true;
      }

      scrollToBottom(chatId);

      const container = conversationRefs.current[chatId];
      if (!container) {
        return;
      }
      container.style.minHeight = '';

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    setCurrentChatId,
    setConversations,
    setDistanceFromBottom,
    chatsLoadedRef,
    conversationRefs,
    userScrolledUpRef,
    scrollToBottom
  ]);

// ---------------------------------------------------------------------------

  const handleCreateChat = useCallback(async () => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      const newChat = await createChat(setChats, token);

      const chatId = newChat.id;
      setCurrentChatId(chatId);
      handleSelectChat(chatId);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    setChats,
    setCurrentChatId,
    handleSelectChat
  ]);

// ---------------------------------------------------------------------------

  const handleDeleteChat = useCallback(async (chatId: number) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      const newChats = chats.filter(chat => chat.id !== chatId);

      await deleteChat(chatId, setChats, token);

      setConversations(prevConversations => {
        const updated = { ...prevConversations };
        delete updated[chatId];
        return updated;
      });

      if (newChats.length === 0) {
        handleCreateChat();
        return;
      }

      const newCurrentChatId = newChats[0].id;
      setCurrentChatId(newCurrentChatId);
      handleSelectChat(newCurrentChatId);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    chats,
    setChats,
    setCurrentChatId,
    setConversations,
    handleCreateChat,
    handleSelectChat,
  ]);

// ---------------------------------------------------------------------------

  const handleGenerateChatTitle = useCallback(async (chatId: number, userMessage: string) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      const newChatTitle = await generateChatTitle(chatId, userMessage, token);
      return newChatTitle;

    } catch (err) {
      console.error(err);
      setAccessToken(null);
      return "New chat";
    }
  }, [accessToken, setAccessToken]);

// ---------------------------------------------------------------------------

  const handleUpdateChatTitle = useCallback(async (chatId: number) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      const element = editingChatTitleRefs.current[chatId];
      if (!element) {
        return;
      }
      const title = element.querySelector<HTMLElement>('.chat-title');
      if (title) {
        const range = document.createRange();
        range.setStart(title, 0);
        range.collapse(true);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

        title.scrollLeft = 0;
      }
      setEditingChatTitleId(null);

      await updateChatTitle(chatId, newChatTitle, token);

      setNewChatTitle(null);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [
    accessToken,
    setAccessToken,
    newChatTitle,
    setNewChatTitle,
    setEditingChatTitleId,
    editingChatTitleRefs
  ]);


  return {
    handleSelectChat,
    handleCreateChat,
    handleDeleteChat,
    handleGenerateChatTitle,
    handleUpdateChatTitle,
    setNewChatTitle
  };
};


export default useChatActions;
