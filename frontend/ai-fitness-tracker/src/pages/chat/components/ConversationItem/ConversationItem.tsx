import { type ConversationItemType, type ReasoningEvent } from '../../types/chat';
import { PulseLoader } from 'react-spinners';
import ReactMarkdown from 'react-markdown';
import doneIcon from '../../../../assets/done-icon.svg';


type ConversationItemProps = {
  item: ConversationItemType;
  index: number;
  reasoningEvents: Record<string, ReasoningEvent>;
  callingFunctions: Record<string, boolean>;
};


export default function ConversationItem({
  item,
  index,
  reasoningEvents,
  callingFunctions
}: ConversationItemProps) {
  if (item.type === "user") {
    return (
      <div
        key={index}
        className="user-message-container"
      >
        {item.content as string}
      </div>
    );
  } else if (item.type === "reasoning") {
    const id = item.id;
    if (typeof id !== "string") {
      return null;
    }
    let durationSecs = 0;
    let isReasoning = false;

    if (typeof item.content !== "string" && "active" in item.content) {
      durationSecs = item.content.durationSecs;
    }
    else {
      isReasoning = reasoningEvents[id].active === true;
      durationSecs = reasoningEvents[id].durationSecs;
    }

    const seconds = Math.floor(durationSecs);
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    const formatted = (
      seconds < 60
        ? `Thought for ${seconds}s`
        : `Thought for ${minutes}m ${remaining}s`
    );

    return (
      <div key={id} className="reasoning">
        {isReasoning ? (
          <>
            {item.content as string}
            <PulseLoader size={5} color="#00ffcc" />
          </>
        ) : (
          formatted
        )}
      </div>
    );
  } else if (item.type === "function_call") {
    const callId = item.call_id;
    if (typeof callId !== "string") {
      return null;
    }

    let actionText = '';
    let doneText = '';
    if (typeof item.content !== 'string' && 'doneAction' in item.content) {
      if (typeof item.content.action === 'string') {
        actionText = item.content.action;
      }
      doneText = item.content.doneAction;
    }

    const isCalling = callingFunctions[callId] === true;

    return (
        <div key={callId} className="function-call-container">
          <div key={callId} className="function-call">
            {isCalling ? (
              <>
                {actionText} <PulseLoader size={5} color="#00ffcc" />
              </>
            ) : (
              <>
                {doneText}
                <img className="button-link-image" src={doneIcon} />
              </>
            )}
          </div>
        </div>
    );
  } else if (item.type === "assistant") {
    return (
      <div key={index} className="markdown-content">
        <ReactMarkdown>{item.content as string}</ReactMarkdown>
      </div>
    );
  }
  
  return null;
}
