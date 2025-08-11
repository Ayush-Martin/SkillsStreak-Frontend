import appApi from "@/config/axios";
import { IApiResponseError, IResponse } from "@/types/responseType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAdminTopicsApi = createAsyncThunk<
  IResponse,
  { page: number; search: string; size: number }
>(
  "adminTopic/getTopics",
  async ({ page, search, size }, { rejectWithValue }) => {
    try {
      const response = await appApi.get(
        `/admin/topics?search=${search}&page=${page}&size=${size}`
      );
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const adminTopicEditApi = createAsyncThunk<
  IResponse,
  { topicId: string; topicName: string }
>(
  "adminTopic/editTopic",
  async ({ topicId, topicName }, { rejectWithValue }) => {
    try {
      const response = await appApi.put(`/admin/topics/${topicId}`, {
        topicName,
      });
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);

export const adminTopicAddApi = createAsyncThunk<IResponse, string>(
  "adminTopic/addTopic",
  async (topicName, { rejectWithValue }) => {
    try {
      const response = await appApi.post(`/admin/topics`, {
        topicName,
      });
      return response.data;
    } catch (err) {
      const resErr = err as IApiResponseError;
      return rejectWithValue(resErr.response.data.error);
    }
  }
);
