import appApi from "@/config/axios";
import { COURSES_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCoursesApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    search: string;
    category: string;
    difficulty: "all" | "beginner" | "intermediate" | "advance";
    price: "all" | "free" | "paid";
  }
>(
  "userCourses/getCourses",
  async (
    { page, search, category, difficulty, price },
    { rejectWithValue }
  ) => {
    try {
      const response = await appApi.get(
        `${COURSES_API}?search=${search}&page=${page}&category=${category}&difficulty=${difficulty}&price=${price}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      console.log(err);
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
