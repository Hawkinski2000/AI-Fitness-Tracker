import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/signup/SignupPage';
import AboutYouPage from './pages/about-you/AboutYouPage';


export default function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="about-you" element={<AboutYouPage />} />
    </Routes>
  )
}
