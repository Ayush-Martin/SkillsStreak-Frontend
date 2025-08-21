import appApi from "@/config/axios";
import { ADMIN_TRANSITION_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { ITransactionStatus, ITransactionType } from "@/types/transactionType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminTransactionsApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    size: number;
    search: string;
    type: ITransactionType | "all";
    status: ITransactionStatus | "all";
  }
>(
  "adminTransactions/getTransactions",
  async ({ page, size, search, type, status }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${ADMIN_TRANSITION_API}?page=${page}&size=${size}&search=${search}&type=${type}&status=${status}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
