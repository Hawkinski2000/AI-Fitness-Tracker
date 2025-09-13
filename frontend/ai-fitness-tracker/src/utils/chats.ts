import axios from 'axios';
import { type Chat, type ConversationItem } from '../pages/dashboard/DashboardPage';
import { API_BASE_URL } from '../config/api';


export const loadChats = async (setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
                                token: string) => {
  const chatsResponse = await axios.get(`${API_BASE_URL}/chats`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const chats: Chat[] = chatsResponse.data.map((chat: Chat) => ({id: chat.id, title: chat.title}));
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
export const loadChatHistory = async (chat_id: number,
                                      setConversation: React.Dispatch<React.SetStateAction<ConversationItem[]>>,
                                      token: string) => {
  const messagesResponse = await axios.get(`${API_BASE_URL}/messages/${chat_id}`,
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
  
  setConversation(formattedMessages);
};
