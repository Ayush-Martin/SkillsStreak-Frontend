import { configureStore } from "@reduxjs/toolkit";
import user from "./features/Auth/slice/userSlice";
import adminUser from "./features/admin/slice/adminUserSlice";
import adminTrainerRequest from "./features/admin/slice/adminTrainerRequestSlice";
import adminCategory from "./features/admin/slice/adminCategorySlice";
import trainerCourses from "./features/trainer/slice/TrainerCoursesSlice";
import courses from "./features/user/slice/coursesSlice";
import userTransactions from "./features/user/slice/transactionSlice";
import enrolledCourses from "./features/user/slice/enrolledCourseSlice";
import adminTransactions from "./features/admin/slice/adminTransactionSlice";
import adminCourses from "./features/admin/slice/adminCourseSlice";
import completedEnrolledCourses from "./features/user/slice/completedEnrolledCourses";
import trainerStudents from "./features/trainer/slice/StudentsSlice";
import trainerStream from "./features/trainer/slice/TrinerStreamSlice";
import userStream from "./features/user/slice/liveStreamSlice";

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
    completedEnrolledCourses,
    trainerStudents,
    trainerStream,
    userStream,
  },
});

export default store;
export type RootReducer = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
