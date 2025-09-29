import chatIcon from '../assets/chat-icon.svg';
import mealIcon from '../assets/meal-icon.svg';
import exerciseIcon from '../assets/exercise-icon.svg';
import sleepIcon from '../assets/sleep-icon.svg';
import moodIcon from '../assets/mood-icon.svg';
import weightIcon from '../assets/weight-icon.svg';


type SidebarProps = {
  currentPage: string;
};

export default function Sidebar({ currentPage }: SidebarProps) {
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
      >
        <img className="sidebar-button-link-image" src={chatIcon} />
        Chat
      </button>

      <button
        className={
          `
            button-link
            sidebar-button-link
            ${currentPage === 'mealLogs' ? 'sidebar-button-link-activated' : ''}
          `
        }
      >
        <img className="sidebar-button-link-image" src={mealIcon} />
        Meal Logs
      </button>

      <button
        className={
          `
            button-link
            sidebar-button-link
            ${currentPage === 'workoutLogs' ? 'sidebar-button-link-activated' : ''}
          `
        }
      >
        <img className="sidebar-button-link-image" src={exerciseIcon} />
        Workout Logs
      </button>

      <button
        className={
          `
            button-link
            sidebar-button-link
            ${currentPage === 'sleepLogs' ? 'sidebar-button-link-activated' : ''}
          `
        }
      >
        <img className="sidebar-button-link-image" src={sleepIcon} />
        Sleep Logs
      </button>

      <button
        className={
          `
            button-link
            sidebar-button-link
            ${currentPage === 'moodLogs' ? 'sidebar-button-link-activated' : ''}
          `
        }
      >
        <img className="sidebar-button-link-image" src={moodIcon} />
        Mood Logs
      </button>

      <button
        className={
          `
            button-link
            sidebar-button-link
            ${currentPage === 'weightLogs' ? 'sidebar-button-link-activated' : ''}
          `
        }
      >
        <img className="sidebar-button-link-image" src={weightIcon} />
        Weight Logs
      </button>
    </nav>
  );
}