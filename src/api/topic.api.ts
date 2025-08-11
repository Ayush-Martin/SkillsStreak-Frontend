import { axiosGetRequest } from "@/config/axios";
import { ITopic } from "@/types/topicType";

export const getTopics = async (): Promise<Array<ITopic> | null> => {
  const res = await axiosGetRequest("/topics");
  return res?.data;
};
