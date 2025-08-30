import { Routes, Route } from 'react-router';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import './App.css';


export default function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
    </Routes>
  )
}
