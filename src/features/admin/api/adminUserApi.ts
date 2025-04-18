import appApi from "@/config/axios";
import { ADMIN_USERS_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminUsersApi = createAsyncThunk<
  IResponse,
  { page: number; search: string; size: number }
>("adminUser/getUsers", async ({ page, search, size }, { rejectWithValue }) => {
  try {
    const response = await appApi.get(
      `${ADMIN_USERS_API}?search=${search}&page=${page}&size=${size}`
    );
    return response.data;
  } catch (err) {
    const resErr = err as IApiResponseError;
    return rejectWithValue(resErr.response.data.error);
  }
});

export const adminBlockUnblockUserApi = createAsyncThunk<IResponse, string>(
  "adminUser/blockUnblockUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await appApi.patch(`${ADMIN_USERS_API}/${userId}`);
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
