import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { logIn } from '../../utils/auth';
import { useAuth } from "../../context/useAuth";
import './LoginPage.css';


export default function LoginPage() {
  const [emailString, setEmailString] = useState<string>('');
  const [passwordString, setPasswordString] = useState<string>('');

  const updateEmailString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailString(event.target.value);
  };
  const updatePasswordString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordString(event.target.value);
  };

  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const continueToDashboard = async () => {
    try {
      const token = await logIn(emailString, passwordString);
      setAccessToken(token)
      navigate('/dashboard');

    } catch (error) {
      console.error('continueToDashboard failed', error);
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

            <div>
              <input type='email' placeholder='enter email' value={emailString} onChange={updateEmailString} />
            </div>

            <div>
              <input type='password' placeholder='enter password' value={passwordString} onChange={updatePasswordString} />
            </div>

            <button className='button-link' onClick={continueToDashboard} disabled={!emailString || !passwordString}>
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
