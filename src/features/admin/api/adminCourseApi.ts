import appApi from "@/config/axios";
import { ADMIN_COURSES_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminCoursesApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    search: string;
  }
>("adminCourses/getCourses", async ({ page, search }, { rejectWithValue }) => {
  try {
    const response = await appApi.get(
      `${ADMIN_COURSES_API}?search=${search}&page=${page}`
    );
    return response.data;
  } catch (err) {
    const resErr = err as IApiResponseError;
    console.log(err);
    return rejectWithValue(resErr.response.data.error);
  }
});

export const adminCourseListUnListApi = createAsyncThunk<IResponse, string>(
  "adminCourses/listUnListCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await appApi.patch(`${ADMIN_COURSES_API}/${categoryId}`);
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      console.log(err);
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
