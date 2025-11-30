import { Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from "./context/auth/AuthProvider";
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/signup/SignupPage';
import AboutYouPage from './pages/about-you/AboutYouPage';
import ChatPage from './pages/chat/components/ChatPage/ChatPage';
import MealLogsPage from './pages/meal-logs/components/MealLogsPage/MealLogsPage';
import WorkoutLogsPage from './pages/workout-logs/components/WorkoutLogsPage/WorkoutLogsPage';
import SleepLogsPage from './pages/sleep-logs/components/SleepLogsPage/SleepLogsPage';


export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="signup/about-you" element={<AboutYouPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="meal-logs" element={<MealLogsPage />} />
        <Route path="workout-logs" element={<WorkoutLogsPage />} />
        <Route path="sleep-logs" element={<SleepLogsPage />} />
      </Routes>
    </AuthProvider>
  )
}
