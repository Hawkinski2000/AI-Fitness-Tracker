import { type Chat } from '../../types/chat';
import editIcon from '../../../../assets/edit-icon.svg';
import pinIcon from '../../../../assets/pin-icon.svg';
import deleteIcon from '../../../../assets/delete-icon.svg';


type ChatOptionsMenuProps = {
  chat: Chat;
  chatOptionsMenuOpenId: number | null;
  setChatOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  setEditingChatTitleId: React.Dispatch<React.SetStateAction<number | null>>;
  chatOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  editingChatTitleRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  handleDeleteChat: (chatId: number) => Promise<void>;
};


export default function ChatOptionsMenu({
  chat,
  chatOptionsMenuOpenId,
  setChatOptionsMenuOpenId,
  setEditingChatTitleId,
  chatOptionsMenuRefs,
  editingChatTitleRefs,
  handleDeleteChat
}: ChatOptionsMenuProps) {
  return (
    <div
      ref={el => { chatOptionsMenuRefs.current[chat.id] = el }}
      className={`chat-options-menu ${chatOptionsMenuOpenId === chat.id && 'chat-options-menu-open'}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="chat-options-menu-button"
        onClick={(e) => {
          e.stopPropagation();
          
          setEditingChatTitleId((prev) => (prev === chat.id ? null : chat.id));
          setChatOptionsMenuOpenId(null);
          requestAnimationFrame(() => {
            const chatTitle = editingChatTitleRefs.current[chat.id];
            if (!chatTitle) {
              return;
            }

            chatTitle.focus();

            const range = document.createRange();
            range.selectNodeContents(chatTitle);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
          });
        }}
      >
        <img className="button-link-image" src={editIcon} />
        Rename
      </button>
      <button
        className="chat-options-menu-button"
      >
        <img className="button-link-image" src={pinIcon} />
        Pin
      </button>
      <button
        className="chat-options-menu-button chat-options-delete-button"
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteChat(chat.id);
        }}
      >
        <img className="button-link-image" src={deleteIcon} />
        Delete
      </button>
    </div>
  );
}
