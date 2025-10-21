type CaloriesHeaderProps = {
  foodCalories: number;
};


export default function CaloriesHeader({ foodCalories }: CaloriesHeaderProps) {
  return (
    <header className="calories-header">
      <p className="calories-remaining-text">Calories Remaining</p>

      <div className="calories-remaining-calculation">
        <div className="calories-remaining-section">
          <p>3,500</p>
          <p className="calories-remaining-section-label">Goal</p>
        </div>

        <div className="calories-remaining-section">
          <p>-</p>
        </div>

        <div className="calories-remaining-section">
          <p>{foodCalories}</p>
          <p className="calories-remaining-section-label">Food</p>
        </div>

        <div className="calories-remaining-section">
          <p>+</p>
        </div>

        <div className="calories-remaining-section">
          <p>0</p>
          <p className="calories-remaining-section-label">Exercise</p>
        </div>

        <div className="calories-remaining-section">
          <p>=</p>
        </div>

        <div className="calories-remaining-section">
          <p>3,500</p>
          <p className="calories-remaining-section-label">Remaining</p>
        </div>
      </div>
    </header>
  );
}
