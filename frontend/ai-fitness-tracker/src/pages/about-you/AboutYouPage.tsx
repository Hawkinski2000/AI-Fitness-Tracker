import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/auth/useAuth";
import { refreshAccessToken } from "../../utils/auth";
import { API_BASE_URL } from "../../config/api";
import axios from 'axios';
import './AboutYouPage.css';


export default function AboutYouPage() {
  const isSigningUp = useRef(false);

  interface AboutYouData {
      first_name?: string | null;
      sex?: string | null;
      age?: string | null;
      height?: string | null;
      weight?: string | null;
      goal?: string | null;
    }
    const [aboutYouData, setAboutYouData] = useState<AboutYouData>({
      first_name: '',
      sex: '',
      age: '',
      height: '',
      weight: '',
      goal: ''
    });

  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [sexFocused, setSexFocused] = useState(false);
  const [ageFocused, setAgeFocused] = useState(false);
  const [heightFocused, setHeightFocused] = useState(false);
  const [weightFocused, setWeightFocused] = useState(false);
  const [goalFocused, setGoalFocused] = useState(false);

  const { accessToken, setAccessToken } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSigningUp.current) {
      return;
    }

    const checkToken = async () => {
      try {
        const token = accessToken || await refreshAccessToken(accessToken);
        
        if (!token) {
          navigate('/signup');
          return;
        }

        setAccessToken(token);

      } catch (err) {
        console.error("Failed to refresh token", err);
        navigate('/signup');
      }
    };

    checkToken();
  }, [accessToken, setAccessToken, navigate]);

  const updateUser = async () => {
    isSigningUp.current = true;

    try {
      const token = accessToken || await refreshAccessToken(accessToken);
      
      if (!token) {
        navigate('/signup');
        return;
      }

      setAccessToken(token);

      await axios.patch(
        `${API_BASE_URL}/users`,
        {
          ...aboutYouData,
          age: aboutYouData.age ? parseInt(aboutYouData.age) : undefined,
          height: aboutYouData.height ? parseInt(aboutYouData.height) : undefined,
          weight: aboutYouData.weight ? parseInt(aboutYouData.weight) : undefined,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('updateUser successful.');

      navigate('/dashboard');

    } catch (error) {
      console.error('updateUser failed:', error);
      isSigningUp.current = false;
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

            <div className="input-placeholder-container">
              <input
                type='text'
                value={aboutYouData.first_name || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAboutYouData(prev => ({ ...prev, first_name: event.target.value }));
                }}
                onFocus={() => setFirstNameFocused(true)}
                onBlur={() => setFirstNameFocused(false)}
              />
              <span
                className={
                  `placeholder
                  ${aboutYouData.first_name ? 'float' : ''}
                  ${firstNameFocused ? 'float focus' : ''}`
                }
              >
                first name (optional)
              </span>
            </div>

            <div className="input-placeholder-container">
              <input
                type='text'
                value={aboutYouData.sex || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAboutYouData(prev => ({ ...prev, sex: event.target.value }));
                }}
                onFocus={() => setSexFocused(true)}
                onBlur={() => setSexFocused(false)}
              />
              <span
                className={
                  `placeholder
                  ${aboutYouData.sex ? 'float' : ''}
                  ${sexFocused ? 'float focus' : ''}`
                }
              >
                sex (optional)
              </span>
            </div>

            <div className="input-placeholder-container">
              <input
                type='number'
                value={aboutYouData.age ?? ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAboutYouData(prev => ({ ...prev, age: event.target.value }));
                }}
                onFocus={() => setAgeFocused(true)}
                onBlur={() => setAgeFocused(false)}
              />
              <span
                className={
                  `placeholder
                  ${aboutYouData.age ? 'float' : ''}
                  ${ageFocused ? 'float focus' : ''}`
                }
              >
                age (optional)
              </span>
            </div>

            <div className="input-placeholder-container">
              <input
                type='number'
                value={aboutYouData.height ?? ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAboutYouData(prev => ({ ...prev, height: event.target.value }));
                }}
                onFocus={() => setHeightFocused(true)}
                onBlur={() => setHeightFocused(false)}
              />
              <span
                className={
                  `placeholder
                  ${aboutYouData.height ? 'float' : ''}
                  ${heightFocused ? 'float focus' : ''}`
                }
              >
                height in inches (optional)
              </span>
            </div>

            <div className="input-placeholder-container">
              <input
                type='number'
                value={aboutYouData.weight ?? ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAboutYouData(prev => ({ ...prev, weight: event.target.value }));
                }}
                onFocus={() => setWeightFocused(true)}
                onBlur={() => setWeightFocused(false)}
              />
              <span
                className={
                  `placeholder
                  ${aboutYouData.weight ? 'float' : ''}
                  ${weightFocused ? 'float focus' : ''}`
                }
              >
                weight in lbs (optional)
              </span>
            </div>

            <div className="input-placeholder-container">
              <input
                type='text'
                value={aboutYouData.goal || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAboutYouData(prev => ({ ...prev, goal: event.target.value }));
                }}
                onFocus={() => setGoalFocused(true)}
                onBlur={() => setGoalFocused(false)}
              />
              <span
                className={
                  `placeholder
                  ${aboutYouData.goal ? 'float' : ''}
                  ${goalFocused ? 'float focus' : ''}`
                }
              >
                your health/fitness goal (optional)
              </span>
            </div>

            <button className='button-link' onClick={updateUser}>
              Sign Up
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
