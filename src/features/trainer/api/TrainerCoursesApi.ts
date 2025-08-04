import appApi from "@/config/axios";
import { TRAINER_COURSES_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTrainerCoursesApi = createAsyncThunk<
  IResponse,
  { page: number; search: string; size: number }
>(
  "trainerCourses/getCourses",
  async ({ page, search, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${TRAINER_COURSES_API}?search=${search}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const trainerCourseListUnListApi = createAsyncThunk<IResponse, string>(
  "trainerCourses/listUnListCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await appApi.patch(`${TRAINER_COURSES_API}/${courseId}`);
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
