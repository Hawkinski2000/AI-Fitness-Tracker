import { useState, useRef } from "react";
import { type Chat, type ConversationItemType } from "../../types/chat"
import useChatScroll from "../../hooks/useChatScroll";
import useChatActions from "../../hooks/useChatActions";
import useChatClickOutside from "../../hooks/useChatClickOutside";
import useInitializeChatPage from "../../hooks/useInitializeChatPage";
import useMessageInput from "../../hooks/useMessageInput";
import useMessageStream from "../../hooks/useMessageStream";
import LoadingScreen from "../../../../components/LoadingScreen/LoadingScreen";
import Header from "../../../../components/Header/Header";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import ChatPageSidebar from "../ChatPageSidebar/ChatPageSidebar";
import ChatWelcomeHeading from "../ChatWelcomeHeading/ChatWelcomeHeading";
import Conversation from "../Conversation/Conversation";
import MessageInput from "../MessageInput/MessageInput";
import ScrollButton from "../ScrollButton/ScrollButton";
import './ChatPage.css';


export default function ChatPage() {
  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const chatsLoadedRef = useRef<Record<number, boolean>>({});
  
  const [chatHistoryCollapsed, setChatHistoryCollapsed] = useState(false);

  const [chatOptionsMenuOpenId, setChatOptionsMenuOpenId] = useState<number | null>(null);
  const chatOptionsMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [editingChatTitleId, setEditingChatTitleId] = useState<number | null>(null);
  const editingChatTitleRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [conversations, setConversations] = useState<Record<number, ConversationItemType[]>>({});
  const conversationRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const generatingMessageRef = useRef(false);

  const {
    distanceFromBottom,
    setDistanceFromBottom,
    bottomRefs,
    userScrolledUpRef,
    scrollToBottom,
    scrollUserMessage,
    attachScrollListener
  } = useChatScroll(
    currentChatId,
    conversationRefs,
    generatingMessageRef
  );

  const {
    handleSelectChat,
    handleCreateChat,
    handleDeleteChat,
    handleGenerateChatTitle,
    handleUpdateChatTitle,
    setNewChatTitle
  } = useChatActions(
    chats,
    setChats,
    setCurrentChatId,
    setConversations,
    setDistanceFromBottom,
    setEditingChatTitleId,
    chatsLoadedRef,
    conversationRefs,
    userScrolledUpRef,
    editingChatTitleRefs,
    scrollToBottom
  );

  useChatClickOutside(
    chatOptionsMenuOpenId,
    setChatOptionsMenuOpenId,
    editingChatTitleId,
    setAccountMenuOpen,
    chatOptionsMenuRefs,
    editingChatTitleRefs,
    accountMenuRef,
    handleUpdateChatTitle
  );

  const { userData, loading } = useInitializeChatPage(
    setTokensRemaining,
    setChats,
    setCurrentChatId,
    setConversations,
    chatsLoadedRef,
    scrollToBottom,
    handleCreateChat
  );

  const {
    isRemovingTokens,
    createMessageStream,
    reasoningEvents,
    callingFunctions
  } = useMessageStream(
    tokensRemaining,
    setTokensRemaining,
    conversations,
    setConversations,
    chats,
    setChats,
    generatingMessageRef,
    conversationRefs,
    userScrolledUpRef,
    handleGenerateChatTitle,
    scrollUserMessage,
    scrollToBottom
  )

  const {
    handleInput,
    handleSendMessage,
    expandedInputs,
    inputRefs
  } = useMessageInput(
    currentChatId,
    createMessageStream
  )


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className='chat-page'>
        <Header
          isRemovingTokens={isRemovingTokens}
          tokensRemaining={tokensRemaining}
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
          userData={userData}
          accountMenuRef={accountMenuRef}
        />

        <div className="page-body">
          <Sidebar currentPage={'chat'} />

          <ChatPageSidebar
            chatHistoryCollapsed={chatHistoryCollapsed}
            setChatHistoryCollapsed={setChatHistoryCollapsed}
            currentChatId={currentChatId}
            chats={chats}
            editingChatTitleId={editingChatTitleId}
            setEditingChatTitleId={setEditingChatTitleId}
            chatOptionsMenuOpenId={chatOptionsMenuOpenId}
            setChatOptionsMenuOpenId={setChatOptionsMenuOpenId}
            setNewChatTitle={setNewChatTitle}
            chatOptionsMenuRefs={chatOptionsMenuRefs}
            editingChatTitleRefs={editingChatTitleRefs}
            handleSelectChat={handleSelectChat}
            handleCreateChat={handleCreateChat}
            handleDeleteChat={handleDeleteChat}
            handleUpdateChatTitle={handleUpdateChatTitle}
          />

          <main
            className={`page-main chat-main ${chatHistoryCollapsed ? 'chat-main-collapsed' : ''}`}
            ref={attachScrollListener}
          >
            <div className='chat-page-content'>
              {currentChatId !== null && (conversations[currentChatId]?.length || 0) === 0 && (
                <ChatWelcomeHeading userData={userData} />
              )}

              <Conversation
                currentChatId={currentChatId}
                conversations={conversations}
                conversationRefs={conversationRefs}
                bottomRefs={bottomRefs}
                reasoningEvents={reasoningEvents}
                callingFunctions={callingFunctions}
              />
              
              <MessageInput
                currentChatId={currentChatId}
                expandedInputs={expandedInputs}
                tokensRemaining={tokensRemaining}
                inputRefs={inputRefs}
                handleInput={handleInput}
                handleSendMessage={handleSendMessage}
              />

              <ScrollButton
                currentChatId={currentChatId}
                distanceFromBottom={distanceFromBottom}
                setDistanceFromBottom={setDistanceFromBottom}
                userScrolledUpRef={userScrolledUpRef}
                scrollToBottom={scrollToBottom}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
