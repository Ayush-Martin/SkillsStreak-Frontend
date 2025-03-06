import { configureStore } from "@reduxjs/toolkit";
import user from "./features/Auth/slice/userSlice";
import adminUser from "./features/admin/slice/adminUserSlice";
import adminTrainerRequest from "./features/admin/slice/adminTrainerRequetsSlice";
import adminCategory from "./features/admin/slice/adminCategorySlice";
import trainerCourses from "./features/trainer/slice/TrainerCoursesSlice";
import courses from "./features/user/slice/coursesSlice";
import userTransactions from "./features/user/slice/transactionSlice";
import enrolledCourses from "./features/user/slice/enrolledCourseSlice";
import adminTransactions from "./features/admin/slice/adminTransactionSlice";
import adminCourses from "./features/admin/slice/adminCourseSlice";

const store = configureStore({
  reducer: {
    user,
    adminUser,
    adminTrainerRequest,
    adminCategory,
    trainerCourses,
    courses,
    userTransactions,
    adminTransactions,
    enrolledCourses,
    adminCourses,
  },
});

export default store;
export type RootReducer = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
