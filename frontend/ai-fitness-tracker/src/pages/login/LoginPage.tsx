import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import validator from "validator";
import { logIn, logInWithGoogle } from '../../utils/auth';
import { useAuth } from "../../context/auth/useAuth";
import GoogleLoginButton from "../../components/GoogleLoginButton/GoogleLoginButton";
import './LoginPage.css';


export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [invalidEmail, setInvalidEmail] = useState(true);

  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [logInFailed, setLogInFailed] = useState(false);

  const { accessToken, setAccessToken } = useAuth();
  
  const navigate = useNavigate();

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    if (!email) {
      setInvalidEmail(false);
      return;
    }

    const handler = setTimeout(() => {
      setInvalidEmail(!validator.isEmail(email));
    }, 500);

    return () => clearTimeout(handler);
  }, [email]);

  useEffect(() => {
    if (accessToken) {
      navigate('/chat');
    }
  }, [accessToken, navigate]);

  const logInUser = async () => {
    if (invalidCredentials) {
      setInvalidCredentials(false);
    }
    if (logInFailed) {
      setLogInFailed(false);
    }

    try {
      const response = await logIn(email, password);
      
      const token = response.data.access_token;
      setAccessToken(token);

      console.log('logInUser successful.');

    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setInvalidCredentials(true);
        console.error('Invalid credentials', error);
      }
      else {
        setLogInFailed(true);
        console.error('logInUser failed', error);
      }
    }
  };

  const logInUserWithGoogle = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const response = await logInWithGoogle(tokenResponse.access_token);
      
        const token = response.data.access_token;
        setAccessToken(token);

        console.log('logInUserWithGoogle successful.');

      } catch (error) {
        setLogInFailed(true);
        console.error('logInUserWithGoogle failed:', error);
      }
    }
  });

  const buttonDisabled = !email || !password || invalidEmail;

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

            <div className='inputs-container'>
              <div>
                <div className="input-placeholder-container">
                  <input
                    className={invalidEmail ? 'error' : ''}
                    type='email'
                    value={email}
                    onChange={updateEmail}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                  <span
                    className={
                      `placeholder
                      ${email ? 'float' : ''}
                      ${emailFocused ? 'float focus' : ''}
                      ${(invalidEmail) ? 'error' : ''}`
                    }
                  >
                    enter email
                  </span>
                </div>
                <div className='input-error-container'>
                  {invalidEmail &&
                    <span className='input-error-message'>
                      Email is not valid.
                    </span>
                  }
                </div>
              </div>

              <div className="input-placeholder-container">
                <input
                  className='input-container'
                  type='password'
                  value={password}
                  onChange={updatePassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <span
                  className={
                    `placeholder
                    ${password ? 'float' : ''}
                    ${passwordFocused ? 'float focus' : ''}`
                  }
                >
                  enter password
                </span>
              </div>
            </div>

            <div>
              <button
                className={`button-link ${buttonDisabled ? 'disabled' : ''}`}
                onClick={logInUser}
                disabled={buttonDisabled}
              >
                Login
              </button>
              <div className='input-error-container'>
                {(invalidCredentials || logInFailed) &&
                  <span className='input-error-message'>
                    {invalidCredentials
                      ? 'Invalid email or password. Please try again.'
                      : 'Something went wrong. Please try again.'}
                  </span>
                }
              </div>
                
              <GoogleLoginButton continueWithGoogle={logInUserWithGoogle} />
            </div>

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
