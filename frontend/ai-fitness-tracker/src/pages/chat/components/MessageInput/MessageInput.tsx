import arrowUpIcon from "./assets/arrow-up-icon.svg"


type MessageInputProps = {
  currentChatId: number | null,
  expandedInputs: Record<number, boolean>,
  inputRefs: React.RefObject<Record<number, HTMLDivElement | null>>,
  handleInput: (event: React.FormEvent<HTMLDivElement>) => void,
  handleSendMessage: () => void
};


export default function MessageInput({
  currentChatId,
  expandedInputs,
  inputRefs,
  handleInput,
  handleSendMessage
}: MessageInputProps) {
  return (
    <div
      className={
        `message-input-container
        ${currentChatId !== null && expandedInputs[currentChatId] ? "expanded" : ""}`
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
        data-placeholder="How can I help you today?"
        className="message-input"
        onInput={handleInput}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
            e.preventDefault();
          }
        }}
      />
      <button className="send-message-button" onClick={handleSendMessage}>
        <img className="button-link-image" src={arrowUpIcon} />
      </button>
    </div>
  );
}
