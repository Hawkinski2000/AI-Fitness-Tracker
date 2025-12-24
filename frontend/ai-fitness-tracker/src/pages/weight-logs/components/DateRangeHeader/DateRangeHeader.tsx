import './DateRangeHeader.css';


type DateRangeHeaderProps = {
  dateRange: string;
  setDateRange: React.Dispatch<React.SetStateAction<string>>;
};


export default function DateRangeHeader({
  dateRange,
  setDateRange
}: DateRangeHeaderProps) {
  return (
    <header className="date-range-header">
      <div className="date-range-header-button-container">
        <button
          className={
            `date-range-header-button
            ${dateRange === "Week" && "date-range-header-button-selected"}`
          }
          onClick={() => setDateRange("Week")}
        >
          Week
        </button>

        <button
          className={
            `date-range-header-button
            ${dateRange === "Month" && "date-range-header-button-selected"}`
          }
          onClick={() => setDateRange("Month")}
        >
          Month
        </button>

        <button
          className={
            `date-range-header-button
            ${dateRange === "3 Months" && "date-range-header-button-selected"}`
          }
          onClick={() => setDateRange("3 Months")}
        >
          3 Months
        </button>

        <button
          className={
            `date-range-header-button
            ${dateRange === "Year" && "date-range-header-button-selected"}`
          }
          onClick={() => setDateRange("Year")}
        >
          Year
        </button>

        <button
          className={
            `date-range-header-button
            ${dateRange === "All time" && "date-range-header-button-selected"}`
          }
          onClick={() => setDateRange("All time")}
        >
          All time
        </button>
      </div>
    </header>
  );
}
