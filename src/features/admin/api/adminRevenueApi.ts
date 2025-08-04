import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { IFilterType } from "@/types/revenueType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminRevenueApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    size: number;
    filterType: IFilterType;
    startDate: string;
    endDate: string;
  }
>(
  "adminRevenue/getRevenue",
  async (
    { page, size, filterType, startDate, endDate },
    { rejectWithValue }
  ) => {
    try {
      const response = await appApi.get(
        `${"/admin/revenue"}?&page=${page}&size=${size}&filterType=${filterType}&startDate=${startDate}&endDate=${endDate}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
