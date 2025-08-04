import { createSlice } from "@reduxjs/toolkit";
import { getEnrolledCoursesApi } from "../api/enrolledCourseApi";

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
  },
});

export const { changePage } = enrolledCoursesSlice.actions;
export default enrolledCoursesSlice.reducer;
