import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import usePayment from "@/hooks/usePayment";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

// const useSubscription = () => {
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const handlePayment = usePayment();

//   const getSubscriptionDetail = async (successHandler: () => Promise<void>) => {
//     const res = await axiosGetRequest("/subscription");
//     if (!res || !res.data) return;
//     setIsSubscribed(true);
//     await successHandler();
//   };

//   const getSubscription = async (
//     successHandler: (message: string | undefined) => void
//   ) => {
//     const res = await axiosGetRequest(`/subscription`);
//     if (!res) return;

//     handlePayment(res.data.amount, res.data.id, async (orderId: string) => {
//       const res = await axiosPostRequest(`/subscription`, {
//         orderId,
//       });
//       if (!res) return;
//       successHandler(res.message);
//     });
//   };

//   return { getSubscription, isSubscribed, getSubscriptionDetail };
// };

const STRIPE_PUBLISHABLE_kEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!;

const useSubscription = () => {
  const [subscriptionDetail, setSubscriptionDetail] = useState<{
    active: boolean;
    startDate: string;
    endDate: string;
  } | null>();

  useEffect(() => {
    const getSubscriptionDetail = async () => {
      const res = await axiosGetRequest("/subscription");
      if (!res || !res.data) return;
      setSubscriptionDetail(res.data);
    };

    getSubscriptionDetail();
  }, []);

  const getSubscribed = async () => {
    const res = await axiosPostRequest("/subscription", {});
    if (!res) return;
    const stripePromise = loadStripe(STRIPE_PUBLISHABLE_kEY);
    const stripe = await stripePromise;
    if (!stripe) return;
    await stripe.redirectToCheckout({ sessionId: res.data });
  };

  return { subscriptionDetail, getSubscribed };
};

export default useSubscription;
