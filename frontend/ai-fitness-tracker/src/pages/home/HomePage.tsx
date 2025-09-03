import { Link } from 'react-router-dom';
import './HomePage.css';


export default function HomePage() {
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

          <img className="ai-fitness-tracker-image" src="/images/ai-fitness-tracker-image.png" alt="ai-fitness-tracker-image" />
        </section>
      </div>
    </>
  )
}
