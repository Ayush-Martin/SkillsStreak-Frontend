/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import store from "../store";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { login, logout } from "@/features/Auth/slice/userSlice";
import { BACKEND_BASE_URL, REFRESH_TOKEN_API } from "@/constants/API";
import { errorPopup } from "@/utils/popup";

export const appApi = axios.create({
  baseURL: BACKEND_BASE_URL + "/api",
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

    if (
      error.response.status == 401 &&
      error.response.data.error == "Invalid token" &&
      !originalRequest._retry
    ) {
      try {
        const res: IResponse = await axios.get(
          `${BACKEND_BASE_URL}/api${REFRESH_TOKEN_API}`,
          {
            withCredentials: true,
          }
        );
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

    if (
      error.response.status == 403 &&
      error.response.data.error == "Blocked"
    ) {
      errorPopup("you are blocked by admin");
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export const axiosGetRequest = async (
  url: string,
  config?: AxiosRequestConfig
): Promise<IResponse | void> => {
  try {
    const res = await appApi.get(url, config);
    return res.data;
  } catch (err) {
    const apiError = err as IApiResponseError;
    errorPopup(apiError.response.data.error || "Some error Occurred");
  }
};

export const axiosPostRequest = async (
  url: string,
  data: any,
  config?: AxiosRequestConfig<any>
): Promise<IResponse | void> => {
  try {
    const res = await appApi.post(url, data, config);
    return res.data;
  } catch (err) {
    const apiError = err as IApiResponseError;
    errorPopup(apiError.response.data.error || "Some error Occurred");
  }
};

export const axiosPutRequest = async (
  url: string,
  data: any,
  config?: AxiosRequestConfig<any>
): Promise<IResponse | void> => {
  try {
    const res = await appApi.put(url, data, config);
    return res.data;
  } catch (err) {
    const apiError = err as IApiResponseError;
    errorPopup(apiError.response.data.error || "Some error Occurred");
  }
};

export const axiosPatchRequest = async (
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any>
): Promise<IResponse | void> => {
  try {
    const res = await appApi.patch(url, data, config);
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
