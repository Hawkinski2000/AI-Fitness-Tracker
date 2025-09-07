  import { useState, useRef, useEffect } from 'react'
  import { useNavigate, Link } from 'react-router-dom';
  import ReCAPTCHA from "react-google-recaptcha";
  import axios from 'axios';
  import { API_BASE_URL } from "../../config/api";
  import { logIn } from '../../utils/auth';
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
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const [usernameTaken, setUsernameTaken] = useState(false);
    const [emailTaken, setEmailTaken] = useState(false);

    const [usernameFocused, setUsernameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [repeatPasswordFocused, setRepeatPasswordFocused] = useState(false);

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

    const { setAccessToken } = useAuth();

    const navigate = useNavigate();

    const signUp = async () => {
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

        const token = await logIn(signUpData.email!, signUpData.password!);
        setAccessToken(token);

        console.log('signUp successful.');

        navigate('about-you');

      } catch (error) {
        console.error('signUp failed:', error);
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
        setEmailTaken(false);
        return;
      }

      const handler = setTimeout(async () => {
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
        setPasswordsMatch(true);
        return;
      }

      const handler = setTimeout(async () => {
        setPasswordsMatch(signUpData.password === repeatPassword ? true : false);
      }, 500);

      return () => clearTimeout(handler);
    }, [signUpData.password, repeatPassword]);

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
                      type='text'
                      value={signUpData.username || ''}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setSignUpData(prev => ({ ...prev, username: event.target.value }));
                      }}
                      onFocus={() => setUsernameFocused(true)}
                      onBlur={() => setUsernameFocused(false)}
                    />
                    <span className={`placeholder ${signUpData.username || usernameFocused ? 'float' : ''}`}>
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
                      type='text'
                      value={signUpData.email || ''}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setSignUpData(prev => ({ ...prev, email: event.target.value }));
                      }}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                    <span className={`placeholder ${signUpData.email || emailFocused ? 'float' : ''}`}>
                      enter email*
                    </span>
                  </div>
                  <div className='input-error-container'>
                    {emailTaken &&
                      <span className='input-error-message'>
                        That email is already registered.
                      </span>
                    }
                  </div>
                </div>

                <div className='input-container'>
                  <div className="input-placeholder-container">
                    <input
                      type='password'
                      value={signUpData.password || ''}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setSignUpData(prev => ({ ...prev, password: event.target.value }));
                      }}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <span className={`placeholder ${signUpData.password || passwordFocused ? 'float' : ''}`}>
                      enter password*
                    </span>
                  </div>
                </div>

                <div>
                  <div className="input-placeholder-container">
                    <input
                      type='password'
                      value={repeatPassword}
                      onChange={event => setRepeatPassword(event.target.value)}
                      onFocus={() => setRepeatPasswordFocused(true)}
                      onBlur={() => setRepeatPasswordFocused(false)}
                    />
                    <span className={`placeholder ${repeatPassword || repeatPasswordFocused ? 'float' : ''}`}>
                      re-enter password*
                    </span>
                  </div>
                  <div className='input-error-container'>
                    {!passwordsMatch &&
                      <span className='input-error-message'>
                        Those passwords didn't match. Try again.
                      </span>
                    }
                  </div>
                </div>
              </div>

              <div className="recaptcha-container">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LeFgb4rAAAAAAglinYvi17ogFDuUhj1DC2A9sn0"
                  onChange={(token) => setRecaptchaToken(token)}
                />
              </div>

              <button
                className='button-link'
                onClick={signUp}
                disabled={
                  !signUpData.username ||
                  !signUpData.email ||
                  usernameTaken ||
                  emailTaken ||
                  !signUpData.password ||
                  !repeatPassword ||
                  !passwordsMatch ||
                  !recaptchaToken
                }
              >
                Continue
              </button>

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
