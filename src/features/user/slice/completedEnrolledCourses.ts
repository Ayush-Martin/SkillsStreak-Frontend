import { createSlice } from "@reduxjs/toolkit";
import { getCompletedEnrolledCoursesApi } from "../api/completedEnrolledCoursesApi";

interface ICourse {
  _id: string;
  _trainerId: string;
  title: string;
  thumbnail: string;
}

interface IEnrolledCourse {
  _id: string;
  userId: string;
  course: ICourse;
}

interface IInitialState {
  completedEnrolledCourses: Array<IEnrolledCourse>;
  currentPage: number;
  totalPages: number;
}

const initialState: IInitialState = {
  completedEnrolledCourses: [],
  currentPage: 0,
  totalPages: 0,
};

const completedEnrolledCoursesSlice = createSlice({
  name: "completedEnrolledCourses",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getCompletedEnrolledCoursesApi.fulfilled,
      (state, action) => {
        const data: IInitialState = action.payload.data;
        if (data.currentPage == 1) {
          state.completedEnrolledCourses = data.completedEnrolledCourses;
        } else {
          state.completedEnrolledCourses = [
            ...state.completedEnrolledCourses,
            ...data.completedEnrolledCourses,
          ];
        }
        state.currentPage = data.currentPage;
        state.totalPages = data.totalPages;
      }
    );
  },
});

export const { changePage } = completedEnrolledCoursesSlice.actions;
export default completedEnrolledCoursesSlice.reducer;
