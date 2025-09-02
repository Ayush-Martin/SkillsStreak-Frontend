import { createSlice } from "@reduxjs/toolkit";
import { getAdminRevenueApi } from "../api/adminRevenueApi";

interface ITransaction {
  _id: string;
  payer: string;
  type: "subscription" | "commission";
  amount: number;
  date: string;
}

interface IRevenue {
  totalRevenue: number;
  commissionRevenue: number;
  subscriptionRevenue: number;
  transactions: Array<ITransaction>;
}

interface IInitialState {
  revenue: IRevenue;
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const initialState: IInitialState = {
  revenue: {
    totalRevenue: 0,
    commissionRevenue: 0,
    subscriptionRevenue: 0,
    transactions: [],
  },
  currentPage: 0,
  totalPages: 0,
  loading: false,
};

const adminRevenueSlice = createSlice({
  name: "adminRevenue",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminRevenueApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAdminRevenueApi.fulfilled, (state, action) => {
      const data: IInitialState = action.payload.data;
      if (data.currentPage == 1) {
        state.revenue.transactions = data.revenue.transactions;
      } else {
        state.revenue.transactions = [
          ...state.revenue.transactions,
          ...data.revenue.transactions,
        ];
      }
      state.revenue.commissionRevenue = data.revenue.commissionRevenue;
      state.revenue.subscriptionRevenue = data.revenue.subscriptionRevenue;
      state.revenue.totalRevenue = data.revenue.totalRevenue;
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
      state.loading = false;
    });
  },
});

export const { changePage } = adminRevenueSlice.actions;
export default adminRevenueSlice.reducer;
