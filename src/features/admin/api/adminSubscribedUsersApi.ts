import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminSubscribedUsersApi = createAsyncThunk<
  IResponse,
  {
    page: number;
    search: string;
    size: number;
    subscriptionPlanId: string | "all";
  }
>(
  "adminSubscribedUser/getSubscribedUsers",
  async ({ page, search, size, subscriptionPlanId }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
        size: size.toString(),
      });

      if (subscriptionPlanId !== "all") {
        params.append("subscriptionPlanId", subscriptionPlanId);
      }

      const response = await appApi.get(
        `/admin/subscriptions?${params.toString()}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
