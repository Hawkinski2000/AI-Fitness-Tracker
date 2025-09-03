import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { PropagateLoader } from 'react-spinners';
import { useAuth } from "../../context/auth/useAuth";
import { API_BASE_URL } from "../../config/api";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token: string | null = accessToken;

        if (!token) {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/tokens/refresh`,
            {},
            { withCredentials: true }
          );

          token = refreshResponse.data.access_token;
          setAccessToken(token);
        };

        if (!token) {
          throw new Error("No access token available");
        }

        interface JwtPayload {
          user_id: number;
        }
        const decoded_token = jwtDecode<JwtPayload>(token);
        const userId = decoded_token.user_id;

        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, setAccessToken]);

  if (loading) {
    return (
      <div className='loading-screen'>
         <PropagateLoader size={20} color="#00ffcc" />
      </div>
    );
  }

  if (!userData) {
    console.error("Could not load user data");
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
