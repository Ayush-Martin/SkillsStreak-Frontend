import { FC, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DataPoint {
  label: string; // e.g., "2024-01-01" or "Jan" or "2024"
  value: number;
}

interface AnalyticsAreaChartProps {
  title?: string;
  data: {
    daily: DataPoint[];
    monthly: DataPoint[];
    yearly: DataPoint[];
  };
  color?: string;
  height?: number;
  showGrid?: boolean;
}

const AnalyticsAreaChart: FC<AnalyticsAreaChartProps> = ({
  title = "Analytics",
  data,
  color = "#6366f1",
  height = 300,
  showGrid = true,
}) => {
  const [view, setView] = useState<"daily" | "monthly" | "yearly">("daily");

  const chartData = data[view];

  return (
    <div className="w-full bg-gradient-to-br from-[#0e101a] to-[#111827] border border-white/10 rounded-2xl p-6 shadow-lg text-white hover:shadow-indigo-500/30 transition duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          {["daily", "monthly", "yearly"].map((type) => (
            <button
              key={type}
              onClick={() => setView(type as "daily" | "monthly" | "yearly")}
              className={`px-3 py-1 text-sm rounded border transition ${
                view === type
                  ? "bg-indigo-600 border-indigo-400 text-white"
                  : "bg-[#1f2937] border-gray-700 text-gray-300 hover:bg-[#2c3248]"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
        >
          {showGrid && <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />}
          <XAxis dataKey="label" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.2}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsAreaChart;
