import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserLiveStreams = createAsyncThunk<
  IResponse,
  {
    page: number;
    search: string;
  }
>(
  "userLiveStreams/getLiveStreams",
  async ({ search, page }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${"/streams"}?page=${page}&search=${search}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      console.log(err);
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
