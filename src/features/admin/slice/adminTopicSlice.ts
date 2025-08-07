import { createSlice } from "@reduxjs/toolkit";
import {
  adminTopicAddApi,
  adminTopicEditApi,
  getAdminTopicsApi,
} from "../api/adminTopicApi";
import { errorPopup, successPopup } from "@/utils/popup";

type TopicType = {
  topicName: string;
  _id: string;
};

type topicsType = Array<TopicType>;

type initialStateType = {
  topics: topicsType;
  currentPage: number;
  totalPages: number;
  loading: boolean;
};

const initialState: initialStateType = {
  topics: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
};

const AdminTopicSlice = createSlice({
  name: "adminTopic",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAdminTopicsApi.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAdminTopicsApi.fulfilled, (state, action) => {
      const data: initialStateType = action.payload.data;
      if (data.currentPage == 1) {
        state.topics = data.topics;
      } else {
        state.topics = [...state.topics, ...data.topics];
      }
      state.currentPage = data.currentPage;
      state.totalPages = data.totalPages;
      state.loading = false;
    });

    builder.addCase(getAdminTopicsApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });

    builder.addCase(adminTopicAddApi.fulfilled, (state, action) => {
      const category: TopicType = action.payload.data;

      state.topics = [category, ...state.topics];
      state.currentPage = 1;
      state.totalPages = 1;
      successPopup(action.payload.message || "new category added");
    });

    builder.addCase(adminTopicAddApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });

    builder.addCase(adminTopicEditApi.fulfilled, (state, action) => {
      const category: TopicType = action.payload.data;
      state.topics = state.topics.map((oldTopic) =>
        oldTopic._id == category._id ? category : oldTopic
      );

      successPopup(action.payload.message || "category updated");
    });

    builder.addCase(adminTopicEditApi.rejected, (_, action) => {
      const err = action.payload as string;
      errorPopup(err);
    });
  },
});

export const { changePage } = AdminTopicSlice.actions;
export default AdminTopicSlice.reducer;
