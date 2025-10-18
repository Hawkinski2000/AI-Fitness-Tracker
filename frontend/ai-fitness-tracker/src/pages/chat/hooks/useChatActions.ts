import { useCallback } from "react";
import { refreshAccessToken, isTokenExpired } from "../../../utils/auth";
import { type Chat, type ConversationItemType } from "../types/chat";
import { loadChatHistory, createChat, deleteChat } from "../utils/chat";


const useChatActions = (
  accessToken: string | null,
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>,
  chats: Chat[],
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>,
  setConversations: React.Dispatch<React.SetStateAction<Record<number, ConversationItemType[]>>>,
  setDistanceFromBottom: React.Dispatch<React.SetStateAction<number>>,
  chatsLoadedRef: React.RefObject<Record<number, boolean>>,
  conversationRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  userScrolledUpRef: React.RefObject<boolean>,
  scrollToBottom: (chatId: number, behavior?: ScrollBehavior) => void
) => {
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


  return { handleSelectChat, handleCreateChat, handleDeleteChat };
};


export default useChatActions;
