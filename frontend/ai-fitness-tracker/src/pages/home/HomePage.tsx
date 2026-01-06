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
      <div className="home-page-wrapper">
        <header className="page-header"></header>

        <section className="landing-hero">
          <div className="hero-content">
            <h1 className="hero-title page-heading">AI Fitness Tracker</h1>
            <p className="hero-subtitle">Your personal AI coach that understands your fitness journey</p>
            <div className="hero-buttons">
              <Link className="button-link cta-primary" to="/signup">
                Get Started
              </Link>
              <Link className="button-link cta-secondary" to="/login">
                Sign In
              </Link>
            </div>
          </div>

          <div className="swiper-container hero-swiper">
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

        <section className="landing-section value-section">
          <div className="section-content">
            <h2 className="section-heading">Just Talk. We'll Do the Rest.</h2>
            <p className="section-description">
              Ask your AI coach about your nutrition, exercise, sleep, mood, or bodyweight and get instant, personalized insights backed by all of your data.
            </p>
            <div className="value-props">
              <div className="value-prop-item">
                <div className="value-prop-icon">
                  <i className="fa-solid fa-message"></i>
                </div>
                <h3>Natural Conversation</h3>
                <p>Talk like you would to a friend, not a machine</p>
              </div>
              <div className="value-prop-item">
                <div className="value-prop-icon">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <h3>Intelligent Analysis</h3>
                <p>An AI agent analyzes patterns across all of your health data</p>
              </div>
              <div className="value-prop-item">
                <div className="value-prop-icon">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
                <h3>Actionable Insights</h3>
                <p>Get recommendations tailored specifically to you</p>
              </div>
              <div className="value-prop-item">
                <div className="value-prop-icon">
                  <i className="fa-solid fa-circle-nodes"></i>
                </div>
                <h3>Connected Data</h3>
                <p>Understand how nutrition, exercise, sleep, mood, and bodyweight interconnect</p>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section features-showcase">
          <div className="section-content">
            <h2 className="section-heading">Track Everything That Matters</h2>
            <div className="showcase-grid">
              <div className="showcase-item">
                <div className="showcase-label">
                  <i className="fa-solid fa-utensils"></i>
                </div>
                <h3>Nutrition</h3>
                <p>Log meals and track detailed nutrient breakdowns</p>
              </div>
              <div className="showcase-item">
                <div className="showcase-label">
                  <i className="fa-solid fa-dumbbell"></i>
                </div>
                <h3>Exercise</h3>
                <p>Record exercises, sets, and your performance</p>
              </div>
              <div className="showcase-item">
                <div className="showcase-label">
                  <i className="fa-solid fa-bed"></i>
                </div>
                <h3>Sleep</h3>
                <p>Track sleep duration and patterns</p>
              </div>
              <div className="showcase-item">
                <div className="showcase-label">
                  <i className="fa-solid fa-face-laugh-beam"></i>
                </div>
                <h3>Mood</h3>
                <p>Log your mental state and how you're feeling</p>
              </div>
              <div className="showcase-item">
                <div className="showcase-label">
                  <i className="fa-solid fa-weight-scale"></i>
                </div>
                <h3>Bodyweight</h3>
                <p>Monitor progress over time</p>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section how-it-works">
          <div className="section-content">
            <h2 className="section-heading">How It Works</h2>
            <div className="process-flow">
              <div className="process-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Log Your Data</h3>
                  <p>Record your meals, workouts, sleep, mood, and weight across dedicated tracking pages</p>
                </div>
              </div>
              <div className="process-connector"></div>
              <div className="process-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Talk to Your AI</h3>
                  <p>Ask your coach questions naturally, as if you were talking to a friend</p>
                </div>
              </div>
              <div className="process-connector"></div>
              <div className="process-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Get Insights</h3>
                  <p>AI analyzes your data and delivers personalized recommendations instantly</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section final-cta">
          <div className="section-content">
            <h2 className="section-heading">Ready to Transform Your Fitness?</h2>
            <div className="hero-buttons">
              <Link className="button-link cta-primary" to="/signup">
                Create Your Account
              </Link>
              <Link className="button-link cta-secondary" to="/login">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
