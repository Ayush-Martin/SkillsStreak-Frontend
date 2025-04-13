import appApi from "@/config/axios";
import { ENROLLED_COURSES } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCompletedEnrolledCoursesApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    size: number;
  }
>(
  "userCompletedEnrolledCourses/getCompletedEnrolledCourses",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${ENROLLED_COURSES}/completed?page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);
