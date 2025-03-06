import { createSlice } from "@reduxjs/toolkit";
import {
  adminCourseListUnListApi,
  getAdminCoursesApi,
} from "../api/adminCourseApi";
import { errorPopup, successPopup } from "@/utils/popup";

interface ICourse {
  _id: string;
  trainerId: {
    _id: string;
    email: string;
  };
  title: string;
  thumbnail: string;
  categoryId: {
    _id: string;
    categoryName: string;
  };
  isListed: boolean;
  price: number;
  difficulty: "beginner" | "intermediate" | "advance";
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

const adminCourseSlice = createSlice({
  name: "adminCourses",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminCoursesApi.fulfilled, (state, action) => {
      const data: IInitialState = action.payload.data;
      if (data.currentPage == 1) {
        state.courses = data.courses;
      } else {
        state.courses = [...state.courses, ...data.courses];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
    });

    builder.addCase(adminCourseListUnListApi.fulfilled, (state, action) => {
      const { courseId, isListed }: { courseId: string; isListed: boolean } =
        action.payload.data;

      state.courses = state.courses.map((oldCourse) =>
        oldCourse._id == courseId ? { ...oldCourse, isListed } : oldCourse
      );
      successPopup(action.payload.message || "course list status changed");
    });

    builder.addCase(adminCourseListUnListApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });
  },
});

export const { changePage } = adminCourseSlice.actions;
export default adminCourseSlice.reducer;
