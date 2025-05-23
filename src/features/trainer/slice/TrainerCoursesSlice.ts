import { createSlice } from "@reduxjs/toolkit";
import {
  getTrainerCoursesApi,
  trainerCourseListUnListApi,
} from "../api/TrainerCoursesApi";
import { errorPopup, successPopup } from "@/utils/popup";

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
  status: "pending" | "approved" | "rejected";
}>;

type initialStateType = {
  courses: MyCoursesType;
  currentPage: number;
  totalPages: number;
  loading: boolean;
};

const initialState: initialStateType = {
  courses: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
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
    builder.addCase(getTrainerCoursesApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getTrainerCoursesApi.fulfilled, (state, action) => {
      const data: initialStateType = action.payload.data;
      if (data.currentPage == 1) {
        state.courses = data.courses;
      } else {
        state.courses = [...state.courses, ...data.courses];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
      state.loading = false;
    });

    builder.addCase(trainerCourseListUnListApi.fulfilled, (state, action) => {
      const { courseId, isListed }: { courseId: string; isListed: boolean } =
        action.payload.data;

      state.courses = state.courses.map((oldCourse) =>
        oldCourse._id == courseId ? { ...oldCourse, isListed } : oldCourse
      );

      successPopup(action.payload.message || "course list status changed");
    });

    builder.addCase(trainerCourseListUnListApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });
  },
});

export const { changePage } = MyCourses.actions;
export default MyCourses.reducer;
