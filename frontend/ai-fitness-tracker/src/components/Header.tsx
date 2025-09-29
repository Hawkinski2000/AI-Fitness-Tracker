import { type User } from '../pages/chat/ChatPage.tsx'
import AccountImage from './AccountImage';
import tokenIcon from '../assets/token-icon.svg';


type HeaderProps = {
  isRemovingTokens: boolean | null;
  tokensRemaining: number;
  accountMenuOpen: boolean;
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: User | null;
  accountMenuRef: React.RefObject<HTMLDivElement | null>;
  handleLogOut: () => Promise<void>;
};

export default function Header({
  isRemovingTokens,
  tokensRemaining,
  accountMenuOpen,
  setAccountMenuOpen,
  userData,
  accountMenuRef,
  handleLogOut
}: HeaderProps) {
  return (
    <header className='page-header'>
      <p
        className="token-count"
        style={(isRemovingTokens || tokensRemaining <= 0) ? { color: 'red' } : undefined}
      >
        {tokensRemaining.toLocaleString()}
        <img
          className="button-link-image"
          src={tokenIcon}
          style={{ width: '1.5rem' }}
        />
      </p>

      <AccountImage
        accountMenuOpen={accountMenuOpen}
        setAccountMenuOpen={setAccountMenuOpen}
        userData={userData}
        accountMenuRef={accountMenuRef}
        handleLogOut={handleLogOut}
      />
    </header>
  );
}
