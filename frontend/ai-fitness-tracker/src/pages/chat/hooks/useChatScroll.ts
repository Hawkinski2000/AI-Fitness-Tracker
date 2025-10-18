import { useState, useRef, useEffect, useCallback } from "react";


const useChatScroll = (
  currentChatId: number | null,
  conversationRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  generatingMessageRef: React.RefObject<boolean>,
) => {
  const [distanceFromBottom, setDistanceFromBottom] = useState<number>(0);

  const bottomRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const mainRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef(false);


  const scrollToBottom = useCallback((chatId: number, behavior: ScrollBehavior = "auto") => {
    requestAnimationFrame(() => {
      bottomRefs.current[chatId]?.scrollIntoView({ behavior });
    });
  }, []);

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
  }, [currentChatId, conversationRefs]);

// ---------------------------------------------------------------------------

  const scrollUserMessage = useCallback((chatId: number) => {
    const container = conversationRefs.current[chatId];

    if (!container) {
      return;
    }

    const viewportHeight = window.innerHeight;
    const extraSpace = viewportHeight / 2 - 100;
    container.style.minHeight = `${container.scrollHeight + extraSpace}px`;

    bottomRefs.current[chatId]?.scrollIntoView({ behavior: "smooth" });
  }, [conversationRefs]);

// ---------------------------------------------------------------------------

  const attachScrollListener = useCallback((element: HTMLDivElement | null) => {
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
  }, [generatingMessageRef]);


  return {
    distanceFromBottom,
    setDistanceFromBottom,
    bottomRefs,
    userScrolledUpRef,
    scrollToBottom,
    scrollUserMessage,
    attachScrollListener
  }
};


export default useChatScroll;
