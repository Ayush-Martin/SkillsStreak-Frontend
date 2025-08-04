import { Button } from "@/components";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Failure Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Failure Message */}
        <h1 className="text-3xl font-bold text-white mb-2">Payment Failed!</h1>
        <p className="text-gray-400 text-lg mb-8">
          Your transaction could not be processed
        </p>

        <Button
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 text-lg font-semibold"
          onClick={() => navigate("/")}
        >
          <Home className="w-5 h-5 mr-2" />
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default PaymentFailure;
