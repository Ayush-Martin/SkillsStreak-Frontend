import { axiosGetRequest } from "@/config/axios";
import { ISubscriptionFeature } from "@/types/subscriptionType";

export const getSubscriptionFeatures =
  async (): Promise<Array<ISubscriptionFeature> | null> => {
    const res = await axiosGetRequest("/admin/subscriptionFeatures");
    return res?.data;
  };
