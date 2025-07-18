import { createSlice } from "@reduxjs/toolkit";
import {
  AdminChangeTrainerRequestStatus,
  getAdminTrainerRequestsApi,
} from "../api/adminTrainerRequestApi";
import { errorPopup, successPopup } from "@/utils/popup";

type TrainerRequestType = Array<{
  status: string;
  userId: {
    username: string;
    email: string;
    _id: string;
  };
  _id: string;
  rejectedReason: string;
}>;

type initialStateType = {
  users: TrainerRequestType;
  currentPage: number;
  totalPages: number;
  loading: boolean;
};

const initialState: initialStateType = {
  users: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
};

const AdminTrainerRequestSlice = createSlice({
  name: "adminTrainerRequests",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminTrainerRequestsApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAdminTrainerRequestsApi.fulfilled, (state, action) => {
      const data: initialStateType = action.payload.data;
      if (data.currentPage == 1) {
        state.users = data.users;
      } else {
        state.users = [...state.users, ...data.users];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
      state.loading = false;
    });

    builder.addCase(getAdminTrainerRequestsApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });

    builder.addCase(
      AdminChangeTrainerRequestStatus.fulfilled,
      (state, action) => {
        const { status, rejectedReason, _id } = action.payload.data;

        console.log(action.payload.data);

        state.users = state.users.map((user) =>
          user._id == _id ? { ...user, status, rejectedReason } : user
        );

        successPopup(
          action.payload.message || "request status has been changed"
        );
      }
    );

    builder.addCase(AdminChangeTrainerRequestStatus.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });
  },
});

export const { changePage } = AdminTrainerRequestSlice.actions;
export default AdminTrainerRequestSlice.reducer;
