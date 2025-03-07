import { PROFILE_API, BACKEND_BASE_URL } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const appApi = axios.create({
  baseURL: BACKEND_BASE_URL,
  withCredentials: true,
});

export const updateProfileImageApi = createAsyncThunk<IResponse, File>(
  "user/updateProfileImage",
  async (profileImage: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", profileImage);
      const response = await appApi.patch(PROFILE_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      console.log(err);
      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const updateProfileApi = createAsyncThunk<
  IResponse,
  {
    username: string;
    about: string;
    areaOfInterest: Array<string>;
  }
>("user/updateProfile", async (profileData, { rejectWithValue }) => {
  try {
    const { username, about, areaOfInterest } = profileData;
    const response = await appApi.put(PROFILE_API, {
      username,
      about,
    });
    return response.data;
  } catch (err) {
    const resErr = err as IApiResponseError;
    console.log(err);
    return rejectWithValue(resErr.response.data.error);
  }
});
