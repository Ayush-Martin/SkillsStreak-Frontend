import appApi from "@/config/axios";
import { TRANSACTIONS_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserTransactionsApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    size: number;
  }
>(
  "userTransactions/getTransactions",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${TRANSACTIONS_API}?page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);
