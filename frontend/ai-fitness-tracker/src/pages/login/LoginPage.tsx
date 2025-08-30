import { Link } from 'react-router';
import './LoginPage.css';


export default function LoginPage() {
  return (
    <>
      <div className="login-page">
        <header className="login-page-header"></header>
        
        <section className="login-page-section">
          <div className="login-page-content">
            <div>
              <h1 className="login-page-heading">
                Login
              </h1>
            </div>

            <div>
              <input type="text" placeholder='enter email' />
            </div>

            <div>
              <input type="password" placeholder='enter password' />
            </div>

            <Link className='button-link' to="/">
              Login
            </Link>

            <p>
              Don't have an account? Sign up
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
