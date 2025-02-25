import { configureStore } from "@reduxjs/toolkit";
import user from "./features/Auth/userSlice";
import adminUser from "./features/admin/slice/adminUserSlice";
import adminTrainerRequest from "./features/admin/slice/adminTrainerRequetsSlice";

const store = configureStore({
  reducer: {
    user,
    adminUser,
    adminTrainerRequest,
  },
});

export default store;
export type RootReducer = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
