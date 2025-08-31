import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AboutYouPage.css';


export default function AboutYouPage() {
  const [firstNameString, setFirstNameString] = useState<string>('');
  const [sexString, setSexString] = useState<string>('');
  const [ageString, setAgeString] = useState<string>('');
  const [heightString, setHeightString] = useState<string>('');
  const [weightString, setWeightString] = useState<string>('');
  const [goalString, setGoalString] = useState<string>('');

  const updateFirstNameString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstNameString(event.target.value);
  };
  const updateSexString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSexString(event.target.value);
  };
  const updateAgeString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgeString(event.target.value);
  };
  const updateHeightString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeightString(event.target.value);
  };
  const updateWeightString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeightString(event.target.value);
  };
  const updateGoalString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoalString(event.target.value);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const signUp = async () => {
    try {
      const { token, id, usernameString, emailString, passwordString } = location.state || {};

      if (!token) {
        navigate('/signup');
      }

      const body = {
        'username': usernameString,
        'email': emailString,
        'password': passwordString,
        'first_name': firstNameString || undefined,
        'sex': sexString || undefined,
        'age': ageString ? parseInt(ageString) : undefined,
        'height': heightString ? parseInt(ageString) : undefined,
        'weight': weightString ? parseInt(ageString) : undefined,
        'goal': goalString || undefined,
      }

      const response = await axios.put(
        `http://172.24.192.1:8000/api/users/${id}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Updating user successful.');
      console.log(response);

      navigate('/dashboard', { 
        state: {
          token: token
        }
      });

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
              <input type='text' placeholder='first name (optional)' value={firstNameString} onChange={updateFirstNameString} />
            </div>

            <div>
              <input type='text' placeholder='sex (optional)' value={sexString} onChange={updateSexString} />
            </div>

            <div>
              <input type='text' placeholder='age (optional)' value={ageString} onChange={updateAgeString} />
            </div>

            <div>
              <input type='text' placeholder='height in inches (optional)' value={heightString} onChange={updateHeightString} />
            </div>

            <div>
              <input type='text' placeholder='weight in lbs (optional)' value={weightString} onChange={updateWeightString} />
            </div>

            <div>
              <input type='text' placeholder='Your health/fitness goal (optional)' value={goalString} onChange={updateGoalString} />
            </div>

            <button className='button-link' onClick={signUp}>
              Sign Up
            </button>
          </div>
        </section>
      </div>
    </>
  )
}
