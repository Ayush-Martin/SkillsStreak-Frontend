import { FC } from "react";
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
  label: string; // e.g., date or category
  value: number;
}

interface AnalyticsAreaChartProps {
  title?: string;
  data: DataPoint[];
  color?: string;
  height?: number;
  showGrid?: boolean;
}

const AnalyticsAreaChart: FC<AnalyticsAreaChartProps> = ({
  title = "Analytics",
  data,
  color = "#6366f1", // default: indigo-500
  height = 300,
  showGrid = true,
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-[#0e101a] to-[#111827] border border-white/10 rounded-2xl p-6 shadow-lg text-white hover:shadow-indigo-500/30 transition duration-300">
      <h2 className="text-lg md:text-xl font-semibold mb-4">{title}</h2>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
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
