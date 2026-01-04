import './DateRangeHeader.css';


type DateRangeHeaderProps = {
  dateRange: string;
  setDateRange: React.Dispatch<React.SetStateAction<string>>;
  setDateRangeOffset: React.Dispatch<React.SetStateAction<number>>;
};


export default function DateRangeHeader({
  dateRange,
  setDateRange,
  setDateRangeOffset
}: DateRangeHeaderProps) {
  return (
    <header className="date-range-header">
      <div className="date-range-header-button-container">
        <button
          className={
            `date-range-header-button
            ${dateRange === "Week" && "date-range-header-button-selected"}`
          }
          onClick={() => {
            setDateRange("Week");
            setDateRangeOffset(0);
          }}
        >
          Week
        </button>

        <button
          className={
            `date-range-header-button
            ${dateRange === "Month" && "date-range-header-button-selected"}`
          }
          onClick={() => {
            setDateRange("Month");
            setDateRangeOffset(0);
          }}
        >
          Month
        </button>

        <button
          className={
            `date-range-header-button
            ${dateRange === "3 Months" && "date-range-header-button-selected"}`
          }
          onClick={() => {
            setDateRange("3 Months");
            setDateRangeOffset(0);
          }}
        >
          3 Months
        </button>

        <button
          className={
            `date-range-header-button
            ${dateRange === "Year" && "date-range-header-button-selected"}`
          }
          onClick={() => {
            setDateRange("Year");
            setDateRangeOffset(0);
          }}
        >
          Year
        </button>

        <button
          className={
            `date-range-header-button
            ${dateRange === "All time" && "date-range-header-button-selected"}`
          }
          onClick={() => {
            setDateRange("All time");
            setDateRangeOffset(0);
          }}
        >
          All time
        </button>
      </div>
    </header>
  );
}
