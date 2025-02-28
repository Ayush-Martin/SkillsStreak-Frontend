import { configureStore } from "@reduxjs/toolkit";
import user from "./features/Auth/slice/userSlice";
import adminUser from "./features/admin/slice/adminUserSlice";
import adminTrainerRequest from "./features/admin/slice/adminTrainerRequetsSlice";
import adminCategory from "./features/admin/slice/adminCategorySlice";
import trainerCourses from "./features/trainer/slice/TrainerCoursesSlice";

const store = configureStore({
  reducer: {
    user,
    adminUser,
    adminTrainerRequest,
    adminCategory,
    trainerCourses,
  },
});

export default store;
export type RootReducer = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
