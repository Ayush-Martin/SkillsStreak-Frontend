import { FC, ReactNode } from "react";

interface ITrainerControlButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  variant?: "default" | "danger" | "success";
}

const styles = {
  default:
    "bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-slate-100",
  danger:
    "bg-red-900/50 border border-red-700 text-red-400 hover:bg-red-800/60 hover:text-red-300",
  success:
    "bg-green-900/50 border border-green-700 text-green-400 hover:bg-green-800/60 hover:text-green-300",
};

const TrainerControlButton: FC<ITrainerControlButtonProps> = ({
  onClick,
  icon,
  label,
  variant = "default",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center px-4 py-3 rounded-xl font-medium transition-colors text-sm ${styles[variant]}`}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </button>
  );
};

export default TrainerControlButton;
