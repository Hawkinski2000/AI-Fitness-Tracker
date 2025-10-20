import { useState, useCallback } from "react";
import { type ConversationItemType, type Chat, type ReasoningEvent } from "../types/chat";
import { useAuth } from "../../../context/auth/useAuth";
import { refreshAccessToken, isTokenExpired, getUserFromToken } from "../../../utils/auth";
import { API_BASE_URL } from "../../../config/api";


const useMessageStream = (
  setTokensRemaining: React.Dispatch<React.SetStateAction<number>>,
  conversations: Record<number, ConversationItemType[]>,
  setConversations: React.Dispatch<React.SetStateAction<Record<number, ConversationItemType[]>>>,
  chats: Chat[],
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  generatingMessageRef: React.RefObject<boolean>,
  conversationRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  userScrolledUpRef: React.RefObject<boolean>,
  handleGenerateChatTitle: (chatId: number, userMessage: string) => Promise<string>,
  scrollUserMessage: (chatId: number) => void,
  scrollToBottom: (chatId: number, behavior?: ScrollBehavior) => void
) => {
  const { accessToken, setAccessToken } = useAuth();
  
  const [isRemovingTokens, setIsRemovingTokens] = useState(false);
  const [reasoningEvents, setReasoningEvents] = useState<Record<string, ReasoningEvent>>({});
  const [callingFunctions, setCallingFunctions] = useState<Record<string, boolean>>({});  


  const updateTokensRemaining = useCallback((newTokensRemaining: number) => {
    const updateStepDurationMs = 1;
    const tokensRemovedPerStep = 10;

    setIsRemovingTokens(true);
    const intervalId = setInterval(() => {
      setTokensRemaining(prev => {
        const next = Math.max(prev - tokensRemovedPerStep, newTokensRemaining);
        if (next === newTokensRemaining) {
          clearInterval(intervalId);
          setIsRemovingTokens(false);
        }
        return next;
    });
    }, updateStepDurationMs);
  }, [setTokensRemaining]);

// ---------------------------------------------------------------------------

  const createMessageStream = useCallback(async (userMessage: string, chatId: number) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
        setAccessToken(token);
      }
      if (!token) {
        throw new Error("No access token");
      }

      generatingMessageRef.current = true;

      const firstMessage = conversations[chatId].length === 0;

      setConversations(prev => {
        const chatMessages = prev[chatId] || [];
        return {
          ...prev,
          [chatId]: [...chatMessages, { type: "user", content: userMessage }]
        };
      });

      if (firstMessage) {
        const chatIndex = chats.findIndex(chat => chat.id === chatId);
        if (chatIndex === -1) {
          return;
        }

        const newChatTitle = await handleGenerateChatTitle(chatId, userMessage);

        const updatedChats = [...chats];

        let currentTitle = "";
        let charIndex = 0;

        const intervalId = setInterval(() => {
          currentTitle += newChatTitle[charIndex];
          updatedChats[chatIndex].title = currentTitle;
          setChats([...updatedChats]);

          charIndex++;

          if (charIndex >= newChatTitle.length) {
            clearInterval(intervalId);
          }
        }, 100);
      }

      const container = conversationRefs.current[chatId];
      if (!container) {
        return;
      }
      container.style.minHeight = '';

      scrollUserMessage(chatId);
      userScrolledUpRef.current = false;

      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chat_id: chatId,
          content: userMessage,
        }),
      });

      if (!response.body) {
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) {
              continue;
            }

            const event = JSON.parse(line);

            if (event.type === "text_delta") {
              setConversations(prev => {
                const chatMessages = prev[chatId] || [];
                if (chatMessages.length > 0 &&
                    chatMessages[chatMessages.length - 1].type === "assistant") {
                  const updated = [...chatMessages];
                  const last = updated[updated.length - 1];
                  const newContent = last.content + event.delta;

                  updated[updated.length - 1] = {
                    ...last,
                    content: newContent,
                  };

                  return {
                    ...prev,
                    [chatId]: updated,
                  };
                }

                return {
                  ...prev,
                  [chatId]: [...chatMessages, { type: "assistant", content: event.delta }]
                };
              });
            } else if (event.type === "reasoning") {
              setConversations(prev => {
                const chatMessages = prev[chatId] || [];
                return {
                  ...prev,
                  [chatId]: [
                    ...chatMessages,
                    {
                      type: "reasoning",
                      content: "Thinking",
                      id: event.id
                    }
                  ]
                };
              });

              setReasoningEvents(prev => {
                return {
                  ...prev,
                  [event.id]: { active: true, startTime: event.timestamp, durationSecs: 0 }
                };
              });
            } else if (event.type === "reasoning_done") {
              setReasoningEvents(prev => {
                const prevEvent = prev[event.id];
                const startTime = prevEvent.startTime;
                return {
                  ...prev,
                  [event.id]: {
                    ...prev[event.id],
                    active: false,
                    durationSecs: event.timestamp - startTime
                  }
                };
              });
            } else if (event.type === "function_call") {
              setConversations(prev => {
                let action = '';
                let doneAction = '';

                if (event.name === 'get_meal_log_summaries') {
                  action = 'Checking meal logs';
                  doneAction = 'Found meal logs';
                } else if (event.name === 'get_meal_log_food_summaries') {
                  action = 'Checking meal log foods';
                  doneAction = 'Found meal log foods';
                } else if (event.name === 'get_workout_log_summaries') {
                  action = 'Checking workout logs';
                  doneAction = 'Found workout logs';
                } else if (event.name === 'get_workout_log_exercise_summaries') {
                  action = 'Checking workout log exercises';
                  doneAction = 'Found workout log exercises';
                } else if (event.name === 'get_sleep_log_summaries') {
                  action = 'Checking sleep logs';
                  doneAction = 'Found sleep logs';
                } else if (event.name === 'get_mood_log_summaries') {
                  action = 'Checking mood logs';
                  doneAction = 'Found mood logs';
                } else if (event.name === 'get_weight_log_summaries') {
                  action = 'Checking weight logs';
                  doneAction = 'Found weight logs';
                }

                const chatMessages = prev[chatId] || [];
                return {
                  ...prev,
                  [chatId]: [
                    ...chatMessages,
                    {
                      type: "function_call",
                      content: {
                        action,
                        doneAction
                      },
                      call_id: event.call_id
                    }
                  ]
                };
              });

              setCallingFunctions(prev => {
                return {
                  ...prev,
                  [event.call_id]: true
                };
              });

            } else if (event.type === "function_call_output") {
              setTimeout(() => {
                setCallingFunctions(prev => {
                  return {
                    ...prev,
                    [event.call_id]: false
                  };
                });
              }, 1000);
            }

            if (!userScrolledUpRef.current) {
              scrollToBottom(chatId, 'smooth');
            }
          }
        }
      }

      const userData = await getUserFromToken(token);
      updateTokensRemaining(
        Math.min(userData.input_tokens_remaining, userData.output_tokens_remaining)
      )

    } catch (err) {
      console.error(err);
      setAccessToken(null);

    } finally {
      generatingMessageRef.current = false;
    }
  }, [
    accessToken,
    setAccessToken,
    chats,
    setChats,
    conversations,
    setConversations,
    conversationRefs,
    generatingMessageRef,
    userScrolledUpRef,
    handleGenerateChatTitle,
    scrollToBottom,
    scrollUserMessage,
    updateTokensRemaining
  ]);


  return {
    isRemovingTokens,
    createMessageStream,
    reasoningEvents,
    callingFunctions
  }
};


export default useMessageStream;
