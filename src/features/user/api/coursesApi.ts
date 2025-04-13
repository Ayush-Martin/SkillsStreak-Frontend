import appApi from "@/config/axios";
import { COURSES_API } from "@/constants/API";
import { ICourseDifficulty, IPrice, ISort } from "@/types/courseType";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getCoursesApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    search: string;
    category: string;
    difficulty: "all" | ICourseDifficulty;
    price: "all" | IPrice;
    sort: "none" | ISort;
    size: number;
  }
>(
  "userCourses/getCourses",
  async (
    { page, search, category, difficulty, price, size, sort },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
        category,
        difficulty,
        price,
        size: size.toString(),
        sort,
      });

      const response = await appApi.get(`${COURSES_API}?${params.toString()}`);
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);
