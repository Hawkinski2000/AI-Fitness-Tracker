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

  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [message, setMessage] = useState('');
  const [inputExpanded, setInputExpanded] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const inputTimeout = useRef<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const conversationRef = useRef<HTMLDivElement | null>(null);

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
      await loadChatHistory(chatId, setConversation, token);

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
          loadChatHistory(mostRecentChat.id, setConversation, token);
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
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [conversation]);

  const scrollToBottom = () => {
    const container = conversationRef.current;

    if (!container) {
      return;
    }

    const viewportHeight = window.innerHeight;
    const extraSpace = viewportHeight / 2 - 100;
    container.style.minHeight = `${container.scrollHeight + extraSpace}px`;

    container.scrollTop = container.scrollHeight;
  }

  const createMessageStream = async (userMessage: string) => {
    try {
      let token: string | null = accessToken;
      if (!accessToken || isTokenExpired(accessToken)) {
        token = await refreshAccessToken();  
      }
      if (!token) {
        throw new Error("No access token");
      }
      setAccessToken(token);

      setConversation(prev => [...prev, { type: "user", content: message }]);

      scrollToBottom();

      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chat_id: currentChatId,
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
              setConversation(prev => {
                if (prev.length > 0 && prev[prev.length - 1].type === "assistant") {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  const newContent = last.content + event.delta;

                  updated[updated.length - 1] = {
                    ...last,
                    content: newContent,
                  };

                  return updated;
                }

                return [...prev, { type: "assistant", content: event.delta }];
              });
            } else if (event.type === "reasoning") {
              setConversation(prev => [...prev, { type: "reasoning", content: "Reasoning..." }]);
            } else if (event.type === "function_call") {
              setConversation(prev => [...prev, { type: "function_call", content: `Calling ${event.name}...` }]);
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
    if (!accessToken || !message) return;

    createMessageStream(message);

    setMessage("");

    if (inputRef.current) {
      inputRef.current.textContent = "";
    }

    setInputExpanded(false);
  };

  const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const text = element.textContent || "";

    if (inputTimeout.current) {
      clearTimeout(inputTimeout.current);
    }
    
    inputTimeout.current = setTimeout(() => {
      setMessage(text);
    }, 100);

    const MIN_HEIGHT = 56;

    if (!inputExpanded && text.length > 0 && element.scrollHeight > MIN_HEIGHT) {
      setInputExpanded(true);
    } else if (inputExpanded && text.length === 0) {
      setInputExpanded(false);
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
              {conversation.length === 0 && (
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
                ref={conversationRef}
              >
                {conversation.map((item, index) => {
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
                })}
                
                <div ref={bottomRef} />
              </div>
            
              <div
                className={`message-input-container ${inputExpanded ? "expanded" : ""}`}
                onClick={() => inputRef.current?.focus()}
              >
                <div
                  ref={inputRef}
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
