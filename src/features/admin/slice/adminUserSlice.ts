import { createSlice } from "@reduxjs/toolkit";
import {
  adminBlockUnblockUserApi,
  getAdminUsersApi,
} from "../api/adminUserApi";
import { errorPopup, successPopup } from "@/utils/popup";

type UsersType = Array<{
  username: "";
  email: "";
  _id: "";
  isBlocked: boolean;
}>;

type initialStateType = {
  users: UsersType;
  currentPage: number;
  totalPages: number;
};

const initialState: initialStateType = {
  users: [],
  currentPage: 1,
  totalPages: 1,
};

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminUsersApi.fulfilled, (state, action) => {
      const data: initialStateType = action.payload.data;
      console.log(data);
      if (data.currentPage == 1) {
        state.users = data.users;
      } else {
        state.users = [...state.users, ...data.users];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
    });

    builder.addCase(getAdminUsersApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });

    builder.addCase(adminBlockUnblockUserApi.fulfilled, (state, action) => {
      const { userId, blockStatus } = action.payload.data;
      state.users = state.users.map((user) =>
        user._id == userId ? { ...user, isBlocked: blockStatus } : user
      );

      successPopup(action.payload.message || "user block status changed");
    });

    builder.addCase(adminBlockUnblockUserApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });
  },
});

export const { changePage } = adminUserSlice.actions;
export default adminUserSlice.reducer;
