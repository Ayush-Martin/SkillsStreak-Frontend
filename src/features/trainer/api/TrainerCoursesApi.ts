import appApi from "@/config/axios";
import { TRAINER_COURSES_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTrainerCoursesApi = createAsyncThunk<
  IResponse,
  { page: number; search: string }
>(
  "trainerCourses/getCourses",
  async ({ page, search }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${TRAINER_COURSES_API}?search=${search}&page=${page}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      console.log(err);
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
