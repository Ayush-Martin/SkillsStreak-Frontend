import { createSlice } from "@reduxjs/toolkit";
import { getTrainerStudentsApi } from "../api/StudentsApi";

type StudentsType = Array<{
  _id: string;
  enrolledCourses: {
    _id: string;
    title: string;
    thumbnail: string;
  }[];
  username: string;
  email: string;
}>;

type initialStateType = {
  students: StudentsType;
  currentPage: number;
  totalPages: number;
};

const initialState: initialStateType = {
  students: [],
  currentPage: 1,
  totalPages: 1,
};

const StudentsSlice = createSlice({
  name: "trainerStudents",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTrainerStudentsApi.fulfilled, (state, action) => {
      const data: initialStateType = action.payload.data;
      if (data.currentPage == 1) {
        state.students = data.students;
      } else {
        state.students = [...state.students, ...data.students];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
    });
  },
});

export const { changePage } = StudentsSlice.actions;
export default StudentsSlice.reducer;
