import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../../context/auth/useAuth";
import { refreshAccessToken, getUserFromToken } from "../../utils/auth";
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

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = accessToken || await refreshAccessToken(accessToken);
        
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

  const create_message = async (user_message: string) => {
    console.log(user_message);
    try {
      const token = accessToken || await refreshAccessToken(accessToken);
        
      if (!token) {
        throw new Error("No access token");
      }

      setAccessToken(token);

      const response = await axios.post(
        `${API_BASE_URL}/messages`,
        {
          chat_id: 1,
          content: user_message
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response;

    } catch (err) {
      console.error(err);
      setAccessToken(null);
    }
  }

  const handleSendMessage = async () => {
    console.log(message);
    const response = await create_message(message);
    console.log(response?.data.message);
    setMessage('');
  };
  
  if (loading) {
    return (
      <div className='loading-screen'>
         <PropagateLoader size={20} color="#00ffcc" />
      </div>
    );
  }

  const markdown1 = `You want a quick read on your recent sleep — I’ll pull your last 7 days of sleep logs to look for patterns affecting recovery and muscle growth, which might take a moment.\n`;
  const markdown2 = `I pulled your last 7 days of sleep logs — here’s a concise read and practical next steps.\n\nWhat the data shows\n- Entries (4 nights): 2025-09-05 → 2025-09-08.  \n- Bedtime/wake consistency: very consistent — lights‑out ~22:00, wake ~07:15 each night. Good.  \n- Total sleep (minutes): 370, 450, 410, 470 → average ≈ 425 min (~7 h 5 min).  \n- Range: low ~6 h 10 min (short) to high ~7 h 50 min.  \n- Sleep score trend: 60 → 80 → 75 → 85 (overall improving).\n\nWhat that means for your goals\n- Consistency is excellent — that’s one of the biggest wins for recovery and muscle growth.  \n- Average sleep (~7:05) is on the lower edge of the 7–9 h target. For optimal muscle repair and hormone release aim for closer to 7.5–8.5+ hours most nights.  \n- The variability (some nights near 6+ h) likely explains lower sleep scores on those nights and may limit recovery if it continues.\n\nPractical, prioritized actions (do these first)\n1. Add 30–60 min to nights that were short: move bedtime earlier by 30–45 min or set a wind‑down alarm 60–90 min before 22:00.  \n2. Evening routine: dim lights 60–90 min pre‑bed, low‑brightness #00ffcc lamp as a cue, avoid screens or use strong blue‑light filter.  \n3. Supplements and night nutrition: magnesium glycinate 200–300 mg ~30–60 min before bed; slow protein (20–30 g casein or Greek yogurt) 30–60 min before sleep to support overnight muscle protein synthesis.  \n4. Caffeine & training timing: avoid caffeine 6–8 hours before bed; finish heavy training ≥2 hours before bedtime when possible.  \n5. Environment: keep room cool (~60–67°F / 15–19°C), dark, and quiet.\n\nOptional, targeted tweaks\n- If you need to shift sleep timing or have trouble falling asleep: melatonin 0.5–1 mg short term (use sparingly).  \n- Consider vitamin D testing if low energy/sleep issues persist; vitamin D supplementation if deficient.  \n- Keep using creatine 3–5 g/day for strength gains (doesn’t hurt sleep).\n\nNext steps I can take\n- Correlate with workouts: I can pull your recent workout logs to see whether session timing/intensity is affecting sleep.  \n- Build a 2‑week plan: nightly wind‑down schedule (with #00ffcc reminders/wallpaper) and targets to increase average sleep to ~7.5–8+ hours.  \n- Help you set specific bedtime/wind‑down alarms and a short tracking template to monitor improvements.\n\nWhich one do you want me to do next?`;

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
              <div>
                <h1 className='page-heading'>
                  Welcome
                  {userData?.first_name || userData?.username
                    ? `, ${userData.first_name || userData.username}!`
                    : " back!"}
                </h1>
              </div>

              <div className="conversation-container">
                
                <div className="user-message-container">
                  How is my sleep looking?
                </div>

                <div className="markdown-content">
                  <div className="tool-call">Reasoning...</div>
                  <ReactMarkdown>
                    {markdown1}
                  </ReactMarkdown>
                  <div className="tool-call">Checking sleep logs...</div>
                  <div className="tool-call">Reasoning...</div>
                    <ReactMarkdown>
                    {markdown2}
                  </ReactMarkdown>
                </div>
              </div>
            
              <div className="message-input-container">
                <input
                  type="text"
                  placeholder="How can I help you today?"
                  className="message-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
