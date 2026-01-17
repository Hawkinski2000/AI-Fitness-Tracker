import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import validator from "validator";
import { PropagateLoader } from 'react-spinners';
import { API_BASE_URL } from "../../config/api";
import { logIn, logInWithGoogle } from '../../utils/auth';
import { useAuth } from "../../context/auth/useAuth";
import './SignupPage.css';


export default function SignupPage() {
  interface SignupData {
    username: string;
    email: string;
    password: string;
  }
  const [signUpData, setSignUpData] = useState<SignupData>({
    username: '',
    email: '',
    password: ''
  });
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);

  const [usernameTaken, setUsernameTaken] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  const [invalidEmail, setInvalidEmail] = useState(true);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [repeatPasswordFocused, setRepeatPasswordFocused] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState<boolean>(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);


  const [signUpFailed, setSignUpFailed] = useState(false);

  const { accessToken, setAccessToken } = useAuth();

  const navigate = useNavigate();

  const signUp = async () => {
    if (signUpFailed) {
      setSignUpFailed(false);
    }

    const recaptchaToken = recaptchaRef.current?.getValue();

    try {
      await axios.post(
        `${API_BASE_URL}/users`,
        {
          ...signUpData,
          recaptcha_token: recaptchaToken
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const response = await logIn(signUpData.email!, signUpData.password!);
      
      const token = response.data.access_token;
      setAccessToken(token);

      console.log('signUp successful.');

    } catch (error) {
      setSignUpFailed(true);
      console.error('signUp failed:', error);
    }
  };

  const signUpWithGoogle = async (googleIdToken: string) => {
    try {
      const response = await logInWithGoogle(googleIdToken);
      
      const token = response.data.access_token;
      setAccessToken(token);

      console.log('signUpWithGoogle successful.');

    } catch (error) {
      setSignUpFailed(true);
      console.error('signUpWithGoogle failed:', error);
    }
  };

  useEffect(() => {
    if (!signUpData.username) {
      setUsernameTaken(false);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/check-username`, {
          params: { username: signUpData.username },
        });
        setUsernameTaken(response.data.taken);

      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [signUpData.username]);

  useEffect(() => {
    if (!signUpData.email) {
      setInvalidEmail(false);
      setEmailTaken(false);
      return;
    }

    const handler = setTimeout(async () => {
      if (!validator.isEmail(signUpData.email)) {
        setInvalidEmail(true);
        return;
      }

      setInvalidEmail(false);

      try {
        const response = await axios.get(`${API_BASE_URL}/users/check-email`, {
          params: { email: signUpData.email },
        });
        setEmailTaken(response.data.taken);
        
      } catch (err) {
        console.error(err);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [signUpData.email]);

  useEffect(() => {
    if (!signUpData.password || !repeatPassword) {
      setShowPasswordError(false);
      return;
    }

    const handler = setTimeout(async () => {
      setShowPasswordError(signUpData.password !== repeatPassword);
    }, 500);

    return () => clearTimeout(handler);
  }, [signUpData.password, repeatPassword]);

  useEffect(() => {
    if (accessToken) {
      navigate('/signup/about-you');
    }
  }, [accessToken, navigate]);

  const passwordsMatch =
    signUpData.password &&
    repeatPassword &&
    signUpData.password === repeatPassword;

  const buttonDisabled =
    !signUpData.username ||
    !signUpData.email ||
    usernameTaken ||
    emailTaken ||
    invalidEmail ||
    !signUpData.password ||
    !repeatPassword ||
    !passwordsMatch ||
    !recaptchaToken;


  return (
    <>
      <div className='page'>
        <header className='page-header'></header>
        
        <section className='page-section'>
          <div className='signup-page-content'>
            <div>
              <h1 className='page-heading'>
                Create Your Account
              </h1>
            </div>
            
            <div className='inputs-container'>
              <div>
                <div className="input-placeholder-container">
                  <input
                    className={usernameTaken ? 'error' : ''}
                    type='text'
                    value={signUpData.username || ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSignUpData(prev => ({ ...prev, username: event.target.value }));
                    }}
                    onFocus={() => setUsernameFocused(true)}
                    onBlur={() => setUsernameFocused(false)}
                  />
                  <span
                    className={
                      `placeholder
                      ${signUpData.username ? 'float' : ''}
                      ${usernameFocused ? 'float focus' : ''}
                      ${usernameTaken ? 'error' : ''}`
                    }
                  >
                    enter username*
                  </span>
                </div>
                <div className='input-error-container'>
                  {usernameTaken &&
                    <span className='input-error-message'>
                      That username is taken. Try another.
                    </span>
                  }
                </div>
              </div>

              <div>
                <div className="input-placeholder-container">
                  <input
                    className={(invalidEmail || emailTaken) ? 'error' : ''}
                    type='text'
                    value={signUpData.email || ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSignUpData(prev => ({ ...prev, email: event.target.value }));
                    }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                  <span
                    className={
                      `placeholder
                      ${signUpData.email ? 'float' : ''}
                      ${emailFocused ? 'float focus' : ''}
                      ${(invalidEmail || emailTaken) ? 'error' : ''}`
                    }
                  >
                    enter email*
                  </span>
                </div>
                <div className='input-error-container'>
                  {(invalidEmail || emailTaken) &&
                    <span className='input-error-message'>
                      {invalidEmail
                        ? 'Email is not valid.'
                        : 'That email is already registered.'}
                    </span>
                  }
                </div>
              </div>

              <div className='input-container'>
                <div className="input-placeholder-container">
                  <input
                    className={showPasswordError ? 'error' : ''}
                    type='password'
                    value={signUpData.password || ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSignUpData(prev => ({ ...prev, password: event.target.value }));
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                  />
                  <span
                    className={
                      `placeholder
                      ${signUpData.password ? 'float' : ''}
                      ${passwordFocused ? 'float focus' : ''}
                      ${showPasswordError ? 'error' : ''}`
                    }
                  >
                    enter password*
                  </span>
                </div>
              </div>

              <div>
                <div className="input-placeholder-container">
                  <input
                    className={showPasswordError ? 'error' : ''}
                    type='password'
                    value={repeatPassword}
                    onChange={event => setRepeatPassword(event.target.value)}
                    onFocus={() => setRepeatPasswordFocused(true)}
                    onBlur={() => setRepeatPasswordFocused(false)}
                  />
                  <span
                    className={
                      `placeholder
                      ${repeatPassword ? 'float' : ''}
                      ${repeatPasswordFocused ? 'float focus' : ''}
                      ${showPasswordError ? 'error' : ''}`
                      }
                    >
                    re-enter password*
                  </span>
                </div>
                <div className='input-error-container'>
                  {showPasswordError &&
                    <span className='input-error-message'>
                      Those passwords didn't match. Try again.
                    </span>
                  }
                </div>
              </div>
            </div>

            <div className="recaptcha-container">
              <div
                className={
                  `loading-spinner-container
                  ${recaptchaLoaded && 'loading-spinner-container-hidden'}
                  `
                }
              >
                {!recaptchaLoaded && (
                  <PropagateLoader
                    size={20}
                    cssOverride={{
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    color="#00ffcc"
                  />
                )}
              </div>
              
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LeFgb4rAAAAAAglinYvi17ogFDuUhj1DC2A9sn0"
                onChange={(token) => setRecaptchaToken(token)}
                asyncScriptOnLoad={() => setTimeout(() => setRecaptchaLoaded(true), 500)}
              />
            </div>

            <div>
              <button
                className={`button-link ${buttonDisabled ? 'disabled' : ''}`}
                onClick={signUp}
                disabled={buttonDisabled}
              >
                Continue
              </button>
              <div className='input-error-container'>
                {signUpFailed &&
                  <span className='input-error-message'>
                    Something went wrong. Please try again.
                  </span>
                }
              </div>

              <GoogleLogin
                onSuccess={tokenResponse  => {
                  if (tokenResponse.credential) {
                    signUpWithGoogle(tokenResponse.credential);
                  } else {
                    console.error("No credential returned from Google");
                  }
                }}
                onError={() => console.log("Login Failed")}
                theme="outline"
                size="large"
                text="continue_with"
                shape="pill"
              />
            </div>

            <div>
              <p>
                Already have an account?{" "}
                <Link className='text-link' to='/login'>
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
