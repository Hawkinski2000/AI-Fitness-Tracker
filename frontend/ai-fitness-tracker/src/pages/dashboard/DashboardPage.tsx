import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { PropagateLoader } from 'react-spinners';
import { useAuth } from "../../context/auth/useAuth";
import { refreshAccessToken, getUserFromToken } from "../../utils/auth";
import './DashboardPage.css';


export default function DashboardPage() {
  interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string | null;
    sex?: string | null;
    age?: string | null;
    height?: string | null;
    weight?: string | null;
    goal?: string | null;
  }
  
  const { accessToken, setAccessToken } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = accessToken || await refreshAccessToken(accessToken);
        
        if (!token) {
          throw new Error("No access token");
        }

        setAccessToken(token);

        const userData = await getUserFromToken(token);
        setUserData(userData);

      } catch (err) {
        console.error(err);
        setAccessToken(null);
        navigate("/");

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, setAccessToken, navigate]);

  if (loading) {
    return (
      <div className='loading-screen'>
         <PropagateLoader size={20} color="#00ffcc" />
      </div>
    );
  }

  return (
    <>
      <div className='dashboard-page'>
        <header className='page-header'></header>
        
        <section className='page-section'>
          <div className='dashboard-page-content'>
            <div>
              <h1 className='page-heading'>
                Welcome
                {userData?.first_name || userData?.username
                  ? `, ${userData.first_name || userData.username}!`
                  : " back!"}
              </h1>
            </div>
        
          </div>
        </section>
      </div>
    </>
  );
}
