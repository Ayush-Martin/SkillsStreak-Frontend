import appApi from "@/config/axios";
import { ADMIN_TRANSITION_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminTransactionsApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    size: number;
  }
>(
  "adminTransactions/getTransactions",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${ADMIN_TRANSITION_API}?page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
