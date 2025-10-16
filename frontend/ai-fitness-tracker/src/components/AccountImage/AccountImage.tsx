import { type UserType } from '../../types/app'
import accountIcon from './assets/account-icon.svg';
import settingsIcon from './assets/settings-icon.svg';
import logoutIcon from './assets/logout-icon.svg';


type AccountImageProps = {
  accountMenuOpen: boolean;
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserType | null;
  accountMenuRef: React.RefObject<HTMLDivElement | null>;
  handleLogOut: () => Promise<void>;
};

export default function AccountImage({
  accountMenuOpen,
  setAccountMenuOpen,
  userData,
  accountMenuRef,
  handleLogOut
}: AccountImageProps) {
  return (
    <>
      <div
        className={`
          account-image
          ${accountMenuOpen ? 'account-image-open' : ''}
        `}
        onClick={() => {
          setAccountMenuOpen((prev) => !prev);
        }}
      >
        <p className="account-image-initial">
          {userData?.first_name?.[0] ?? userData?.username[0] ?? ''}
        </p>
      </div>

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
          onClick={handleLogOut}
        >
          <img className="button-link-image" src={logoutIcon} />
          Log out
        </button>
      </div>
    </>
  );
}
