/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";

import { RootReducer } from "@/store";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID!;


const usePayment = () => {
  const { username, email } = useSelector((state: RootReducer) => state.user);

  const handlePayment = (
    amount: number,
    orderId: string,
    handler: (orderId: string) => void
  ) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
      name: "Skills Streak",
      description: "Test Payment",
      order_id: orderId,
      handler: (res: { razorpay_order_id: string }) =>
        handler(res.razorpay_order_id),
      prefill: {
        name: username,
        email: email,
      },

      theme: {
        color: "#0A0D17",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return handlePayment;
};

export default usePayment;
