import axios from 'axios';
import { type Chat, type ConversationItem } from '../pages/dashboard/DashboardPage';
import { API_BASE_URL } from '../config/api';


export const createChat = async (setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
                                 token: string) => {
  const newChatResponse = await axios.post(`${API_BASE_URL}/chats`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  
  const newChat = newChatResponse.data;

  setChats(prevChats => [newChat, ...prevChats]);

  return newChat;
};

export const loadChats = async (setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
                                token: string) => {
  const chatsResponse = await axios.get(`${API_BASE_URL}/chats`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (chatsResponse.data.length === 0) {
    return []
  }
  
  const chats: Chat[] = chatsResponse.data.map((chat: Chat) => ({id: chat.id, title: chat.title || 'New chat'}));
  setChats(chats);

  return chats;
};

interface Message {
  type: 'message' | 'reasoning' | 'function_call'
  role?: 'user' | 'assistant'
  message: {
    content?: string | { text: string }[];
    name?: string;
  };
}
export const loadChatHistory = async (chatId: number,
                                      setConversations: React.Dispatch<React.SetStateAction<Record<number, ConversationItem[]>>>,
                                      token: string) => {
  const messagesResponse = await axios.get(`${API_BASE_URL}/messages/${chatId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const formattedMessages: ConversationItem[] = messagesResponse.data.map((message: Message) => {
    let text = '';

    if (message.type === 'message' && message.message.content) {
      if (message.role === 'user') {
        if (typeof message.message.content === 'string') {
          text = message.message.content;
        }
      }
      else if (Array.isArray(message.message.content)) {
        text = message.message.content[0].text;
      }
    }

    if (message.type === 'message') {
      return {
        type: message.role === 'user' ? 'user' : 'assistant',
        content: text,
      };
    } else if (message.type === 'reasoning') {
      return { type: 'reasoning', content: 'Reasoning...' };
    } else {
      return { type: 'function_call', content: `Calling ${message.message.name}...` };
    }
  });
  
  setConversations(prev => ({
    ...prev,
    [chatId]: [
      ...(prev[chatId] || []),
      ...formattedMessages
    ]
  }));
};
