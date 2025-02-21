import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminUsersApi = createAsyncThunk<
  IResponse,
  { page: number; search: string }
>("adminUser/getUsers", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await appApi.get(
      `/admin/users?search=${search}&page=${page}`
    );
    return response.data;
  } catch (err) {
    const resErr = err as IApiResponseError;
    console.log(err);
    return rejectWithValue(resErr.response.data.error);
  }
});

export const adminBlockUnblockUserApi = createAsyncThunk<IResponse, string>(
  "adminUser/blockUnblockUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await appApi.patch(`/admin/users/${userId}`);
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      console.log(err);
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
