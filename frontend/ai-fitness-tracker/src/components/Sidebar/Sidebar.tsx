import { useNavigate } from 'react-router-dom';
import chatIcon from './assets/chat-icon.svg';
import mealIcon from './assets/meal-icon.svg';
import exerciseIcon from './assets/exercise-icon.svg';
import sleepIcon from './assets/sleep-icon.svg';
import moodIcon from './assets/mood-icon.svg';
import weightIcon from './assets/weight-icon.svg';


type SidebarProps = {
  currentPage: string;
};


export default function Sidebar({ currentPage }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <nav className="sidebar">
      <button
        className={
          `
            button-link
            sidebar-button-link
            ${currentPage === 'chat' ? 'sidebar-button-link-activated' : ''}
          `
        }
        onClick={() => { if (currentPage !== 'chat') navigate('/chat') }}
      >
        <img className="sidebar-button-link-image" src={chatIcon} />
        Chat
      </button>

      <button
        className={
          `
            button-link
            sidebar-button-link
            ${currentPage === 'meal-logs' ? 'sidebar-button-link-activated' : ''}
          `
        }
        onClick={() => { if (currentPage !== 'meal-logs') navigate('/meal-logs') }}
      >
        <img className="sidebar-button-link-image" src={mealIcon} />
        Meal Logs
      </button>

      <button
        className={
          `
            button-link
            sidebar-button-link
            ${currentPage === 'workout-logs' ? 'sidebar-button-link-activated' : ''}
          `
        }
        onClick={() => { if (currentPage !== 'workout-logs') navigate('/workout-logs') }}
      >
        <img className="sidebar-button-link-image" src={exerciseIcon} />
        Workout Logs
      </button>

      <button
        className={
          `
            button-link
            sidebar-button-link
            ${currentPage === 'sleep-logs' ? 'sidebar-button-link-activated' : ''}
          `
        }
        onClick={() => { if (currentPage !== 'sleep-logs') navigate('/sleep-logs') }}
      >
        <img className="sidebar-button-link-image" src={sleepIcon} />
        Sleep Logs
      </button>

      <button
        className={
          `
            button-link
            sidebar-button-link
            ${currentPage === 'mood-logs' ? 'sidebar-button-link-activated' : ''}
          `
        }
        onClick={() => { if (currentPage !== 'mood-logs') navigate('/mood-logs') }}
      >
        <img className="sidebar-button-link-image" src={moodIcon} />
        Mood Logs
      </button>

      <button
        className={
          `
            button-link
            sidebar-button-link
            ${currentPage === 'weight-logs' ? 'sidebar-button-link-activated' : ''}
          `
        }
        onClick={() => { if (currentPage !== 'weight-logs') navigate('/weight-logs') }}
      >
        <img className="sidebar-button-link-image" src={weightIcon} />
        Weight Logs
      </button>
    </nav>
  );
}
