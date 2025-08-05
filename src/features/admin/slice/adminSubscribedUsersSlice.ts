import { createSlice } from "@reduxjs/toolkit";
import { errorPopup } from "@/utils/popup";
import { getAdminSubscribedUsersApi } from "../api/adminSubscribedUsersApi";

type SubscribedUsersType = Array<{
  _id: string;
  startDate: Date;
  endDate: Date;
  user: {
    _id:1,
    username: string;
    email: string;
    profileImage: string;
  };
  subscriptionPlan: {
    _id: string;
    title: string;
    price: number;
  };
}>;

type initialStateType = {
  subscribedUsers: SubscribedUsersType;
  currentPage: number;
  totalPages: number;
  loading: boolean;
};

const initialState: initialStateType = {
  subscribedUsers: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
};

const adminSubscribedUserSlice = createSlice({
  name: "adminSubscribedUser",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminSubscribedUsersApi.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAdminSubscribedUsersApi.fulfilled, (state, action) => {
      const data: initialStateType = action.payload.data;
      if (data.currentPage == 1) {
        state.subscribedUsers = data.subscribedUsers;
      } else {
        state.subscribedUsers = [
          ...state.subscribedUsers,
          ...data.subscribedUsers,
        ];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
      state.loading = false;
    });

    builder.addCase(getAdminSubscribedUsersApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });
  },
});

export const { changePage } = adminSubscribedUserSlice.actions;
export default adminSubscribedUserSlice.reducer;
