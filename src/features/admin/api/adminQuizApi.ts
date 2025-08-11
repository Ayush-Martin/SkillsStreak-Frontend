import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminQuizzesApi = createAsyncThunk<
  IResponse,
  { page: number; search: string; size: number }
>(
  "adminQuiz/getQuizzes",
  async ({ page, search, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `/admin/quizzes?search=${search}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const adminQuizListUnListApi = createAsyncThunk<IResponse, string>(
  "adminQuiz/listUnListQuiz",
  async (quizId, { rejectWithValue }) => {
    try {
      const response = await appApi.patch(`/admin/quizzes/${quizId}`);
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
