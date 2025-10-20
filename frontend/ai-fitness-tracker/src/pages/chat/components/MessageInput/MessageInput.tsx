import { useState } from "react";
import arrowUpIcon from "./assets/arrow-up-icon.svg"


type MessageInputProps = {
  currentChatId: number | null,
  expandedInputs: Record<number, boolean>,
  tokensRemaining: number,
  inputRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  handleInput: (event: React.FormEvent<HTMLDivElement>) => void,
  handleSendMessage: () => void
};


export default function MessageInput({
  currentChatId,
  expandedInputs,
  tokensRemaining,
  inputRefs,
  handleInput,
  handleSendMessage
}: MessageInputProps) {
  const [placeholderVisible, setPlaceholderVisible] = useState<boolean>(true);


  return (
    <div
      className={
        `
          message-input-container
          ${tokensRemaining <= 0 ? "message-input-container-disabled" : ""}
          ${currentChatId !== null && expandedInputs[currentChatId] ? "expanded" : ""}
        `
      }
      onClick={() => {
        if (currentChatId !== null) {
          inputRefs.current[currentChatId]?.focus()
        }
      }}
    >
      <div
        ref={el => { 
          if (currentChatId !== null) {
            inputRefs.current[currentChatId] = el;
          }
        }}
        contentEditable
        className="message-input"
        onInput={(e) => {
          handleInput(e);
          setPlaceholderVisible((e.currentTarget.textContent ?? "").length === 0);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
            setPlaceholderVisible(true);
          }
        }}
      />
      {placeholderVisible && tokensRemaining > 0 && (
        <p className="message-input-placeholder">How can I help you today?</p>
      )}

      <button className="send-message-button" onClick={handleSendMessage}>
        <img className="button-link-image" src={arrowUpIcon} />
      </button>
    </div>
  );
}
