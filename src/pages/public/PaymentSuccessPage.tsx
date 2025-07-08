import React from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto text-center">
        {/* Success Icon - Simple static version */}
        <div className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Your transaction has been processed successfully
        </p>

        {/* Home Button */}
        <Button
          className="w-full bg-green-500 hover:bg-success-green/90 text-white py-3 text-lg font-semibold"
          onClick={() => navigate("/")}
        >
          <Home className="w-5 h-5 mr-2" />
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
