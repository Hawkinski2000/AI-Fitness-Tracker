import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../../context/auth/useAuth";
import { refreshAccessToken, logOut, getUserFromToken, isTokenExpired } from "../../utils/auth";
import { createChat, deleteChat, generateChatTitle, updateChatTitle, loadChats, loadChatHistory } from "../../utils/chats";
import ChatHistoryItem from "../../components/ChatHistoryItem";
import ConversationItem from "../../components/ConversationItem";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import closePanelIcon from '../../assets/close-panel-icon.svg';
import openPanelIcon from '../../assets/open-panel-icon.svg';
import newChatIcon from '../../assets/new-chat-icon.svg';
import searchIcon from '../../assets/search-icon.svg';
import arrowUpIcon from '../../assets/arrow-up-icon.svg';
import arrowDownIcon from '../../assets/arrow-down-icon.svg';
import './ChatPage.css';


export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string | null;
  sex?: string | null;
  age?: string | null;
  height?: string | null;
  weight?: string | null;
  goal?: string | null;
}
export interface Chat {
  id: number;
  title: string;
}
export interface FunctionCallContent {
  action?: string;
  doneAction: string;
}
export interface ReasoningEvent {
  active: boolean;
  startTime: number;
  durationSecs: number;
}
export interface ConversationItem {
  type: "user" | "assistant" | "reasoning" | "function_call";
  content: string | FunctionCallContent | ReasoningEvent;
  call_id?: string;
  id?: string;
}

export default function ChatPage() {
  const { accessToken, setAccessToken } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const chatsLoadedRef = useRef<Record<number, boolean>>({});
  
  const [conversations, setConversations] = useState<Record<number, ConversationItem[]>>({});
  const [messages, setMessages] = useState<Record<number, string>>({});

  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const [chatOptionsMenuOpenId, setChatOptionsMenuOpenId] = useState<number | null>(null);
  const chatOptionsMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [editingChatTitleId, setEditingChatTitleId] = useState<number | null>(null);
  const editingChatTitleRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [newChatTitle, setNewChatTitle] = useState<string | null>(null);

  const [expandedInputs, setExpandedInputs] = useState<Record<number, boolean>>({});
  const inputRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const inputTimeouts = useRef<Record<number, number | null>>({});

  const conversationRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const bottomRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const mainRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef(false);
  const [distanceFromBottom, setDistanceFromBottom] = useState<number>(0);
  const generatingMessageRef = useRef(false);

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  const [isRemovingTokens, setIsRemovingTokens] = useState(false);

  const [reasoningEvents, setReasoningEvents] = useState<Record<string, ReasoningEvent>>({});
  const [callingFunctions, setCallingFunctions] = useState<Record<string, boolean>>({});

  const [chatHistoryCollapsed, setChatHistoryCollapsed] = useState(false);

// ---------------------------------------------------------------------------

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
  }, [accessToken, setAccessToken]);

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
  }, [accessToken, setAccessToken, setChats, handleSelectChat]);

// ---------------------------------------------------------------------------

  const handleDeleteChat = async (chatId: number) => {
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
  };

// ---------------------------------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await refreshAccessToken();  

        if (!token) {
          throw new Error("No access token");
        }

        setAccessToken(token);

        const userData = await getUserFromToken(token);
        setUserData(userData);
        setTokensRemaining(Math.min(userData.input_tokens_remaining, userData.output_tokens_remaining))

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
        navigate("/");

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setAccessToken, handleCreateChat, navigate]);

// ---------------------------------------------------------------------------

  const scrollToBottom = (chatId: number, behavior: ScrollBehavior = "auto") => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bottomRefs.current[chatId]?.scrollIntoView({ behavior: behavior });
      });
    });
  };

// ---------------------------------------------------------------------------

  const scrollUserMessage = (chatId: number) => {
    const container = conversationRefs.current[chatId];

    if (!container) {
      return;
    }

    const viewportHeight = window.innerHeight;
    const extraSpace = viewportHeight / 2 - 100;
    container.style.minHeight = `${container.scrollHeight + extraSpace}px`;

    bottomRefs.current[chatId]?.scrollIntoView({ behavior: "smooth" });
  }

// ---------------------------------------------------------------------------

  const attachScrollListener = (element: HTMLDivElement | null) => {
  if (!element) {
    return;
  }

  mainRef.current = element;

  let lastScrollTop = element.scrollTop;

  const handleScroll = () => {
    const currentScrollTop = element.scrollTop;
    const distance = element.scrollHeight - element.clientHeight - currentScrollTop;

    if (currentScrollTop < lastScrollTop && generatingMessageRef.current) {
      userScrolledUpRef.current = true;
    } else if (currentScrollTop > lastScrollTop) {
      userScrolledUpRef.current = false;
    }

    lastScrollTop = currentScrollTop;

    setDistanceFromBottom(distance);
  };

  element.addEventListener("scroll", handleScroll);
  return () => element.removeEventListener("scroll", handleScroll);
};

// ---------------------------------------------------------------------------

  useEffect(() => {
    if (currentChatId === null) {
      return;
    }
    
    const container = conversationRefs.current[currentChatId];
    if (!container) {
      return;
    }

    container.style.minHeight = '';
  }, [currentChatId]);

// ---------------------------------------------------------------------------

  const handleGenerateChatTitle = async (chatId: number, userMessage: string) => {
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
    }
  };

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
    }, [accessToken, setAccessToken, newChatTitle, setNewChatTitle])

// ---------------------------------------------------------------------------

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
  }, [chatOptionsMenuOpenId, editingChatTitleId, handleUpdateChatTitle]);

// ---------------------------------------------------------------------------

  const updateTokensRemaining = (newTokensRemaining: number) => {
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
  };

// ---------------------------------------------------------------------------

  const handleLogOut = async () => {
    logOut();
    setAccessToken(null);
    navigate("/");
  };

// ---------------------------------------------------------------------------

  const createMessageStream = async (userMessage: string, chatId: number) => {
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
                if (chatMessages.length > 0 && chatMessages[chatMessages.length - 1].type === "assistant") {
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

            } else if (event.type === "usage") {
              const inputTokens = event.usage.input_tokens;
              const outputTokens = event.usage.output_tokens;
              const newTokensRemaining = tokensRemaining - inputTokens - outputTokens;
              updateTokensRemaining(newTokensRemaining);
            }

            if (!userScrolledUpRef.current) {
              scrollToBottom(chatId, 'smooth');
            }
          }
        }
      }

    } catch (err) {
      console.error(err);
      setAccessToken(null);

    } finally {
      generatingMessageRef.current = false;
    }
  };

// ---------------------------------------------------------------------------

  const handleSendMessage = () => {
    if (!currentChatId || !messages[currentChatId]) {
      return;
    }

    createMessageStream(messages[currentChatId], currentChatId);

    setMessages(prev => {
      return {
        ...prev,
        [currentChatId]: "",
      };
    });

    if (inputRefs.current[currentChatId]) {
      inputRefs.current[currentChatId].textContent = "";
    }

    setExpandedInputs(prev => {
      return {
        ...prev,
        [currentChatId]: false,
      };
    });
  };

// ---------------------------------------------------------------------------

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    if (!currentChatId) {
      return;
    }

    const element = event.currentTarget;
    const text = element.textContent || "";

    if (inputTimeouts.current[currentChatId]) {
      clearTimeout(inputTimeouts.current[currentChatId]);
    }
    
    inputTimeouts.current[currentChatId] = setTimeout(() => {
      setMessages(prev => {
        return {
          ...prev,
          [currentChatId]: text,
        };
      });
    }, 100);

    const MIN_HEIGHT = 56;

    if (!expandedInputs[currentChatId] && text.length > 0 && element.scrollHeight > MIN_HEIGHT) {
      setExpandedInputs(prev => {
      return {
        ...prev,
        [currentChatId]: true,
      };
    });
    } else if (expandedInputs[currentChatId] && text.length === 0) {
      setExpandedInputs(prev => {
        return {
          ...prev,
          [currentChatId]: false,
        };
      });
    }
  };

// ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className='loading-screen'>
        <PropagateLoader size={20} color="#00ffcc" />
      </div>
    );
  }

// ---------------------------------------------------------------------------

  return (
    <>
      <div className='chat-page'>

{/* ---------------------------------------------------------------------- */}
{/* ---- Header ---- */}

        <Header
          isRemovingTokens={isRemovingTokens}
          tokensRemaining={tokensRemaining}
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
          userData={userData}
          accountMenuRef={accountMenuRef}
          handleLogOut={handleLogOut}
        />

{/* ---------------------------------------------------------------------- */}

        <div className="page-body">
          <Sidebar currentPage={'chat'} />

{/* ---------------------------------------------------------------------- */}
{/* ---- Chat History ---- */}

          {!chatHistoryCollapsed ? (
            <nav className="chat-history">
              <div className="chat-history-button-container">
                <div className="chat-history-collapse-button-container">
                  <button
                  className="chat-history-collapse-button"
                  onClick={() => setChatHistoryCollapsed(true)}
                >
                  <img className="button-link-image" src={closePanelIcon} />
                </button>
                </div>
                <div className="chat-history-item">
                  <button
                    className="button-link chat-history-button-link"
                    onClick={handleCreateChat}
                  >
                    <img className="button-link-image" src={newChatIcon} />
                    New chat
                  </button>
                </div>

                <div className="chat-history-item">
                  <button
                    className="button-link chat-history-button-link"
                  >
                    <img className="button-link-image" src={searchIcon} />
                    Search chats
                  </button>
                </div>
              </div>

              <div className="chats-container">
                <div className="chat-history-text-container">Chats</div>

                {chats.map((chat) => {
                  return (
                    <ChatHistoryItem
                      chat={chat}
                      editingChatTitleId={editingChatTitleId}
                      editingChatTitleRefs={editingChatTitleRefs}
                      currentChatId={currentChatId}
                      chatOptionsMenuOpenId={chatOptionsMenuOpenId}
                      setNewChatTitle={setNewChatTitle}
                      setChatOptionsMenuOpenId={setChatOptionsMenuOpenId}
                      chatOptionsMenuRefs={chatOptionsMenuRefs}
                      setEditingChatTitleId={setEditingChatTitleId}
                      handleSelectChat={handleSelectChat}
                      handleUpdateChatTitle={handleUpdateChatTitle}
                      handleDeleteChat={handleDeleteChat}
                    />
                  );
                })}
              </div>
            </nav>
          ) : (
            <nav className="chat-history chat-history-collapsed">
              <div
                className="chat-history-collapse-button-container"
                style={{ textAlign: 'center' }}
              >
                <button
                  className="chat-history-collapse-button"
                  onClick={() => setChatHistoryCollapsed(false)}
                >
                  <img className="button-link-image" src={openPanelIcon} />
                </button>
              </div>
            </nav>
          )}
          
{/* ---------------------------------------------------------------------- */}
{/* ---- Chat ---- */}

          <main
            className={`page-main ${chatHistoryCollapsed ? 'chat-main-collapsed' : ''}`}
            style={{ transition: 'all 0.25s' }}
            ref={attachScrollListener}
          >
            <div className='chat-page-content'>
              {currentChatId !== null && (conversations[currentChatId]?.length || 0) === 0 && (
                <div>
                  <h1 className='page-heading chat-heading'>
                    Welcome
                    {userData?.first_name || userData?.username
                      ? `, ${userData.first_name || userData.username}!`
                      : " back!"}
                  </h1>
                </div>
              )}

{/* ---------------------------------------------------------------------- */}
{/* ---- Conversation ---- */}

              <div
                className="conversation-container"
                ref={el => { 
                  if (currentChatId !== null) {
                    conversationRefs.current[currentChatId] = el;
                  }
                }}
              >
                {currentChatId !== null &&
                  (conversations[currentChatId] || []).map((item, index) => {
                    return (
                      <ConversationItem
                        item={item}
                        index={index}
                        reasoningEvents={reasoningEvents}
                        callingFunctions={callingFunctions}
                      />
                    )
                  })
                }
                
                <div
                  ref={el => { 
                    if (currentChatId !== null) {
                      bottomRefs.current[currentChatId] = el;
                    }
                  }}
                />
              </div>
            
{/* ---------------------------------------------------------------------- */}
{/* ---- Message Input ---- */}

              <div
                className={
                  `message-input-container
                  ${currentChatId !== null && expandedInputs[currentChatId] ? "expanded" : ""}`
                }
                onClick={() => {
                  if (currentChatId !== null) {
                    inputRefs.current[currentChatId]?.focus()
                  }
                }}
              >
                <div
                  ref={el => { 
                    if (currentChatId !== null) {
                      inputRefs.current[currentChatId] = el;
                    }
                  }}
                  contentEditable
                  data-placeholder="How can I help you today?"
                  className="message-input"
                  onInput={handleInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                      e.preventDefault();
                    }
                  }}
                />
                <button className="send-message-button" onClick={handleSendMessage}>
                  <img className="button-link-image" src={arrowUpIcon} />
                </button>
              </div>

{/* ---------------------------------------------------------------------- */}
{/* ---- Scroll Button ---- */}

              <div className="scroll-button-container">
                <button
                  className="scroll-button"
                  onClick={() => {
                    userScrolledUpRef.current = false;
                    setDistanceFromBottom(0);
                    if (currentChatId) {
                      scrollToBottom(currentChatId, 'smooth');
                    }
                  }}
                  style={(userScrolledUpRef.current || distanceFromBottom > 100) ? undefined : { opacity: '0', pointerEvents: 'none' }}
                >
                  <img className="button-link-image" src={arrowDownIcon} />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
