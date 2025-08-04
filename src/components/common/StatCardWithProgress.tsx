import { FC, ReactNode } from "react";

interface StatCardWithProgressProps {
  icon: ReactNode;
  title: string;
  items: { label: string; value: string; className?: string }[];
  progressPercent: number;
  showProgress?: boolean;
  fallback?: ReactNode;
  progressColor?: string;
  shadowColor?: string;
}

const StatCardWithProgress: FC<StatCardWithProgressProps> = ({
  icon,
  title,
  items,
  progressPercent,
  showProgress = true,
  fallback,
  progressColor = "from-purple-500 via-pink-500 to-red-500",
  shadowColor = "hover:shadow-purple-500/30",
}) => {
  return (
    <div
      className={`bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 text-white transition duration-300 hover:scale-[1.03] ${shadowColor} space-y-6`}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="text-2xl text-purple-400">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      {/* Key info */}
      <div className="space-y-2 text-sm text-white/80">
        {items.map((item, idx) => (
          <div className="flex justify-between" key={idx}>
            <span>{item.label}</span>
            <span className={`text-white font-medium ${item.className || ""}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar or fallback */}
      {showProgress ? (
        <div className="relative mt-2 h-7 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${progressColor} rounded-full shadow-md transition-all duration-500`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
          <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white/80 shadow-md bg-black/70 p-1 rounded-lg mt-[2px]">
            {Math.round(progressPercent)}%
          </span>
        </div>
      ) : (
        fallback
      )}
    </div>
  );
};

export default StatCardWithProgress;
