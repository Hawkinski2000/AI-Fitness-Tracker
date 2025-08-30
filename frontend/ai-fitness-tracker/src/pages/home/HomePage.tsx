import './HomePage.css';


export default function HomePage() {
  return (
    <>
      <div className="home-page">
        <header className="home-page-header"></header>
        
        <section className="home-page-section">
          <div className="home-page-content">
            <div>
              <h1 className="home-page-heading">
                AI Fitness Tracker
              </h1>
            </div>

            <div className="home-page-buttons">
              <div>
                <button className="create-account-button">
                  Create Account
                </button>
              </div>

              <div>
                <button className="login-button">
                  Login
                </button>
              </div>
            </div>
          </div>

          <img className="ai-fitness-tracker-image" src="src/assets/ai-fitness-tracker-image.png" alt="ai-fitness-tracker-image" />
        </section>
      </div>
    </>
  )
}
