import { createSlice } from "@reduxjs/toolkit";
import { getUserWalletHistoryApi } from "../api/walletHistoryApi";

interface IWalletHistory {
  _id: string;
  amount: number;
  type: "credit" | "debit";
  createdAt: string;
}

interface IInitialState {
  walletHistory: Array<IWalletHistory>;
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const initialState: IInitialState = {
  walletHistory: [],
  currentPage: 1,
  totalPages: 0,
  loading: false,
};

const walletHistorySlice = createSlice({
  name: "userWalletHistory",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserWalletHistoryApi.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserWalletHistoryApi.fulfilled, (state, action) => {
      const data: IInitialState = action.payload.data;
      if (data.currentPage == 1) {
        state.walletHistory = data.walletHistory;
      } else {
        state.walletHistory = [...state.walletHistory, ...data.walletHistory];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
      state.loading = false;
    });
  },
});

export const { changePage } = walletHistorySlice.actions;
export default walletHistorySlice.reducer;
