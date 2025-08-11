import appApi from "@/config/axios";

import { IQuizDifficulty } from "@/types/quizType";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getQuizzesApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    search: string;
    difficulty: "all" | IQuizDifficulty;
    topics: string[] | "all";
    size: number;
  }
>(
  "userQuizzes/getQuizzes",
  async ({ page, search, difficulty, size, topics }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
        difficulty,
        size: size.toString(),
        topics: topics.toString(),
      });

      const response = await appApi.get(`/quizzes?${params.toString()}`);
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);
