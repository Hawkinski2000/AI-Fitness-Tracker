import ConversationItem from "../ConversationItem/ConversationItem";
import { type ConversationItemType, type ReasoningEvent } from "../../types/chat";
import './Conversation.css';


type ConversationProps = {
  currentChatId: number | null,
  conversations: Record<number, ConversationItemType[]>,
  conversationRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  bottomRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  reasoningEvents: Record<string, ReasoningEvent>;
  callingFunctions: Record<string, boolean>;
};


export default function Conversation({
  currentChatId,
  conversations,
  conversationRefs,
  bottomRefs,
  reasoningEvents,
  callingFunctions
}: ConversationProps) {
  return (
    <div
      className="conversation-container"
      ref={el => { 
        if (currentChatId !== null) {
          conversationRefs.current[currentChatId] = el;
        }
      }}
    >
      {currentChatId !== null &&
        (conversations[currentChatId] || []).map((item: ConversationItemType, index: number) => {
          return (
            <ConversationItem
              key={index}
              item={item}
              index={index}
              reasoningEvents={reasoningEvents}
              callingFunctions={callingFunctions}
            />
          )
        })
      }
      
      <div
        ref={el => { 
          if (currentChatId !== null) {
            bottomRefs.current[currentChatId] = el;
          }
        }}
      />
    </div>
  );
}
