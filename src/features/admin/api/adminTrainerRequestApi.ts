import appApi from "@/config/axios";
import { ADMIN_TRAINER_REQUEST_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminTrainerRequestsApi = createAsyncThunk<
  IResponse,
  { page: number; size: number }
>(
  "adminUser/getTrainerRequests",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${ADMIN_TRAINER_REQUEST_API}?&page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const AdminChangeTrainerRequestStatus = createAsyncThunk<
  IResponse,
  {
    trainerRequestId: string;
    status: "approved" | "rejected";
    rejectedReason?: string;
  }
>(
  "adminUser/changeStatus",
  async ({ trainerRequestId, status, rejectedReason }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        status,
        trainerRequestId,
      });

      if (rejectedReason) {
        params.append("rejectedReason", rejectedReason);
      }

      const response = await appApi.patch(
        `${ADMIN_TRAINER_REQUEST_API}/${trainerRequestId}?${params.toString()}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);
