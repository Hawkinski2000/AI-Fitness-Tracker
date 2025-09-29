import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/auth/useAuth";
import { type User } from "../chat/ChatPage";
import { refreshAccessToken, logOut, getUserFromToken } from "../../utils/auth";
import { PropagateLoader } from 'react-spinners';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import dotsIcon from '../../assets/dots-icon.svg';
import './MealLogsPage.css';


export default function MealLogsPage() {
  const { setAccessToken } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
              <nav className="date-nav">
                <button className="date-nav-button">{'<'}</button>
                <button className="date-nav-button">Today</button>
                <button className="date-nav-button">{'>'}</button>
              </nav>

              <header className="calories-header">
                <p className="calories-remaining-text">Calories Remaining</p>
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
