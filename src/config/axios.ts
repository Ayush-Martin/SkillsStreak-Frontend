/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import store from "../store";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { login, logout } from "@/features/Auth/userSlice";
import { BACKEND_BASE_URL, REFRESH_TOKEN_API } from "@/constants/API";
import { errorPopup } from "@/utils/popup";

export const appApi = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
});

appApi.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().user;

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

appApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status == 401 && !originalRequest._retry) {
      try {
        const res: IResponse = await axios.get(
          `${BACKEND_BASE_URL}${REFRESH_TOKEN_API}`
        );
        console.log("r1", res);
        const newAccessToken = res.data.data as string;

        store.dispatch(login(newAccessToken));

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return appApi(originalRequest);
      } catch (err) {
        store.dispatch(logout());
        console.log(err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export const axiosGetRequest = async (
  url: string
): Promise<IResponse | void> => {
  try {
    const res = await appApi.get(url);
    return res.data;
  } catch (err) {
    const apiError = err as IApiResponseError;
    errorPopup(apiError.response.data.error || "Some error Occurred");
  }
};

export const axiosPostRequest = async (
  url: string,
  data: any
): Promise<IResponse | void> => {
  try {
    const res = await appApi.post(url, data);
    return res.data;
  } catch (err) {
    const apiError = err as IApiResponseError;
    errorPopup(apiError.response.data.error || "Some error Occurred");
  }
};

export const axiosPutRequest = async (
  url: string,
  data: any
): Promise<IResponse | null> => {
  try {
    const res = await appApi.put(url, data);
    return res.data;
  } catch (err) {
    const apiError = err as IApiResponseError;
    errorPopup(apiError.response.data.error || "Some error Occurred");
    return null;
  }
};

export const axiosPatchRequest = async (
  url: string,
  data: any
): Promise<IResponse | void> => {
  try {
    const res = await appApi.patch(url, data);
    return res.data;
  } catch (err) {
    const apiError = err as IApiResponseError;
    errorPopup(apiError.response.data.error || "Some error Occurred");
  }
};

export const axiosDeleteRequest = async (
  url: string
): Promise<IResponse | void> => {
  try {
    const res = await appApi.delete(url);
    return res.data;
  } catch (err) {
    const apiError = err as IApiResponseError;
    errorPopup(apiError.response.data.error || "Some error Occurred");
  }
};

export default appApi;
