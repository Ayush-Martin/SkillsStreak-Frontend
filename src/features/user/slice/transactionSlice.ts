import { createSlice } from "@reduxjs/toolkit";
import { getUserTransactionsApi } from "../api/transactionApi";

interface ITransaction {
  _id: string;
  transactionId: string;
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
  type: "payment" | "commission" | "subscription" | "redeem";
}

interface IInitialState {
  transactions: Array<ITransaction>;
  currentPage: number;
  totalPages: number;
}

const initialState: IInitialState = {
  transactions: [],
  currentPage: 1,
  totalPages: 1,
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
    builder.addCase(getUserTransactionsApi.fulfilled, (state, action) => {
      const data: IInitialState = action.payload.data;
      if (data.currentPage == 1) {
        state.transactions = data.transactions;
      } else {
        state.transactions = [...state.transactions, ...data.transactions];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
    });
  },
});

export const { changePage } = transactionSlice.actions;
export default transactionSlice.reducer;
