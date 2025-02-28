import { createSlice } from "@reduxjs/toolkit";
import { getTrainerCoursesApi } from "../api/TrainerCoursesApi";

type MyCoursesType = Array<{
  _id: string;
  title: string;
  thumbnail: string;
  categoryId: {
    categoryName: string;
  };
  isListed: boolean;
  price: number;
  difficulty: "beginner" | "intermediate" | "advance";
}>;

type initialStateType = {
  courses: MyCoursesType;
  currentPage: number;
  totalPages: number;
};

const initialState: initialStateType = {
  courses: [],
  currentPage: 1,
  totalPages: 1,
};

const MyCourses = createSlice({
  name: "trainerMyCourses",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTrainerCoursesApi.fulfilled, (state, action) => {
      const data: initialStateType = action.payload.data;
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

export const { changePage } = MyCourses.actions;
export default MyCourses.reducer;
