import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminSubscriptionPlansApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    search: string;
    size: number;
  }
>(
  "adminSubscriptionPlans/getSubscriptionPlans",
  async ({ page, search, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `/admin/subscriptionPlans?search=${search}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const adminSubscriptionPlanListUnListApi = createAsyncThunk<
  IResponse,
  string
>(
  "adminSubscriptionPlans/listUnListSubscriptionPlan",
  async (subscriptionPlanId, { rejectWithValue }) => {
    try {
      const response = await appApi.patch(
        `/admin/subscriptionPlans/${subscriptionPlanId}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;

      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const adminSubscriptionPlanEditApi = createAsyncThunk<
  IResponse,
  {
    subscriptionPlanId: string;
    title: string;
    description: string;
    price: number;
    duration: number;
    features: Array<string>;
  }
>(
  "adminSubscriptionPlans/editSubscriptionPlan",
  async (
    { subscriptionPlanId, title, description, price, duration, features },
    { rejectWithValue }
  ) => {
    try {
      const response = await appApi.put(
        `/admin/subscriptionPlans/${subscriptionPlanId}`,
        {
          title,
          description,
          price,
          duration,
          features,
        }
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const adminSubscriptionPlanAddApi = createAsyncThunk<
  IResponse,
  {
    title: string;
    description: string;
    price: number;
    duration: number;
    features: Array<string>;
  }
>(
  "adminSubscriptionPlans/addSubscriptionPlan",
  async (
    { title, description, price, duration, features },
    { rejectWithValue }
  ) => {
    try {
      const response = await appApi.post("/admin/subscriptionPlans", {
        title,
        description,
        price,
        duration,
        features,
      });
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
