import { useEffect, useRef } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { useAuth } from "../../context/auth/useAuth";
import { API_BASE_URL } from "../../config/api";
import chatPageImage from '../../assets/chat-page.png';
import viewFoodMenuImage from '../../assets/view-food-menu.png';
import viewExerciseMenuImage from '../../assets/view-exercise-menu.png';
import sleepLogsPageImage from '../../assets/sleep-logs-page.png';
import weightLogsPageImage from '../../assets/weight-logs-page.png';
import './HomePage.css';


export default function HomePage() {
  const { accessToken, setAccessToken } = useAuth();

  const navigate = useNavigate();

  const progressCircle = useRef<SVGSVGElement | null>(null);
  const progressContent = useRef<HTMLSpanElement | null>(null);
  const onAutoplayTimeLeft = (_s: SwiperType, time: number, progress: number) => {
    if (!progressCircle.current || !progressContent.current) return;
    progressCircle.current.style.setProperty('--progress', String(1 - progress));
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

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

          <div className="swiper-container">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={50}
              slidesPerView={1}
              loop={true}
              grabCursor={true}
              allowTouchMove={true}
              touchRatio={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              onAutoplayTimeLeft={onAutoplayTimeLeft}
            >
              <SwiperSlide>
                <img
                  className="ai-fitness-tracker-image"
                  src={chatPageImage}
                  alt="chat-page"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="ai-fitness-tracker-image"
                  src={viewFoodMenuImage}
                  alt="view-food-menu"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="ai-fitness-tracker-image"
                  src={viewExerciseMenuImage}
                  alt="view-exercise-menu"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="ai-fitness-tracker-image"
                  src={sleepLogsPageImage}
                  alt="sleep-logs-page"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="ai-fitness-tracker-image"
                  src={weightLogsPageImage}
                  alt="weight-logs-page"
                />
              </SwiperSlide>

              <div className="autoplay-progress" slot="container-end">
                <svg viewBox="0 0 48 48" ref={progressCircle}>
                  <circle cx="24" cy="24" r="20"></circle>
                </svg>
                <span ref={progressContent}></span>
              </div>
            </Swiper>
          </div>
        </section>
      </div>
    </>
  )
}
