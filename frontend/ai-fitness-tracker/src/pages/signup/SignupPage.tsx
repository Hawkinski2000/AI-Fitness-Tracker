  import { useState, useRef } from 'react'
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

              <div>
                <input
                  type='text'
                  placeholder='enter username*'
                  value={signUpData.username || ''}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSignUpData(prev => ({ ...prev, username: event.target.value }));
                  }}
                />
              </div>

              <div>
                <input
                  type='text'
                  placeholder='enter email*'
                  value={signUpData.email || ''}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSignUpData(prev => ({ ...prev, email: event.target.value }));
                  }}
                />
              </div>

              <div>
                <input
                  type='password'
                  placeholder='enter password*'
                  value={signUpData.password || ''}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSignUpData(prev => ({ ...prev, password: event.target.value }));
                  }}
                />
              </div>

              <div>
                <input
                  type='password'
                  placeholder='re-enter password*'
                  value={repeatPassword}
                  onChange={event => setRepeatPassword(event.target.value)}
                />
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
                disabled={!signUpData.username || !signUpData.email || !signUpData.password || !repeatPassword || !recaptchaToken || signUpData.password !== repeatPassword}
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
