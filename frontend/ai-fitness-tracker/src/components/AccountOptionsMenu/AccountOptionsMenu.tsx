import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/auth/useAuth";
import { logOut } from "../../utils/auth";
import accountIcon from './assets/account-icon.svg';
import settingsIcon from './assets/settings-icon.svg';
import logoutIcon from './assets/logout-icon.svg';
import './AccountOptionsMenu.css';


type AccountOptionsMenuProps = {
  accountMenuOpen: boolean;
  accountMenuRef: React.RefObject<HTMLDivElement | null>;
};


export default function AccountOptionsMenu({
  accountMenuOpen,
  accountMenuRef
}: AccountOptionsMenuProps) {
  const { setAccessToken } = useAuth();

  const navigate = useNavigate();

  
  return (
    <div
      className={`account-menu ${accountMenuOpen && 'account-menu-open'}`}
      ref={accountMenuRef}
    >
      <button
        className="account-menu-button"
      >
        <img className="button-link-image" src={accountIcon} />
        Account
      </button>
      
      <button
        className="account-menu-button"
      >
        <img className="button-link-image" src={settingsIcon} />
        Settings
      </button>

      <button
        className="account-menu-button"
        onClick={() => {
          logOut();
          setAccessToken(null);
          navigate("/");
        }}
      >
        <img className="button-link-image" src={logoutIcon} />
        Log out
      </button>
    </div>
  );
}
