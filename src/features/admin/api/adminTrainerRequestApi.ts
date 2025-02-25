import appApi from "@/config/axios";
import { ADMIN_TRAINER_REQUEST_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminTrainerRequestsApi = createAsyncThunk<
  IResponse,
  { page: number }
>("adminUser/getTrainerRequests", async ({ page }, { rejectWithValue }) => {
  try {
    const response = await appApi.get(
      `${ADMIN_TRAINER_REQUEST_API}?&page=${page}`
    );
    return response.data;
  } catch (err) {
    const resErr = err as IApiResponseError;
    console.log(err);
    return rejectWithValue(resErr.response.data.error);
  }
});

export const AdminChangeTrainerRequestStatus = createAsyncThunk<
  IResponse,
  { userId: string; status: "approved" | "rejected" }
>("adminUser/changeStatus", async ({ userId, status }, { rejectWithValue }) => {
  try {
    const response = await appApi.patch(
      `${ADMIN_TRAINER_REQUEST_API}/${userId}?status=${status}`
    );
    return response.data;
  } catch (err) {
    const resErr = err as IApiResponseError;
    console.log(err);
    return rejectWithValue(resErr.response.data.error);
  }
});
