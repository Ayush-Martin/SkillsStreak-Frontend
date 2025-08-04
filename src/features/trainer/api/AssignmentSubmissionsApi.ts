import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTrainerAssignmentSubmissionsApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    size: number;
  }
>(
  "trainerAssignmentSubmissions/getAssignmentSubmissions",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${"/trainer/assignments"}?page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const TrainerChangeAssignmentSubmissionStatus = createAsyncThunk<
  IResponse,
  {
    assignmentSubmissionId: string;
    status: "verified" | "redo";
  }
>(
  "adminUser/changeStatus",
  async ({ assignmentSubmissionId, status }, { rejectWithValue }) => {
    try {
      const response = await appApi.patch(
        `/trainer/assignments/${assignmentSubmissionId}?status=${status}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);
