import { axiosGetRequest } from "@/config/axios";
import { IUserProfileDetails } from "@/types/userType";

export const getTrainer = async (
  trainerId: string
): Promise<IUserProfileDetails | null> => {
  const res = await axiosGetRequest(`/trainers/${trainerId}`);
  return res?.data;
};
