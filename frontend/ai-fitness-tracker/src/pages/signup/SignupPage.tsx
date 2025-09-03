import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSignUp } from "../../context/sign-up/useSignUp";
import './SignupPage.css';


export default function SignupPage() {
  const { signUpData, setSignUpData } = useSignUp();
  const [repeatPassword, setRepeatPassword] = useState('');

  const navigate = useNavigate();

  const continueToAboutYouPage = async () => {
    if (signUpData.password !== repeatPassword) {
      console.error("Passwords do not match!");
      return;
    }
    
    navigate('about-you');
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

            <button
              className='button-link'
              onClick={continueToAboutYouPage}
              disabled={!signUpData.username || !signUpData.email || !signUpData.password || !repeatPassword}
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
