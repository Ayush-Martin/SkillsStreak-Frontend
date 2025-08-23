import { FC } from "react";

interface DivLoadingProps {
  message?: string;
}

const DivLoading: FC<DivLoadingProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-t-blue-500 border-b-gray-700 rounded-full animate-spin"></div>

      {/* Animated loading text */}
      <span className="text-gray-400 text-lg animate-pulse">{message}</span>
    </div>
  );
};

export default DivLoading;
