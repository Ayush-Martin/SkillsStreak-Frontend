import appApi from "@/config/axios";
import { TRAINER_STUDENTS_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getTrainerStudentsApi = createAsyncThunk<
  IResponse,
  { page: number; search: string }
>(
  "trainerStudents/getStudents",
  async ({ page, search }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${TRAINER_STUDENTS_API}?search=${search}&page=${page}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      console.log(err);
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
