import { createSlice } from "@reduxjs/toolkit";
import { getUserTransactionsApi } from "../api/transactionApi";

interface ITransaction {
  _id: string;
  payerId: {
    _id: string;
    email: string;
    role: string;
  };
  receiverId?: {
    _id: string;
    email: string;
    role: string;
  };
  courseId?: {
    _id: string;
    title: string;
  };
  amount: number;
  type: "payment" | "commission" | "subscription" | "refund";
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
