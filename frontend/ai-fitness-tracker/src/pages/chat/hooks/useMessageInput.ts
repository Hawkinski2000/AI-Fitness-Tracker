import { useState, useRef, useCallback } from "react";


const useMessageInput = (
  currentChatId: number | null,
  createMessageStream: (userMessage: string, chatId: number) => Promise<void>
) => {
  const [messages, setMessages] = useState<Record<number, string>>({});
  const [expandedInputs, setExpandedInputs] = useState<Record<number, boolean>>({});
  const inputRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const inputTimeouts = useRef<Record<number, number | null>>({});


  const handleInput = useCallback((event: React.FormEvent<HTMLDivElement>) => {    
    if (!currentChatId) {
      return;
    }

    const element = event.currentTarget;
    const text = element.textContent || "";

    if (inputTimeouts.current[currentChatId]) {
      clearTimeout(inputTimeouts.current[currentChatId]);
    }
    
    inputTimeouts.current[currentChatId] = setTimeout(() => {
      setMessages(prev => {
        return {
          ...prev,
          [currentChatId]: text,
        };
      });
    }, 100);

    const MIN_HEIGHT = 56;

    if (!expandedInputs[currentChatId] && text.length > 0 && element.scrollHeight > MIN_HEIGHT) {
      setExpandedInputs(prev => {
      return {
        ...prev,
        [currentChatId]: true,
      };
    });
    } else if (expandedInputs[currentChatId] && text.length === 0) {
      setExpandedInputs(prev => {
        return {
          ...prev,
          [currentChatId]: false,
        };
      });
    }
  }, [currentChatId, expandedInputs]);

// ---------------------------------------------------------------------------

  const handleSendMessage = useCallback(() => {
    if (!currentChatId || !messages[currentChatId]) {
      return;
    }

    createMessageStream(messages[currentChatId], currentChatId);

    setMessages(prev => {
      return {
        ...prev,
        [currentChatId]: "",
      };
    });

    if (inputRefs.current[currentChatId]) {
      inputRefs.current[currentChatId].textContent = "";
    }

    setExpandedInputs(prev => {
      return {
        ...prev,
        [currentChatId]: false,
      };
    });
  }, [currentChatId, messages, createMessageStream]);


  return {
    inputRefs,
    expandedInputs,
    handleInput,
    handleSendMessage
  };
};


export default useMessageInput;
