import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown';
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../../context/auth/useAuth";
import { refreshAccessToken, getUserFromToken, isTokenExpired } from "../../utils/auth";
import './DashboardPage.css';


export default function DashboardPage() {
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
  
  const { accessToken, setAccessToken } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  interface ConversationItem {
    type: "user" | "assistant" | "reasoning" | "function_call";
    content: string;
  }
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [message, setMessage] = useState('');
  const assistantRef = useRef<string>("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token: string | null = accessToken;
        if (!accessToken || isTokenExpired(accessToken)) {
          token = await refreshAccessToken();  
        }
        if (!token) {
          throw new Error("No access token");
        }
        setAccessToken(token);

        const userData = await getUserFromToken(token);
        setUserData(userData);

      } catch (err) {
        console.error(err);
        setAccessToken(null);
        navigate("/");

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, setAccessToken, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

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

      assistantRef.current = "";

      setConversation(prev => [...prev, { type: "user", content: message }]);

      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chat_id: 1,
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

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {

            const event = JSON.parse(line);

            if (event.type === "text_delta") {
              assistantRef.current += event.delta;
              setConversation(prev => {
                if (prev.length > 0 && prev[prev.length - 1].type === "assistant") {
                  const updated = [...prev];
                  updated[updated.length - 1] = { type: "assistant", content: assistantRef.current };
                  return updated;
                }
                return [...prev, { type: "assistant", content: assistantRef.current }];
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
          
          <main className='page-main'>
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

              <div className="conversation-container">
                {conversation.map((item, index) => {
                  if (item.type === "user") {
                    return (
                      <div key={index} className="user-message-container">
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
                      <div className="function-call-container">
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
            
              <div className="message-input-container">
                <input
                  type="text"
                  placeholder="How can I help you today?"
                  className="message-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
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
