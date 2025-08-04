import { axiosGetRequest } from "@/config/axios";
import { ISubscriptionPlans } from "@/types/subscriptionType";

export const getSubscriptionPlans = async (): Promise<
  ISubscriptionPlans[] | null
> => {
  const res = await axiosGetRequest("/subscriptionPlans");
  return res?.data;
};
