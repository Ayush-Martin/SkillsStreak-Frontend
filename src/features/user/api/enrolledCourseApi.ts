import appApi from "@/config/axios";
import { ENROLLED_COURSES } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getEnrolledCoursesApi = createAsyncThunk<
  IResponse,
  {
    page: number;
  }
>(
  "userEnrolledCourses/getEnrolledCourses",
  async ({ page }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(`${ENROLLED_COURSES}?page=${page}`);
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      console.log(err);
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
