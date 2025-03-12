import { axiosGetRequest, axiosPostRequest } from "@/config/axios";
import usePayment from "@/hooks/usePayment";

const useSubscription = () => {
  const handlePayment = usePayment();

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

  return getSubscription;
};

export default useSubscription;
