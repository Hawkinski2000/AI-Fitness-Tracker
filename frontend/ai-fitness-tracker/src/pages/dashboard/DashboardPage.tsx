import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown';
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../../context/auth/useAuth";
import { refreshAccessToken, getUserFromToken, isTokenExpired } from "../../utils/auth";
import { createChat, loadChats, loadChatHistory } from "../../utils/chats";
import './DashboardPage.css';


interface User {
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
export interface ConversationItem {
  type: "user" | "assistant" | "reasoning" | "function_call";
  content: string;
}
export default function DashboardPage() {  
  const { accessToken, setAccessToken } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  const [conversations, setConversations] = useState<Record<number, ConversationItem[]>>({});
  const [messages, setMessages] = useState<Record<number, string>>({});
  const [expandedInputs, setExpandedInputs] = useState<Record<number, boolean>>({});
  const inputRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const inputTimeouts = useRef<Record<number, number | null>>({});
  const bottomRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const conversationRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const [chatHistoryCollapsed, setChatHistoryCollapsed] = useState(false);

  const handleSelectChat = useCallback(async (chatId: number) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
      }
      if (!token) {
        throw new Error("No access token");
      }
      setAccessToken(token);
      setCurrentChatId(chatId);
      await loadChatHistory(chatId, setConversations, token);

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

  const handleCreateChat = useCallback(async () => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
      }
      if (!token) {
        throw new Error("No access token");
      }
      setAccessToken(token);

      const newChat = await createChat(setChats, token);

      const chatId = newChat.id;
      setCurrentChatId(chatId);
      handleSelectChat(chatId);

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }, [accessToken, setAccessToken, setChats, handleSelectChat]);

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

        const loadedChats = await loadChats(setChats, token);

        if (loadedChats.length > 0) {
          const mostRecentChat = loadedChats[0];
          setCurrentChatId(mostRecentChat.id);
          await loadChatHistory(mostRecentChat.id, setConversations, token);
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

   useEffect(() => {
    if (currentChatId !== null) {
      bottomRefs.current[currentChatId]?.scrollIntoView({ behavior: "smooth" });
    }
    }, [currentChatId, conversations]);

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

  const createMessageStream = async (userMessage: string, chatId: number) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
      }
      if (!token) {
        throw new Error("No access token");
      }
      setAccessToken(token);

      setConversations(prev => {
        const chatMessages = prev[chatId] || [];
        return {
          ...prev,
          [chatId]: [...chatMessages, { type: "user", content: userMessage }]
        };
      });

      const container = conversationRefs.current[chatId];
      if (!container) {
        return;
      }
      container.style.minHeight = '';
      scrollUserMessage(chatId);

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
                  [chatId]: [...chatMessages, { type: "reasoning", content: "Reasoning..." }]
                };
              });
            } else if (event.type === "function_call") {
              setConversations(prev => {
                const chatMessages = prev[chatId] || [];
                return {
                  ...prev,
                  [chatId]: [...chatMessages, { type: "function_call", content: `Calling ${event.name}...` }]
                };
              });
            }
          }
        }
      }

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  };

  const handleSendMessage = () => {
    if (!currentChatId || !accessToken || !messages[currentChatId]) {
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

  if (loading) {
    return (
      <div className='loading-screen'>
         <PropagateLoader size={20} color="#00ffcc" />
      </div>
    );
  }

  return (
    <>
      <div className='dashboard-page'>
        <header className='page-header'></header>
        
        <div className="page-body">
          <nav className="sidebar">
            <button className="button-link sidebar-button-link">Dashboard</button>
            <button className="button-link sidebar-button-link">Meal Logs</button>
            <button className="button-link sidebar-button-link">Workout Logs</button>
            <button className="button-link sidebar-button-link">Sleep Logs</button>
            <button className="button-link sidebar-button-link">Mood Logs</button>
          </nav>

          {!chatHistoryCollapsed ? (
            <nav className="chat-history">
              <div className="chat-history-button-container">
                <div className="chat-history-collapse-button-container">
                  <button
                  className="chat-history-collapse-button"
                  onClick={() => setChatHistoryCollapsed(true)}
                >
                  {'<'}
                </button>
                </div>
                <button
                  className="button-link chat-history-button-link"
                  onClick={handleCreateChat}
                >
                  New chat
                </button>
                <button className="button-link chat-history-button-link">Search chats</button>
              </div>

              <div className="chats-container">
                <div className="chat-history-text-container">Chats</div>

                {chats.map((chat) => {
                  return (
                    <button
                      key={chat.id}
                      className={`
                        button-link
                        chat-history-button-link
                        ${chat.id === currentChatId ? 'chat-history-button-link-selected' : ''}
                      `}
                      onClick={() => handleSelectChat(chat.id)}
                      disabled={chat.id === currentChatId}
                    >
                      {chat.title}
                    </button>
                  )
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
                  {'>'}
                </button>
              </div>
            </nav>
          )}
          
          <main
            className={`page-main ${chatHistoryCollapsed ? 'dashboard-main-collapsed' : ''}`}
            style={{ transition: 'all 0.25s' }}
          >
            <div className='dashboard-page-content'>
              {currentChatId !== null && (conversations[currentChatId]?.length || 0) === 0 && (
                <div>
                  <h1 className='page-heading dashboard-heading'>
                    Welcome
                    {userData?.first_name || userData?.username
                      ? `, ${userData.first_name || userData.username}!`
                      : " back!"}
                  </h1>
                </div>
              )}

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
                    if (item.type === "user") {
                      return (
                        <div
                          key={index}
                          className="user-message-container"
                        >
                          {item.content}
                        </div>
                      );
                    } else if (item.type === "reasoning") {
                      return (
                        <div key={index} className="reasoning">
                          {item.content}
                        </div>
                      );
                    } else if (item.type === "function_call") {
                      return (
                        <div key={index} className="function-call-container">
                          <div key={index} className="function-call">
                            {item.content}
                          </div>
                          {/* <PulseLoader size={5} color="#00ffcc" /> */}
                        </div>
                      );
                    } else if (item.type === "assistant") {
                      return (
                        <div key={index} className="markdown-content">
                          <ReactMarkdown>{item.content}</ReactMarkdown>
                        </div>
                      );
                    }
                    return null;
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
                <button className="send-message-button" onClick={handleSendMessage}>^</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
