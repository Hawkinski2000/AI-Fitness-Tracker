import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { type UserType } from "../../../types/app"
import { type Chat, type ConversationItemType } from "../types/chat";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, getUserFromToken, isTokenExpired } from "../../../utils/auth";
import { loadChats, loadChatHistory } from "../utils/chat";


const useInitializeChatPage = (
  setTokensRemaining: React.Dispatch<React.SetStateAction<number>>,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>,
  setConversations: React.Dispatch<React.SetStateAction<Record<number, ConversationItemType[]>>>,
  chatsLoadedRef: React.RefObject<Record<number, boolean>>,
  scrollToBottom: (chatId: number, behavior?: ScrollBehavior) => void,
  handleCreateChat: () => Promise<void>,
) => {
  const { accessToken, setAccessToken } = useAuth();

  const [userData, setUserData] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {
    const initializeChatPage = async () => {
      try {
        let token: string | null = accessToken;
        
        if (!accessToken || (accessToken && isTokenExpired(accessToken))) {
          token = await refreshAccessToken();
          if (token) {
            setAccessToken(token);
          }
        }

        if (!token) {
          throw new Error("No access token");
        }

        const userData = await getUserFromToken(token);
        setUserData(userData);
        setTokensRemaining(
          Math.min(userData.input_tokens_remaining, userData.output_tokens_remaining)
        )

        const loadedChats = await loadChats(setChats, token);

        if (loadedChats.length > 0) {
          const mostRecentChat = loadedChats[0];
          const chatId = mostRecentChat.id;
          setCurrentChatId(chatId);

          await loadChatHistory(chatId, setConversations, token);
          chatsLoadedRef.current[chatId] = true;

          scrollToBottom(chatId);
        }
        else {
          handleCreateChat();
        }

      } catch (err) {
        console.error(err);
        setAccessToken(null);
        console.log("Navigating back to HomePage");
        navigate("/");

      } finally {
        setLoading(false);
      }
    };

    initializeChatPage();
    }, [
      accessToken,
      setAccessToken,
      setUserData,
      setTokensRemaining,
      setChats,
      setCurrentChatId,
      setConversations,
      setLoading,
      chatsLoadedRef,
      handleCreateChat,
      scrollToBottom,
      navigate
    ]);

    
  return { userData, loading };
};


export default useInitializeChatPage;
