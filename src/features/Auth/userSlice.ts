import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface IUser {
  username: string;
  email: string;
  profileImage: string;
  about: string;
  areaOfInterest: string[];
  isTrainer: boolean;
  isBlocked: boolean;
  isPremium: boolean;
  accessToken: string;
}

const initialState: IUser = {
  username: "",
  email: "",

  profileImage: "",
  areaOfInterest: [],
  about: "",
  isTrainer: false,
  isBlocked: false,
  isPremium: false,
  accessToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      const {
        username,
        email,
        about,
        areaOfInterest,
        isBlocked,
        isPremium,
        isTrainer,
        profileImage,
      }: IUser = jwtDecode(action.payload);

      state.username = username;
      state.email = email;
      state.about = about;
      state.areaOfInterest = areaOfInterest;
      state.isBlocked = isBlocked;
      state.isPremium = isPremium;
      state.isTrainer = isTrainer;
      state.profileImage = profileImage;
      state.accessToken = action.payload;
    },
  },
});

export default userSlice.reducer;
export const { login } = userSlice.actions;
