import  { FC } from "react";

type FilterType = "all" | "daily" | "weekly" | "monthly" | "custom" | "yearly";
type ExportType = "pdf" | "excel";

interface IDateFilterWithExportProps {
  filterType: FilterType;
  startDate: string;
  endDate: string;
  changeFilterType: (type: FilterType) => void;
  changeStartDate: (date: string) => void;
  changeEndDate: (date: string) => void;
  handleExport: (type: ExportType) => void;
}

const DateFilterWithExport: FC<IDateFilterWithExportProps> = ({
  filterType,
  startDate,
  endDate,
  changeFilterType,
  changeStartDate,
  changeEndDate,
  handleExport,
}) => {
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  const isEndDateValid =
    startDate && endDate && new Date(endDate) >= new Date(startDate);

  return (
    <div className="bg-[#0e111c] text-white p-5 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4 w-full border border-gray-700">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {["all", "daily", "monthly", "yearly", "custom"].map((item) => (
          <button
            key={item}
            onClick={() => changeFilterType(item as FilterType)}
            className={`px-4 py-2 rounded text-sm border ${
              filterType === item
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-[#1a1d2c] hover:bg-[#23263a] border-gray-600 text-gray-300"
            }`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {/* Custom Date Inputs */}
      {filterType === "custom" && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => changeStartDate(e.target.value)}
              max={today}
              className="bg-[#1a1d2c] text-white border border-gray-600 rounded px-3 py-2 text-sm"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => changeEndDate(e.target.value)}
              min={startDate || undefined}
              max={today}
              disabled={!startDate}
              className={`bg-[#1a1d2c] text-white border rounded px-3 py-2 text-sm ${
                !startDate ? "opacity-50 cursor-not-allowed" : "border-gray-600"
              }`}
            />
          </div>

          {/* Optional: Error Message */}
          {startDate && endDate && !isEndDateValid && (
            <span className="text-sm text-red-500 mt-1">
              End date must be greater than or equal to start date.
            </span>
          )}
        </div>
      )}

      {/* Export Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleExport("pdf")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
        >
          Export PDF
        </button>
        <button
          onClick={() => handleExport("excel")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
        >
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default DateFilterWithExport;
