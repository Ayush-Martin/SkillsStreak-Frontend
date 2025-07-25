import { BACKEND_BASE_URL } from "@/constants";
import axios from "axios";

export const getRefresh = async () => {
  const res = await axios.get(`${BACKEND_BASE_URL}/api/auth/refresh`, {
    withCredentials: true,
  });

  return res.data.data;
};
