import { FourSquare } from "react-loading-indicators";
import { AuthLayout } from "@/layouts";

const Loading = () => {
  const loaderColor = "#E5E7EB"; // subtle light gray for dark theme

  return (
    <AuthLayout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-[#0a0d17]">
        {/* Loader */}
        <FourSquare size="medium" color={loaderColor} />

        {/* Loading text */}
        <h1
          className="text-xl sm:text-2xl font-semibold animate-pulse"
          style={{ color: loaderColor }}
        >
          Loading
        </h1>
      </div>
    </AuthLayout>
  );
};

export default Loading;
