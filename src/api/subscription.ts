import { axiosGetRequest } from "@/config/axios";
import {
  ISubscriptionPlans,
  ISubscriptionPlanTitles,
} from "@/types/subscriptionType";

export const getSubscriptionPlans = async (): Promise<
  ISubscriptionPlans[] | null
> => {
  const res = await axiosGetRequest("/subscriptionPlans");
  return res?.data;
};

export const getSubscriptionPlanTitles = async (): Promise<
  ISubscriptionPlanTitles[] | null
> => {
  const res = await axiosGetRequest("/admin/subscriptions/plans");
  return res?.data;
};
