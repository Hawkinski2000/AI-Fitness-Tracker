import { Routes, Route } from 'react-router';
import HomePage from './pages/home/HomePage';
import './App.css'


export default function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
    </Routes>
  )
}
