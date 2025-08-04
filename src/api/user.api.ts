import { axiosGetRequest } from "@/config/axios";
import { IUserProfileDetails } from "@/types/userType";

export const getAdminUserProfile = async (
  userId: string
): Promise<IUserProfileDetails | null> => {
  const res = await axiosGetRequest(`/admin/users/${userId}`);
  return res?.data;
};

export const getAdminUsersCount = async (): Promise<number | null> => {
  const res = await axiosGetRequest("/admin/users/count");
  return res?.data;
};

export const getTrainerStudentsCount = async (): Promise<number | null> => {
  const res = await axiosGetRequest("/trainer/students/count");
  return res?.data;
};

export const checkProfileCompleted = async (): Promise<boolean> => {
  const res = await axiosGetRequest("/profile/check");
  return res?.data || false;
};

export const getTrainerRequest = async (): Promise<any> => {
  const res = await axiosGetRequest("/trainerRequest");
  return res?.data;
};
