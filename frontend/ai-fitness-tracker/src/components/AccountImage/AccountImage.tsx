import { type UserType } from '../../types/app'
import AccountOptionsMenu from '../AccountOptionsMenu/AccountOptionsMenu';


type AccountImageProps = {
  accountMenuOpen: boolean;
  setAccountMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserType | null;
  accountMenuRef: React.RefObject<HTMLDivElement | null>;
};


export default function AccountImage({
  accountMenuOpen,
  setAccountMenuOpen,
  userData,
  accountMenuRef
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

      <AccountOptionsMenu
        accountMenuOpen={accountMenuOpen}
        accountMenuRef={accountMenuRef}
      />
    </>
  );
}
