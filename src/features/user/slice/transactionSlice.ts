import { createSlice } from "@reduxjs/toolkit";
import { getUserTransactionsApi } from "../api/transactionApi";

export interface ITransaction {
  _id: string;
  payer: {
    _id: string;
    email: string;
    role: string;
  };
  receiver?: {
    _id: string;
    email: string;
    role: string;
  };
  course?: {
    _id: string;
    thumbnail: string;
    title: string;
  };
  amount: number;
  type:
    | "course_purchase"
    | "commission"
    | "subscription"
    | "wallet_redeem"
    | "wallet_add";
  status: "pending" | "completed" | "canceled" | "failed" | "on_process";
  method: "stripe" | "wallet";
  adminCommission?: number;
}

interface IInitialState {
  transactions: Array<ITransaction>;
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const initialState: IInitialState = {
  transactions: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
};

const transactionSlice = createSlice({
  name: "userTransactions",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserTransactionsApi.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserTransactionsApi.fulfilled, (state, action) => {
      const data: IInitialState = action.payload.data;
      if (data.currentPage == 1) {
        state.transactions = data.transactions;
      } else {
        state.transactions = [...state.transactions, ...data.transactions];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
      state.loading = false;
    });
  },
});

export const { changePage } = transactionSlice.actions;
export default transactionSlice.reducer;
