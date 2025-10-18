import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../../context/auth/useAuth";
import { type Chat, type ConversationItemType } from "../../types/chat"
import { logOut } from "../../../../utils/auth";
import useChatActions from "../../hooks/useChatActions";
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
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const chatsLoadedRef = useRef<Record<number, boolean>>({});
  
  const [conversations, setConversations] = useState<Record<number, ConversationItemType[]>>({});

  const [accountMenuOpen, setAccountMenuOpen] = useState<boolean>(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const [chatOptionsMenuOpenId, setChatOptionsMenuOpenId] = useState<number | null>(null);
  const chatOptionsMenuRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [editingChatTitleId, setEditingChatTitleId] = useState<number | null>(null);
  const editingChatTitleRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const conversationRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const bottomRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const mainRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef(false);
  const [distanceFromBottom, setDistanceFromBottom] = useState<number>(0);
  const generatingMessageRef = useRef(false);

  const [tokensRemaining, setTokensRemaining] = useState<number>(0);

  const [chatHistoryCollapsed, setChatHistoryCollapsed] = useState(false);

  const scrollToBottom = useCallback((chatId: number, behavior: ScrollBehavior = "auto") => {
    requestAnimationFrame(() => {
      bottomRefs.current[chatId]?.scrollIntoView({ behavior });
    });
  }, []);

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

  const { userData, loading } = useInitializeChatPage(
    setTokensRemaining,
    setChats,
    setCurrentChatId,
    setConversations,
    chatsLoadedRef,
    scrollToBottom,
    handleCreateChat
  );

// ---------------------------------------------------------------------------

  const scrollUserMessage = (chatId: number) => {
    const container = conversationRefs.current[chatId];

    if (!container) {
      return;
    }

    const viewportHeight = window.innerHeight;
    const extraSpace = viewportHeight / 2 - 100;
    container.style.minHeight = `${container.scrollHeight + extraSpace}px`;

    bottomRefs.current[chatId]?.scrollIntoView({ behavior: "smooth" });
  }

// ---------------------------------------------------------------------------

  const attachScrollListener = (element: HTMLDivElement | null) => {
  if (!element) {
    return;
  }

  mainRef.current = element;

  let lastScrollTop = element.scrollTop;

  const handleScroll = () => {
    const currentScrollTop = element.scrollTop;
    const distance = element.scrollHeight - element.clientHeight - currentScrollTop;

    if (currentScrollTop < lastScrollTop && generatingMessageRef.current) {
      userScrolledUpRef.current = true;
    } else if (currentScrollTop > lastScrollTop) {
      userScrolledUpRef.current = false;
    }

    lastScrollTop = currentScrollTop;

    setDistanceFromBottom(distance);
  };

  element.addEventListener("scroll", handleScroll);
  return () => element.removeEventListener("scroll", handleScroll);
};

// ---------------------------------------------------------------------------

  useEffect(() => {
    if (currentChatId === null) {
      return;
    }
    
    const container = conversationRefs.current[currentChatId];
    if (!container) {
      return;
    }

    container.style.minHeight = '';
  }, [currentChatId]);

// ---------------------------------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (
        chatOptionsMenuOpenId &&
        chatOptionsMenuRefs.current[chatOptionsMenuOpenId] &&
        target instanceof Node &&
        !chatOptionsMenuRefs.current[chatOptionsMenuOpenId].contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('chat-options-button'))
      ) {
        setChatOptionsMenuOpenId(null);
      }

      if (
        editingChatTitleId &&
        editingChatTitleRefs.current[editingChatTitleId] &&
        target instanceof Node &&
        !editingChatTitleRefs.current[editingChatTitleId].contains(target)
      ) {
        handleUpdateChatTitle(editingChatTitleId);
      }

      if (
        accountMenuRef.current &&
        target instanceof Node &&
        !accountMenuRef.current.contains(target) &&
        !(target instanceof HTMLElement && target.classList.contains('account-image'))
      ) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [chatOptionsMenuOpenId, editingChatTitleId, handleUpdateChatTitle]);

// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------

  const handleLogOut = async () => {
    logOut();
    setAccessToken(null);
    navigate("/");
  };

// ---------------------------------------------------------------------------

  const {
    handleInput,
    handleSendMessage,
    expandedInputs,
    inputRefs
  } = useMessageInput(
    currentChatId,
    createMessageStream
  )

// ---------------------------------------------------------------------------

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
          handleLogOut={handleLogOut}
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
