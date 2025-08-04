import { FC, ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  color?: string; // for value text
  background?: string; // optional tailwind bg class
  hoverShadowColor?: string; // eg: hover:shadow-green-400/30
}

const StatCard: FC<StatCardProps> = ({
  icon,
  title,
  value,
  color = "text-white",
  background = "bg-white/5",
  hoverShadowColor = "hover:shadow-green-400/30",
}) => {
  return (
    <div
      className={`h-[250px] ${background} border border-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 text-white flex flex-col justify-center items-center transition duration-300 hover:scale-[1.03] ${hoverShadowColor}`}
    >
      {/* Icon */}
      <div className="p-4 rounded-full mb-4 bg-white/10">
        <div className="text-3xl">{icon}</div>
      </div>

      {/* Title */}
      <p className="text-sm text-white/60">{title}</p>

      {/* Value */}
      <h1 className={`text-4xl font-bold mt-2 ${color}`}>{value}</h1>
    </div>
  );
};

export default StatCard;
