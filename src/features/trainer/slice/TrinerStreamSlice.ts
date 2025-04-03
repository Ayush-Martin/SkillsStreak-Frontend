import { createSlice } from "@reduxjs/toolkit";

type StreamType = {
  roomId: string;
  token: string;
};

const initialState: StreamType = {
  roomId: "",
  token: "",
};

const TrainerStream = createSlice({
  name: "trainerStream",
  initialState,
  reducers: {
    startStream: (state, action) => {
      const { roomId, token } = action.payload;
      state.roomId = roomId;
      state.token = token;
    },
    endStream: (state) => {
      state.roomId = "";
      state.token = "";
    },
  },
});

export const { startStream, endStream } = TrainerStream.actions;
export default TrainerStream.reducer;
