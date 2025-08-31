import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { logIn } from '../../utils/auth';
import './SignupPage.css';


export default function SignupPage() {
  const [usernameString, setUsernameString] = useState<string>('');
  const [emailString, setEmailString] = useState<string>('');
  const [passwordString, setPasswordString] = useState<string>('');
  const [repeatPasswordString, setRepeatPasswordString] = useState<string>('');

  const updateUsernameString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameString(event.target.value);
  };
  const updateEmailString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailString(event.target.value);
  };
  const updatePasswordString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordString(event.target.value);
  };
  const updateRepeatPasswordString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatPasswordString(event.target.value);
  };

  const navigate = useNavigate();

  const continueToAboutYouPage = async () => {
    if (passwordString !== repeatPasswordString) {
      console.error("Passwords do not match!");
      return;
    }

    try {
      const body = {
        'username': usernameString,
        'email': emailString,
        'password': passwordString
      }

      const response = await axios.post(
        'http://172.24.192.1:8000/api/users',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Creating user successful.');
      
      const token = await logIn(emailString, passwordString);
      console.log(`Access token: ${token}`)

      const user = response.data;
      navigate('/about-you', { 
        state: {
          token: token,
          id: user.id,
          usernameString: usernameString,
          emailString: emailString,
          passwordString: passwordString
        } 
      });

    } catch (error) {
      console.error('continueToAboutYouPage failed:', error);
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
              <input type='text' placeholder='enter username*' value={usernameString} onChange={updateUsernameString} />
            </div>

            <div>
              <input type='text' placeholder='enter email*' value={emailString} onChange={updateEmailString} />
            </div>

            <div>
              <input type='password' placeholder='enter password*' value={passwordString} onChange={updatePasswordString} />
            </div>

            <div>
              <input type='password' placeholder='re-enter password*' value={repeatPasswordString} onChange={updateRepeatPasswordString} />
            </div>

            <button className='button-link' onClick={continueToAboutYouPage}>
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
