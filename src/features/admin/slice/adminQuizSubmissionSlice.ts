import { createSlice } from "@reduxjs/toolkit";
import { getAdminQuizSubmissionsApi } from "../api/adminQuizSubmissionApi";
import { IQuizSubmission } from "@/types/quizType";
import { errorPopup } from "@/utils/popup";

type QuizSubmissionsType = Array<IQuizSubmission>;

type initialStateType = {
  quizSubmissions: QuizSubmissionsType;
  currentPage: number;
  totalPages: number;
  loading: boolean;
};

const initialState: initialStateType = {
  quizSubmissions: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
};

const AdminQuizSubmissionSlice = createSlice({
  name: "adminQuizSubmission",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminQuizSubmissionsApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAdminQuizSubmissionsApi.fulfilled, (state, action) => {
      const data: initialStateType = action.payload.data;
      if (data.currentPage == 1) {
        state.quizSubmissions = data.quizSubmissions;
      } else {
        state.quizSubmissions = [
          ...state.quizSubmissions,
          ...data.quizSubmissions,
        ];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
      state.loading = false;
    });

    builder.addCase(getAdminQuizSubmissionsApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });
  },
});

export const { changePage } = AdminQuizSubmissionSlice.actions;

export default AdminQuizSubmissionSlice.reducer;
