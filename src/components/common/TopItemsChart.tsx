import { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface TopItem {
  label: string;
  value: number;
}

interface TopItemsChartProps {
  title?: string;
  data: TopItem[];
  barColors?: string[];
  height?: number;
}

const TopItemsChart: FC<TopItemsChartProps> = ({
  title = "Top Items",
  data,
  barColors = ["#4f46e5", "#8b5cf6", "#22d3ee", "#10b981", "#f59e0b"],
  height = 300,
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-[#0e101a] to-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl text-white transition duration-300 hover:shadow-purple-500/20">
      <h2 className="text-lg md:text-xl font-semibold mb-4">{title}</h2>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
        >
          <XAxis type="number" tick={{ fill: "#cbd5e1" }} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: "#e5e7eb" }}
            width={140}
          />
          <Tooltip
            cursor={{ fill: "#1f2937" }}
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#f9fafb" }}
            itemStyle={{ color: "#a5b4fc" }}
          />
          <Bar dataKey="value" barSize={20} radius={[0, 12, 12, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={barColors[index % barColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopItemsChart;
