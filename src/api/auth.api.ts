import {
  axiosGetRequest,
  axiosPatchRequest,
  axiosPostRequest,
} from "@/config/axios";
import { BACKEND_BASE_URL } from "@/constants";
import { successPopup } from "@/utils/popup";
import { IChangePasswordSchema } from "@/validation/auth.validation";
import axios from "axios";

export const getRefresh = async () => {
  const res = await axios.get(`${BACKEND_BASE_URL}/api/auth/refresh`, {
    withCredentials: true,
  });

  return res.data.data;
};

export const forgetPassword = async (email: string) => {
  const res = await axiosPostRequest("/auth/forgetPassword", { email });
  if (!res) return;
  successPopup(res.message || "OTP sent to your email");
};

export const loginWithPassword = async (
  email: string,
  password: string
): Promise<string | undefined> => {
  const res = await axiosPostRequest("/auth/login", { email, password });
  if (!res) return;
  successPopup(res.message || "Login successful");
  return res.data;
};

export const loginWithGoogle = async (
  token: string
): Promise<string | null> => {
  const res = await axiosPostRequest("/auth/google", { token });
  return res?.data;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const res = await axiosPostRequest("/auth/register", {
    username,
    email,
    password,
  });
  if (!res) return;
  successPopup(res.data || "OTP sent");
};

export const resetPassword = async (email: string, password: string) => {
  const res = await axiosPostRequest("/auth/resetPassword", {
    password,
    email,
  });
  if (!res) return;
  successPopup(res.message || "Password is changed");
};

export const verifyOTP = async (email: string, OTP: string) => {
  const res = await axiosPostRequest("/auth/verifyOTP", {
    email,
    OTP,
  });
  if (!res) return;
  successPopup(res.message || "OTP verified");
};

export const completeRegister = async (email: string) => {
  const res = await axiosGetRequest(`/auth/register?email=${email}`);
  if (!res) return;
  successPopup(res.message || "user registered");
};

export const changePassword = async (data: IChangePasswordSchema) => {
  const res = await axiosPatchRequest("/auth/changePassword", {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });
  if (!res) return;
  successPopup(res.message || "Password is changed");
  return res;
};
