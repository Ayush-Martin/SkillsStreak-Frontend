import { createSlice } from "@reduxjs/toolkit";
import { errorPopup, successPopup } from "@/utils/popup";
import {
  adminSubscriptionPlanAddApi,
  adminSubscriptionPlanEditApi,
  adminSubscriptionPlanListUnListApi,
  getAdminSubscriptionPlansApi,
} from "../api/adminSubscriptionPlanApi";

interface ISubscriptionPlan {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  isListed: boolean;
  features: Array<string>;
}

interface IInitialState {
  subscriptionPlans: Array<ISubscriptionPlan>;
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const initialState: IInitialState = {
  subscriptionPlans: [],
  currentPage: 0,
  totalPages: 0,
  loading: false,
};

const adminSubscriptionPlanSlice = createSlice({
  name: "adminSubscriptionPlans",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminSubscriptionPlansApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAdminSubscriptionPlansApi.fulfilled, (state, action) => {
      const data: IInitialState = action.payload.data;
      if (data.currentPage == 1) {
        state.subscriptionPlans = data.subscriptionPlans;
      } else {
        state.subscriptionPlans = [
          ...state.subscriptionPlans,
          ...data.subscriptionPlans,
        ];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
      state.loading = false;
    });

    builder.addCase(getAdminSubscriptionPlansApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });

    builder.addCase(adminSubscriptionPlanAddApi.fulfilled, (state, action) => {
      const subscriptionPlan: ISubscriptionPlan = action.payload.data;

      state.subscriptionPlans = [subscriptionPlan, ...state.subscriptionPlans];
      state.currentPage = 1;
      state.totalPages = 1;
      successPopup(action.payload.message || "new subscriptionPlan added");
    });

    builder.addCase(adminSubscriptionPlanAddApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });

    builder.addCase(adminSubscriptionPlanEditApi.fulfilled, (state, action) => {
      const subscriptionPlan: ISubscriptionPlan = action.payload.data;
      state.subscriptionPlans = state.subscriptionPlans.map((oldPlan) =>
        oldPlan._id == subscriptionPlan._id ? subscriptionPlan : oldPlan
      );

      successPopup(action.payload.message || "subscriptionPlan updated");
    });

    builder.addCase(adminSubscriptionPlanEditApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });

    builder.addCase(
      adminSubscriptionPlanListUnListApi.fulfilled,
      (state, action) => {
        const {
          subscriptionPlanId,
          isListed,
        }: { subscriptionPlanId: string; isListed: boolean } =
          action.payload.data;


        state.subscriptionPlans = state.subscriptionPlans.map((oldPlan) =>
          oldPlan._id == subscriptionPlanId ? { ...oldPlan, isListed } : oldPlan
        );

        successPopup(
          action.payload.message || "subscriptionPlan list status changed"
        );
      }
    );

    builder.addCase(
      adminSubscriptionPlanListUnListApi.rejected,
      (_, action) => {
        const err = action.payload as string;
        errorPopup(err);
      }
    );
  },
});

export const { changePage } = adminSubscriptionPlanSlice.actions;
export default adminSubscriptionPlanSlice.reducer;
