import appApi from "@/config/axios";
import { ADMIN_COURSES_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminCoursesApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    search: string;
    size: number;
  }
>(
  "adminCourses/getCourses",
  async ({ page, search, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${ADMIN_COURSES_API}?search=${search}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const adminCourseListUnListApi = createAsyncThunk<IResponse, string>(
  "adminCourses/listUnListCategory",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await appApi.patch(`${ADMIN_COURSES_API}/${courseId}`);
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const adminCourseApproveRejectApi = createAsyncThunk<
  IResponse,
  { courseId: string; status: "approved" | "rejected" }
>(
  "adminCourses/approveRejectCategory",
  async ({ courseId, status }, { rejectWithValue }) => {
    try {
      const response = await appApi.patch(
        `${ADMIN_COURSES_API}/${courseId}/status?status=${status}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);
