import { type UserType } from '../../types/app'
import AccountImage from '../AccountImage/AccountImage';
import tokenIcon from './assets/token-icon.svg';


type HeaderProps = {
  isRemovingTokens: boolean | null;
  tokensRemaining: number;
  accountMenuOpen: boolean;
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserType | null;
  accountMenuRef: React.RefObject<HTMLDivElement | null>;
};


export default function Header({
  isRemovingTokens,
  tokensRemaining,
  accountMenuOpen,
  setAccountMenuOpen,
  userData,
  accountMenuRef,
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
      />
    </header>
  );
}
