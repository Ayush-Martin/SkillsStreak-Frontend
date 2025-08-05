import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminSubscribedUsersApi = createAsyncThunk<
  IResponse,
  { page: number; search: string; size: number }
>("adminSubscribedUser/getSubscribedUsers", async ({ page, search, size }, { rejectWithValue }) => {
  try {
    const response = await appApi.get(
      `/admin/subscriptions?search=${search}&page=${page}&size=${size}`
    );
    return response.data;
  } catch (err) {
    const resErr = err as IApiResponseError;
    return rejectWithValue(resErr.response.data.error);
  }
});
