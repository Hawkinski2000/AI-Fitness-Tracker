import axios from 'axios';
import { type Chat, type ConversationItemType, type Message } from '../types/chat';
import { API_BASE_URL } from '../../../config/api';


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


export const deleteChat = async (chatId: number,
                                 setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
                                 token: string) => {
  await axios.delete(`${API_BASE_URL}/chats/${chatId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  
  setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
};

// ---------------------------------------------------------------------------

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


export const loadChatHistory = async (chatId: number,
                                      setConversations: React.Dispatch<React.SetStateAction<Record<number, ConversationItemType[]>>>,
                                      token: string) => {
  const messagesResponse = await axios.get(`${API_BASE_URL}/messages/${chatId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const formattedMessages: ConversationItemType[] = messagesResponse.data.map((message: Message) => {
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

    } else if (message.type === 'reasoning' && message.duration_secs) {
      return {
        type: 'reasoning',
        content: {
          active: false,
          startTime: 0,
          durationSecs: message.duration_secs
        },
        id: message.message.id
      };
      
    } else {
      let doneAction = '';
      const name = message.message.name;

      if (name === 'get_meal_log_summaries') {
        doneAction = 'Found meal logs';
      } else if (name === 'get_meal_log_food_summaries') {
        doneAction = 'Found meal log foods';
      } else if (name === 'get_workout_log_summaries') {
        doneAction = 'Found workout logs';
      } else if (name === 'get_workout_log_exercise_summaries') {
        doneAction = 'Found workout log exercises';
      } else if (name === 'get_sleep_log_summaries') {
        doneAction = 'Found sleep logs';
      } else if (name === 'get_mood_log_summaries') {
        doneAction = 'Found mood logs';
      } else if (name === 'get_weight_log_summaries') {
        doneAction = 'Found weight logs';
      }

      return {
        type: 'function_call',
        content: {
          doneAction
        },
        call_id: message.message.call_id
      }
    }
  });
  
  setConversations(prev => ({
    ...prev,
    [chatId]: formattedMessages
  }));
};

// ---------------------------------------------------------------------------

export const generateChatTitle = async (chatId: number,
                                        userMessage: string | null,
                                        token: string) => {
  if (!userMessage) {
    return "New chat";
  }
  
  const response = await axios.post(`${API_BASE_URL}/chats/generate-title`,
    {
      chat_id: chatId,
      user_message: userMessage
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const newChatTitle: string = response.data.new_chat_title;

  return newChatTitle;
};

export const updateChatTitle = async (chatId: number,
                                      newChatTitle: string | null,
                                      token: string) => {
  if (!newChatTitle) {
    return;
  }
                                  
  await axios.patch(`${API_BASE_URL}/chats/${chatId}`,
    {title: newChatTitle},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );  
};
