import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserLiveStreams = createAsyncThunk<
  IResponse,
  {
    page: number;
    search: string;
    size: number;
  }
>(
  "userLiveStreams/getLiveStreams",
  async ({ search, page, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${"/streams"}?page=${page}&search=${search}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);
