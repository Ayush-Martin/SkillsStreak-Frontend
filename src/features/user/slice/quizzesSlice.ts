import { createSlice } from "@reduxjs/toolkit";
import { getQuizzesApi } from "../api/quizzesApi";
import { IUserQuiz } from "@/types/quizType";

interface IInitialState {
  quizzes: IUserQuiz[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const initialState: IInitialState = {
  quizzes: [],
  currentPage: 0,
  totalPages: 0,
  loading: false,
};

const quizzesSlice = createSlice({
  name: "userQuizzes",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getQuizzesApi.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getQuizzesApi.fulfilled, (state, action) => {
      state.loading = false;
      const data: IInitialState = action.payload.data;
      if (data.currentPage == 1) {
        state.quizzes = data.quizzes;
      } else {
        state.quizzes = [...state.quizzes, ...data.quizzes];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
    });
  },
});

export const { changePage } = quizzesSlice.actions;
export default quizzesSlice.reducer;
