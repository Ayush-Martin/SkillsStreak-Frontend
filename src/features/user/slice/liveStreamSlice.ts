import { createSlice } from "@reduxjs/toolkit";
import { getUserLiveStreams } from "../api/liveStreamApi";

interface ILiveStream {
  _id: string;
  roomId: string;
  thumbnail: string;
  title: string;
  description: string;
}

interface IInitialState {
  liveStreams: ILiveStream[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
}

const initialState: IInitialState = {
  liveStreams: [],
  currentPage: 0,
  totalPages: 0,
  loading: false,
};

const liveStreamSlice = createSlice({
  name: "userLiveStreams",
  initialState,
  reducers: {
    changePage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserLiveStreams.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getUserLiveStreams.fulfilled, (state, action) => {
      state.loading = false;
      const data: IInitialState = action.payload.data;
      console.log(data);
      if (data.currentPage == 1) {
        state.liveStreams = data.liveStreams;
      } else {
        state.liveStreams = [...state.liveStreams, ...data.liveStreams];
      }
    });
  },
});

export const { changePage } = liveStreamSlice.actions;
export default liveStreamSlice.reducer;
