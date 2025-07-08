import { createSlice } from "@reduxjs/toolkit";
import { getTrainerRevenueApi } from "../api/trainerRevenueApi";

interface ITransaction {
  _id: string;
  payer: string;
  course: string;
  amount: number;
}

interface IRevenue {
  totalRevenue: number;
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
    transactions: [],
  },
  currentPage: 0,
  totalPages: 0,
  loading: false,
};

const trainerRevenueSlice = createSlice({
  name: "trainerRevenue",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTrainerRevenueApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getTrainerRevenueApi.fulfilled, (state, action) => {
      const data: IInitialState = action.payload.data;
      if (data.currentPage == 1) {
        state.revenue.transactions = data.revenue.transactions;
      } else {
        state.revenue.transactions = [
          ...state.revenue.transactions,
          ...data.revenue.transactions,
        ];
      }
      state.revenue.totalRevenue = data.revenue.totalRevenue;
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
      state.loading = false;
    });
  },
});

export const { changePage } = trainerRevenueSlice.actions;
export default trainerRevenueSlice.reducer;
