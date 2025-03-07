import { createSlice } from "@reduxjs/toolkit";
import { getCoursesApi } from "../api/coursesApi";

interface ICourse {
  _id: string;
  _trainerId: string;
  title: string;
  thumbnail: string;
  category: {
    _id: string;
    categoryName: string;
  };
  isListed: boolean;
  price: number;
  difficulty: "beginner" | "intermediate" | "advance";
  moduleCount: number;
}

interface IInitialState {
  courses: Array<ICourse>;
  currentPage: number;
  totalPages: number;
}

const initialState: IInitialState = {
  courses: [],
  currentPage: 0,
  totalPages: 0,
};

const coursesSlice = createSlice({
  name: "userCourses",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCoursesApi.fulfilled, (state, action) => {
      const data: IInitialState = action.payload.data;
      if (data.currentPage == 1) {
        state.courses = data.courses;
      } else {
        state.courses = [...state.courses, ...data.courses];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
    });
  },
});

export const { changePage } = coursesSlice.actions;
export default coursesSlice.reducer;
