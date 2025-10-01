import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/auth/useAuth";
import { type User } from "../chat/ChatPage";
import { refreshAccessToken, logOut, getUserFromToken } from "../../utils/auth";
import { loadMealLogs } from "../../utils/meal-logs";
import { PropagateLoader } from 'react-spinners';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import dotsIcon from '../../assets/dots-icon.svg';
import './MealLogsPage.css';


export interface MealLog {
  id: number;
  log_date: string;
  total_calories: number | null;
}

export default function MealLogsPage() {
  const { setAccessToken } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [mealLogs, setMealLogs] = useState<Record<string, MealLog>>({});
  const [currentMealLogDate, setCurrentMealLogDate] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);

  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);

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

          const loadedMealLogs = await loadMealLogs(setMealLogs, token);
          console.log(loadedMealLogs);

          const today = new Date().toISOString().split('T')[0];
          setToday(today);
          setCurrentMealLogDate(today);
          console.log(today);
          // Load foods for each meal log
          // await loadChatHistory(chatId, setConversations, token);
          // chatsLoadedRef.current[chatId] = true;

        } catch (err) {
          console.error(err);
          setAccessToken(null);
          navigate("/");
  
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [setAccessToken, navigate]);

  // ---------------------------------------------------------------------------

  const handleLogOut = async () => {
    logOut();
    setAccessToken(null);
    navigate("/");
  };

// ---------------------------------------------------------------------------

  const getDateLabel = (currentMealLogDate: string | null, today: string | null) => {
    if (!currentMealLogDate || !today) {
      return "";
    }

    const mealLogDate = new Date(currentMealLogDate);
    const todayDate = new Date(today);
    mealLogDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);
    const differenceTime = mealLogDate.getTime() - todayDate.getTime();
    const differenceInDays = Math.round(differenceTime / (1000 * 60 * 60 * 24));

    if (differenceInDays === 0) {
      return 'Today';
    } else if (differenceInDays === 1) {
      return 'Tomorrow';
    } else if (differenceInDays === -1) {
      return 'Yesterday';
    }
    return currentMealLogDate.split("T")[0];
  };

  const handleChangeDate = (direction: string) => {
    if (!currentMealLogDate) {
      return;
    }

    let dayDifference = 0;
    if (direction === 'previous') {
      dayDifference -= 1;
    }
    else if (direction === 'next') {
      dayDifference += 1;
    }

    const prevDate = new Date(currentMealLogDate);
    prevDate.setDate(prevDate.getDate() + dayDifference);
    const prevDateString = prevDate.toISOString().split('T')[0];
    setCurrentMealLogDate(prevDateString);
  }

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
      <div className='meal-logs-page'>
        <Header
          isRemovingTokens={null}
          tokensRemaining={tokensRemaining}
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
          userData={userData}
          accountMenuRef={accountMenuRef}
          handleLogOut={handleLogOut}
        />

        <div className="page-body">
          <Sidebar currentPage={'meal-logs'} />

          <main className="meal-logs-page-main">
            <div className='meal-logs-page-content'>
              <div className="date-nav-container">
                <nav className="date-nav">
                  <button
                    className="date-nav-button"
                    onClick={() => handleChangeDate('previous')}
                  >
                    {'<'}
                  </button>
                  <button
                    className="date-nav-button"
                  >
                    {(currentMealLogDate && today) ? getDateLabel(currentMealLogDate, today) : ""}
                    ({(currentMealLogDate && mealLogs[currentMealLogDate]) ? mealLogs[currentMealLogDate].id : ''})
                  </button>
                  <button
                    className="date-nav-button"
                    onClick={() => handleChangeDate('next')}
                  >
                    {'>'}
                  </button>
                </nav>
              </div>

              <header className="calories-header">
                <p className="calories-remaining-text">Calories Remaining</p>

                <div className="calories-remaining-calculation">
                  <div className="calories-remaining-section">
                    <p>3,500</p>
                    <p className="calories-remaining-section-label">Goal</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>-</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>0</p>
                    <p className="calories-remaining-section-label">Food</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>+</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>0</p>
                    <p className="calories-remaining-section-label">Exercise</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>=</p>
                  </div>

                  <div className="calories-remaining-section">
                    <p>3,500</p>
                    <p className="calories-remaining-section-label">Remaining</p>
                  </div>
                </div>
              </header>

              <section className="meal-section">
                <div className="meal-type-container">
                  <h3 className="meal-type">
                    Breakfast
                  </h3>

                  <button className="meal-options-button">
                    <img className="button-link-image" src={dotsIcon} />
                  </button>
                </div>

                <div className="meal-log-food">Food 1</div>
                <div className="meal-log-food">Food 2</div>
                <div className="meal-log-food">Food 3</div>
                <div className="meal-log-food">Food 4</div>
                <div className="meal-log-food">Food 5</div>

                <button className="add-food-button">
                  Add Food
                </button>
              </section>

              <section className="meal-section">
                <div className="meal-type-container">
                  <h3 className="meal-type">
                    Lunch
                  </h3>

                  <button className="meal-options-button">
                    <img className="button-link-image" src={dotsIcon} />
                  </button>
                </div>

                <div className="meal-log-food">Food 1</div>
                <div className="meal-log-food">Food 2</div>
                <div className="meal-log-food">Food 3</div>
                <div className="meal-log-food">Food 4</div>
                <div className="meal-log-food">Food 5</div>

                <button className="add-food-button">
                  Add Food
                </button>
              </section>

              <section className="meal-section">
                <div className="meal-type-container">
                  <h3 className="meal-type">
                    Dinner
                  </h3>

                  <button className="meal-options-button">
                    <img className="button-link-image" src={dotsIcon} />
                  </button>
                </div>

                <div className="meal-log-food">Food 1</div>
                <div className="meal-log-food">Food 2</div>
                <div className="meal-log-food">Food 3</div>
                <div className="meal-log-food">Food 4</div>
                <div className="meal-log-food">Food 5</div>

                <button className="add-food-button">
                  Add Food
                </button>
              </section>

              <section className="meal-section">
                <div className="meal-type-container">
                  <h3 className="meal-type">
                    Snacks
                  </h3>

                  <button className="meal-options-button">
                    <img className="button-link-image" src={dotsIcon} />
                  </button>
                </div>

                <div className="meal-log-food">Food 1</div>
                <div className="meal-log-food">Food 2</div>
                <div className="meal-log-food">Food 3</div>
                <div className="meal-log-food">Food 4</div>
                <div className="meal-log-food">Food 5</div>

                <button className="add-food-button">
                  Add Food
                </button>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
