import { type UserType } from "../../../../types/app";


type ChatWelcomeHeadingProps = {
  userData: UserType | null
};


export default function ChatWelcomeHeading({ userData }: ChatWelcomeHeadingProps) {
  return (
    <div>
      <h1 className='page-heading chat-heading'>
        Welcome
        {userData?.first_name || userData?.username
          ? `, ${userData.first_name || userData.username}!`
          : " back!"}
      </h1>
    </div>
  );
}
