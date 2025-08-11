import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserWalletHistoryApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    size: number;
  }
>(
  "userWalletHistory/getWalletHistory",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `/wallet/history?page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);
