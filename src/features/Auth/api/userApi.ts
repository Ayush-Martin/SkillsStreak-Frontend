import { UserProfileSchemaType } from "@/components/User/UserProfile";
import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateProfileImageApi = createAsyncThunk<IResponse, File>(
  "user/updateProfileImage",
  async (profileImage: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", profileImage);
      const response = await appApi.put("/user/changeProfileImage", formData, {
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
  UserProfileSchemaType
>(
  "user/updateProfile",
  async (profileData: UserProfileSchemaType, { rejectWithValue }) => {
    try {
      const { username, about, areaOfInterest } = profileData;
      const response = await appApi.put("/user/updateProfile", {
        username,
        about,
      });
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      console.log(err);
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
