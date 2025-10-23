import { type Chat } from "../../types/chat";
import ChatHistoryItem from "../ChatHistoryItem/ChatHistoryItem";
import closePanelIcon from "./assets/close-panel-icon.svg";
import openPanelIcon from "./assets/open-panel-icon.svg";
import newChatIcon from "./assets/new-chat-icon.svg";
import searchIcon from "./assets/search-icon.svg";
import './ChatPageSidebar.css';


type ChatPageSidebarProps = {
  chatHistoryCollapsed: boolean,
  setChatHistoryCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
  currentChatId: number | null,
  chats: Chat[],
  editingChatTitleId: number | null,
  setEditingChatTitleId: React.Dispatch<React.SetStateAction<number | null>>,
  chatOptionsMenuOpenId: number | null,
  setChatOptionsMenuOpenId: React.Dispatch<React.SetStateAction<number | null>>,
  setNewChatTitle: React.Dispatch<React.SetStateAction<string | null>>,
  chatOptionsMenuRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  editingChatTitleRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  handleSelectChat: (chatId: number) => Promise<void>,
  handleCreateChat: () => Promise<void>,
  handleDeleteChat: (chatId: number) => Promise<void>,
  handleUpdateChatTitle: (chatId: number) => Promise<void>
};


export default function ChatPageSidebar({
  chatHistoryCollapsed,
  setChatHistoryCollapsed,
  currentChatId,
  chats,
  editingChatTitleId,
  setEditingChatTitleId,
  chatOptionsMenuOpenId,
  setChatOptionsMenuOpenId,
  setNewChatTitle,
  chatOptionsMenuRefs,
  editingChatTitleRefs,
  handleSelectChat,
  handleCreateChat,
  handleDeleteChat,
  handleUpdateChatTitle
}: ChatPageSidebarProps) {
  return (
    <>
      {!chatHistoryCollapsed ? (
        <nav className="chat-history">
          <div className="chat-history-button-container">
            <div className="chat-history-collapse-button-container">
              <button
              className="chat-history-collapse-button"
              onClick={() => setChatHistoryCollapsed(true)}
            >
              <img className="button-link-image" src={closePanelIcon} />
            </button>
            </div>
            <div className="chat-history-item">
              <button
                className="button-link chat-history-button-link"
                onClick={handleCreateChat}
              >
                <img className="button-link-image" src={newChatIcon} />
                New chat
              </button>
            </div>

            <div className="chat-history-item">
              <button
                className="button-link chat-history-button-link"
              >
                <img className="button-link-image" src={searchIcon} />
                Search chats
              </button>
            </div>
          </div>

          <div className="chats-container">
            <div className="chat-history-text-container">Chats</div>

            {chats.map((chat) => {
              return (
                <ChatHistoryItem
                  key={chat.id}
                  chat={chat}
                  editingChatTitleId={editingChatTitleId}
                  editingChatTitleRefs={editingChatTitleRefs}
                  currentChatId={currentChatId}
                  chatOptionsMenuOpenId={chatOptionsMenuOpenId}
                  setNewChatTitle={setNewChatTitle}
                  setChatOptionsMenuOpenId={setChatOptionsMenuOpenId}
                  chatOptionsMenuRefs={chatOptionsMenuRefs}
                  setEditingChatTitleId={setEditingChatTitleId}
                  handleSelectChat={handleSelectChat}
                  handleUpdateChatTitle={handleUpdateChatTitle}
                  handleDeleteChat={handleDeleteChat}
                />
              );
            })}
          </div>
        </nav>
        ) : (
        <nav className="chat-history chat-history-collapsed">
          <div
            className="chat-history-collapse-button-container"
            style={{ textAlign: 'center' }}
          >
            <button
              className="chat-history-collapse-button"
              onClick={() => setChatHistoryCollapsed(false)}
            >
              <img className="button-link-image" src={openPanelIcon} />
            </button>
          </div>
        </nav>
        )}
    </>
  );
}
