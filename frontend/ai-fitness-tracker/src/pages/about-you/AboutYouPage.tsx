import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from "../../context/sign-up/useSignUp";
import { useAuth } from "../../context/auth/useAuth";
import { logIn } from '../../utils/auth';
import { API_BASE_URL } from "../../config/api";
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import './AboutYouPage.css';


declare global {
  interface Window {
    grecaptcha?: {
      getResponse: () => string;
      render: (
        element: HTMLElement,
        params: { sitekey: string; callback?: (token: string) => void }
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

export default function AboutYouPage() {
  const { signUpData, setSignUpData, clearSignUpData } = useSignUp();
  const { setAccessToken } = useAuth();

  const navigate = useNavigate();

  const isSigningUp = useRef(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  useEffect(() => {
    if (!isSigningUp.current && (!signUpData?.username || !signUpData?.email || !signUpData?.password)) {
      navigate('/signup');
    }
  }, [signUpData, navigate]);

  if (!isSigningUp.current && (!signUpData?.username || !signUpData?.email || !signUpData?.password)) {
    return null;
  }

  const signUp = async () => {
    isSigningUp.current = true;

    const recaptchaToken = recaptchaRef.current?.getValue();

    try {
      const response = await axios.post(
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

      console.log('signUp successful.');
      console.log(response.data)

      const token = await logIn(signUpData.email!, signUpData.password!);
      setAccessToken(token);

      clearSignUpData();

      navigate('/dashboard');

    } catch (error) {
      console.error('signUp failed:', error);
    }
  };

  return (
    <>
      <div className='page'>
        <header className='page-header'></header>
        
        <section className='page-section'>
          <div className='about-you-page-content'>
            <div>
              <h1 className='page-heading'>
                About You
              </h1>
            </div>

            <div>
              <input type='text'
                placeholder='first name (optional)'
                value={signUpData.first_name || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSignUpData(prev => ({ ...prev, first_name: event.target.value }));
                }}
              />
            </div>

            <div>
              <input type='text'
                placeholder='sex (optional)'
                value={signUpData.sex || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSignUpData(prev => ({ ...prev, sex: event.target.value }));
                }}
              />
            </div>

            <div>
              <input type='text'
                placeholder='age (optional)'
                value={signUpData.age ?? ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value;
                  setSignUpData(prev => ({ ...prev, age: value ? Number(value) : undefined }));
                }}
              />
            </div>

            <div>
              <input type='text'
                placeholder='height in inches (optional)'
                value={signUpData.height ?? ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value;
                  setSignUpData(prev => ({ ...prev, height: value ? Number(value) : undefined }));
                }}
              />
            </div>

            <div>
              <input type='text'
                placeholder='weight in lbs (optional)'
                value={signUpData.weight ?? ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const value = event.target.value;
                  setSignUpData(prev => ({ ...prev, weight: value ? Number(value) : undefined }));
                }}
              />
            </div>

            <div>
              <input type='text'
                placeholder='Your health/fitness goal (optional)'
                value={signUpData.goal || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSignUpData(prev => ({ ...prev, goal: event.target.value }));
                }}
              />
            </div>

            <div className="recaptcha-container">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LeFgb4rAAAAAAglinYvi17ogFDuUhj1DC2A9sn0"
                onChange={(token) => setRecaptchaToken(token)}
              />
            </div>

            <button className='button-link' onClick={signUp} disabled={!recaptchaToken}>
              Sign Up
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
