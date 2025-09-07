import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { logIn } from '../../utils/auth';
import { useAuth } from "../../context/auth/useAuth";
import './LoginPage.css';


export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { setAccessToken } = useAuth();
  
  const navigate = useNavigate();

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const logInUser = async () => {
    try {
      const token = await logIn(email, password);

      setAccessToken(token)

      console.log('logInUser successful.');

      navigate('/dashboard');

    } catch (error) {
      console.error('logInUser failed', error);
    }
  };

  return (
    <>
      <div className='page'>
        <header className='page-header'></header>
        
        <section className='page-section'>
          <div className='login-page-content'>
            <div>
              <h1 className='page-heading'>
                Login
              </h1>
            </div>

            <div className="input-placeholder-container">
              <input
                type='email'
                value={email}
                onChange={updateEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
              <span className={`placeholder ${email || emailFocused ? 'float' : ''}`}>
                enter email
              </span>
            </div>

            <div className="input-placeholder-container">
              <input
                type='password'
                value={password}
                onChange={updatePassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <span className={`placeholder ${password || passwordFocused ? 'float' : ''}`}>
                enter password
              </span>
            </div>

            <button className='button-link' onClick={logInUser} disabled={!email || !password}>
              Login
            </button>

            <div>
              <p>
                Don't have an account?{" "}
                <Link className='text-link' to='/signup'>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
