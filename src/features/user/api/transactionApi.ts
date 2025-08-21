import appApi from "@/config/axios";
import { TRANSACTIONS_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { ITransactionStatus, ITransactionType } from "@/types/transactionType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserTransactionsApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    size: number;
    search: string;
    type: ITransactionType | "all";
    status: ITransactionStatus | "all";
  }
>(
  "userTransactions/getTransactions",
  async ({ page, size, search, type, status }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${TRANSACTIONS_API}?page=${page}&size=${size}&search=${search}&type=${type}&status=${status}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);
