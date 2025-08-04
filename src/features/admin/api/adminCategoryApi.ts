import appApi from "@/config/axios";
import { ADMIN_CATEGORY_API } from "@/constants/API";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminCategoriesApi = createAsyncThunk<
  IResponse,
  { page: number; search: string; size: number }
>(
  "adminCategory/getCategories",
  async ({ page, search, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `${ADMIN_CATEGORY_API}?search=${search}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const adminCategoryListUnListApi = createAsyncThunk<IResponse, string>(
  "adminCategory/listUnListCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await appApi.patch(
        `${ADMIN_CATEGORY_API}/${categoryId}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const adminCategoryEditApi = createAsyncThunk<
  IResponse,
  { categoryId: string; categoryName: string }
>(
  "adminCategory/editCategory",
  async ({ categoryId, categoryName }, { rejectWithValue }) => {
    try {
      const response = await appApi.put(`${ADMIN_CATEGORY_API}/${categoryId}`, {
        categoryName,
      });
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const adminCategoryAddApi = createAsyncThunk<IResponse, string>(
  "adminCategory/addCategory",
  async (categoryName, { rejectWithValue }) => {
    try {
      const response = await appApi.post(ADMIN_CATEGORY_API, {
        categoryName,
      });
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
