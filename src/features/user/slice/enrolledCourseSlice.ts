import { createSlice } from "@reduxjs/toolkit";
import {
  cancelEnrolledCourseApi,
  getEnrolledCoursesApi,
} from "../api/enrolledCourseApi";
import { errorPopup, successPopup } from "@/utils/popup";

interface IEnrolledCourse {
  _id: string;
  course: {
    _id: string;
    title: string;
    thumbnail: string;
  };
  completedPercentage: number;
  createdAt: string;
}

interface IInitialState {
  enrolledCourses: Array<IEnrolledCourse>;
  currentPage: number;
  totalPages: number;
}

const initialState: IInitialState = {
  enrolledCourses: [],
  currentPage: 0,
  totalPages: 0,
};

const enrolledCoursesSlice = createSlice({
  name: "enrolledCourses",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEnrolledCoursesApi.fulfilled, (state, action) => {
      const data: IInitialState = action.payload.data;
      if (data.currentPage == 1) {
        state.enrolledCourses = data.enrolledCourses;
      } else {
        state.enrolledCourses = [
          ...state.enrolledCourses,
          ...data.enrolledCourses,
        ];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
    });

    builder.addCase(cancelEnrolledCourseApi.fulfilled, (state, action) => {
      state.enrolledCourses = state.enrolledCourses.filter(
        (course) => course.course._id !== action.payload.data
      );
      successPopup(action.payload.message || "course cancelled");
    });

    builder.addCase(cancelEnrolledCourseApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });
  },
});

export const { changePage } = enrolledCoursesSlice.actions;
export default enrolledCoursesSlice.reducer;
