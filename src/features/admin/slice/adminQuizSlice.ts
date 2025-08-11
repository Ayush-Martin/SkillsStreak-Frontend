import { createSlice } from "@reduxjs/toolkit";
import {
  adminQuizListUnListApi,
  getAdminQuizzesApi,
} from "../api/adminQuizApi";
import { errorPopup, successPopup } from "@/utils/popup";

type QuizType = {
  title: string;
  isListed: boolean;
  difficulty: "beginner" | "intermediate" | "advance";
  _id: string;
};

type QuizzesType = Array<QuizType>;

type initialStateType = {
  quizzes: QuizzesType;
  currentPage: number;
  totalPages: number;
  loading: boolean;
};

const initialState: initialStateType = {
  quizzes: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
};

const AdminQuizSlice = createSlice({
  name: "adminQuiz",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminQuizzesApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAdminQuizzesApi.fulfilled, (state, action) => {
      const data: initialStateType = action.payload.data;
      if (data.currentPage == 1) {
        state.quizzes = data.quizzes;
      } else {
        state.quizzes = [...state.quizzes, ...data.quizzes];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
      state.loading = false;
    });

    builder.addCase(getAdminQuizzesApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });

    builder.addCase(adminQuizListUnListApi.fulfilled, (state, action) => {
      const { quizId, isListed }: { quizId: string; isListed: boolean } =
        action.payload.data;

      state.quizzes = state.quizzes.map((oldQuiz) =>
        oldQuiz._id == quizId ? { ...oldQuiz, isListed } : oldQuiz
      );

      successPopup(action.payload.message || "category list status changed");
    });

    builder.addCase(adminQuizListUnListApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });
  },
});

export const { changePage } = AdminQuizSlice.actions;
export default AdminQuizSlice.reducer;
