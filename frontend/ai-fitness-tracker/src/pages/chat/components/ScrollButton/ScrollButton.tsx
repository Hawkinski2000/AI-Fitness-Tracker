import arrowDownIcon from "./assets/arrow-down-icon.svg"


type ScrollButtonProps = {
  currentChatId: number | null,
  distanceFromBottom: number,
  setDistanceFromBottom: React.Dispatch<React.SetStateAction<number>>,
  userScrolledUpRef: React.RefObject<boolean>,
  scrollToBottom: (chatId: number, behavior?: ScrollBehavior) => void
};


export default function ScrollButton({
  currentChatId,
  distanceFromBottom,
  setDistanceFromBottom,
  userScrolledUpRef,
  scrollToBottom
}: ScrollButtonProps) {
  return (
    <div className="scroll-button-container">
      <button
        className="scroll-button"
        onClick={() => {
          userScrolledUpRef.current = false;
          setDistanceFromBottom(0);
          if (currentChatId) {
            scrollToBottom(currentChatId, 'smooth');
          }
        }}
        style={
          (userScrolledUpRef.current || distanceFromBottom > 100)
            ? undefined
            : { opacity: '0', pointerEvents: 'none' }
        }
      >
        <img className="button-link-image" src={arrowDownIcon} />
      </button>
    </div>
  );
}
