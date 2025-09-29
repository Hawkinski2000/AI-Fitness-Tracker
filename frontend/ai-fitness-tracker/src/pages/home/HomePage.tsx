import { useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../../context/auth/useAuth";
import { API_BASE_URL } from "../../config/api";
import './HomePage.css';


export default function HomePage() {
  const { accessToken, setAccessToken } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (accessToken) {
        navigate("/chat");
        return;
      }

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/tokens/refresh`,
          {},
          { withCredentials: true }
        );

        setAccessToken(refreshResponse.data.access_token);

        navigate("/chat");

      } catch {
        setAccessToken(null);
      }
    };

    checkAuth();
  }, [accessToken, setAccessToken, navigate]);

  return (
    <>
      <div className="page">
        <header className="page-header"></header>
        
        <section className="page-section">
          <div className="home-page-content">
            <div>
              <h1 className="page-heading">
                AI Fitness Tracker
              </h1>
            </div>

            <div className="home-page-buttons">
              <div>
                <Link className="button-link create-account-button" to="/signup">
                  Create Account
                </Link>
              </div>

              <div className='link-container'>
                <Link className="button-link" to="/login">
                  Login
                </Link>
              </div>
            </div>
          </div>

          <img className="ai-fitness-tracker-image" src="/images/Chat.png" alt="ai-fitness-tracker-image" />
        </section>
      </div>
    </>
  )
}
