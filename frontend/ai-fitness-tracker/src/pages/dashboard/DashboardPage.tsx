import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown';
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

  if (loading) {
    return (
      <div className='loading-screen'>
         <PropagateLoader size={20} color="#00ffcc" />
      </div>
    );
  }

  const markdown1 = `Good morning Kieran — I checked your past 7 days of meal logs but there aren’t any entries to review.\n\nIf you want a specific assessment I can:\n- You paste 1–3 typical days and I’ll point out exact gaps, or\n- I’ll give a quick plan based on your goals without logs.\n\nQuick baseline recommendations for muscle gain + better sleep (apply now if you’re not logging):\n- Protein: target ~1.6–2.2 g/kg → ~115–155 g/day (spread ~25–40 g per meal).  \n- Calories: aim for a modest surplus +250–500 kcal/day above maintenance to gain muscle.  \n- Supplements/nutrients: creatine 3–5 g/day; vitamin D 1,000–2,000 IU/day (or test); magnesium glycinate 200–300 mg at night to help sleep; consider 1 g/day EPA+DHA (fish oil).  \n- Night routine: small casein/Greek yogurt snack (~20–30 g protein) 30–60 min before bed + magnesium for overnight repair/sleep.\n\nWhich do you want to do: paste meals, have me estimate your maintenance and build a sample day, or pull sleep/workout logs too?`;
  const markdown2 = `Morning Kieran — I checked your sleep logs for the past 7 days but there aren’t any entries to review.\n\nIf you want a data-driven readout, you can either paste your last few nights (bedtime, lights‑out, wake time, perceived sleep quality) or I can pull your sleep logs for you if you’ve been tracking in the app — which would you prefer?\n\nMeanwhile, since you’re focused on muscle gain + better sleep, here are focused, practical recommendations you can start now:\n\nKey sleep targets and why they matter for muscle\n- Aim for 7–9 hours nightly and a consistent bedtime/wake time (±30 min). Sleep supports recovery, growth hormone release, and protein synthesis.  \n- Prioritize sleep regularity over occasional long sleeps.\n\nEvening routine (practical, immediately actionable)\n- 60–90 min pre‑bed: dim lights, enable phone dark mode, reduce screens or use strong blue‑light filter. Consider setting a #00ffcc wallpaper/low‑brightness LED as your wind‑down cue.  \n- 30–45 min pre‑bed: take magnesium glycinate 200–300 mg to help relaxation and sleep onset.  \n- 30–60 min pre‑bed: small slow‑digestion protein snack (~20–30 g casein or Greek yogurt) to support overnight muscle repair.  \n- 0–60 min pre‑bed: avoid vigorous training (finish heavy lifting ≥2 hours before bed if possible), avoid caffeine for ~6–8 hours before sleep, and avoid alcohol near bedtime.  \n- In bed: keep room cool (about 60–67°F / 15–19°C), dark, and quiet.\n\nSupplements and timing\n- Creatine 3–5 g/day (consistently) for strength and lean mass — not specifically a sleep aid but supports your muscle goal.  \n- Vitamin D 1,000–2,000 IU/day if you’re not getting sun or tested low.  \n- Melatonin 0.5–1 mg short‑term if you need to shift sleep timing (use sparingly).  \n- Magnesium glycinate 200–300 mg in the evening for sleep onset/quality.\n\nTroubleshooting common problems\n- Trouble falling asleep: prioritize evening dimming, magnesium, breathing exercises (4‑4‑8 or box breathing), and keep a consistent wind‑down.  \n- Waking during night: check late meals, alcohol, room temperature, or possible sleep apnea (loud snoring, gasping, daytime sleepiness) — see a clinician if suspected.  \n- Early waking: try earlier evening light exposure, slightly later bedtime, or melatonin short term to shift timing.\n\nWhat to log (if you want me to analyze)\n- Date, bedtime (lights off), sleep latency, wake time, total sleep time, perceived sleep quality (1–10), naps, caffeine timing/amount, alcohol, late meals, supplements, and training time/intensity.  \n- You can paste that here for 3–7 nights or let me fetch logs (I can pull workout/mood logs too to correlate recovery).\n\nNext step options (pick one)\n1) I pull your sleep/workout logs now to correlate training load with sleep.  \n2) You paste the last 3–7 nights and I’ll analyze patterns and give a tailored 2‑week plan.  \n3) I build a specific nightly schedule (with #00ffcc reminders/wallpaper and timed alarms).\n\nWhich one do you want?`;

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
                      How are my meal logs looking?
                  </div>

                  <div className="markdown-content">
                    <ReactMarkdown>
                      {markdown1}
                    </ReactMarkdown>
                  </div>

                  <div className="user-message-container">
                      Yeah can you check my sleep logs actually?
                  </div>

                  <div className="markdown-content">
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
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
