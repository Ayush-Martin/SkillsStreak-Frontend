import { configureStore } from "@reduxjs/toolkit";
import user from "./features/Auth/userSlice";
import adminUser from "./features/admin/slice/adminUserSlice";

const store = configureStore({
  reducer: {
    user,
    adminUser,
  },
});

export default store;
export type RootReducer = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
