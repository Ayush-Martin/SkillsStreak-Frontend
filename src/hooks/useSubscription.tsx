import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import usePayment from "@/hooks/usePayment";
import { useEffect, useState } from "react";

const useSubscription = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const handlePayment = usePayment();

  const getSubscriptionDetail = async (successHandler: () => Promise<void>) => {
    const res = await axiosGetRequest("/subscription/detail");
    if (!res || !res.data) return;
    setIsSubscribed(true);
    await successHandler();
  };

  const getSubscription = async (
    successHandler: (message: string | undefined) => void
  ) => {
    const res = await axiosGetRequest(`/subscription`);
    if (!res) return;

    handlePayment(res.data.amount, res.data.id, async (orderId: string) => {
      const res = await axiosPostRequest(`/subscription`, {
        orderId,
      });
      if (!res) return;
      successHandler(res.message);
    });
  };

  return { getSubscription, isSubscribed, getSubscriptionDetail };
};

export default useSubscription;
