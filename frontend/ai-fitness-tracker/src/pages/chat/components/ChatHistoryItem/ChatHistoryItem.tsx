import { type Chat } from '../../types/chat';
import ChatOptionsMenu from '../ChatOptionsMenu/ChatOptionsMenu';
import dotsIcon from '../../../../assets/dots-icon.svg';


type ChatHistoryItemProps = {
  chat: Chat;
  editingChatTitleId: number | null;
  editingChatTitleRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  currentChatId: number | null;
  chatOptionsMenuOpenId: number | null;
  setNewChatTitle: React.Dispatch<React.SetStateAction<string | null>>;
  setChatOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>;
  chatOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>;
  setEditingChatTitleId: React.Dispatch<React.SetStateAction<number | null>>;
  handleSelectChat:  (chatId: number) => Promise<void>;
  handleUpdateChatTitle: (chatId: number) => Promise<void>;
  handleDeleteChat: (chatId: number) => Promise<void>;
};


export default function ChatHistoryItem({
  chat,
  editingChatTitleId,
  editingChatTitleRefs,
  currentChatId,
  chatOptionsMenuOpenId,
  setNewChatTitle,
  setChatOptionsMenuOpenId,
  chatOptionsMenuRefs,
  setEditingChatTitleId,
  handleSelectChat,
  handleUpdateChatTitle,
  handleDeleteChat
}: ChatHistoryItemProps) {
  return (
    <div key={chat.id} className="chat-history-item">
      <div
        contentEditable={chat.id === editingChatTitleId}
        suppressContentEditableWarning
        ref={el => { editingChatTitleRefs.current[chat.id] = el }}
        key={chat.id}
        className={`
          button-link
          chat-history-button-link
          ${
            (
              chat.id === currentChatId ||
              chat.id === chatOptionsMenuOpenId ||
              chat.id === editingChatTitleId
            ) ? 'chat-history-button-link-selected' : ''
          }
        `}
        onClick={() => chat.id !== currentChatId && handleSelectChat(chat.id)}
        onInput={(event: React.FormEvent<HTMLDivElement>) => {
          const element = event.currentTarget;
          const chatTitleElement = element.querySelector<HTMLParagraphElement>(".chat-title");
          const text = chatTitleElement?.textContent ?? "";
          setNewChatTitle(text);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleUpdateChatTitle(chat.id);
          }
        }}
      >
        <p
          className="chat-title"
          style={chat.id === editingChatTitleId ? { width: '100%', textOverflow: 'clip' } : undefined}
        >
          {chat.title}
        </p>
        <button
          className="chat-options-button"
          onClick={(e) => {
            e.stopPropagation();
            setChatOptionsMenuOpenId((prev) => (prev === chat.id ? null : chat.id));
          }}
          style={{
            ...((chat.id === chatOptionsMenuOpenId) ? { opacity: 1 } : undefined),
            ...(chat.id === editingChatTitleId ? { display: 'none' } : undefined)
          }}
        >
          <img className="button-link-image" src={dotsIcon} />
        </button>
      </div>

      <ChatOptionsMenu
        key={chat.id}
        chat={chat}
        chatOptionsMenuOpenId={chatOptionsMenuOpenId}
        setChatOptionsMenuOpenId={setChatOptionsMenuOpenId}
        setEditingChatTitleId={setEditingChatTitleId}
        chatOptionsMenuRefs={chatOptionsMenuRefs}
        editingChatTitleRefs={editingChatTitleRefs}
        handleDeleteChat={handleDeleteChat}
      />
    </div>
  );
}
