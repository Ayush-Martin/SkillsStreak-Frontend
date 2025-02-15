import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface IUser {
  username: string;
  email: string;
  profileImage: string;
  about: string;
  areaOfInterest: string[];
  isBlocked: boolean;
  role: "user" | "admin" | "trainer" | "premium" | "";
  accessToken: string;
}

const initialState: IUser = {
  username: "",
  email: "",
  profileImage: "",
  areaOfInterest: [],
  about: "",
  role: "",
  isBlocked: false,
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
        profileImage,
        role,
      }: IUser = jwtDecode(action.payload);

      state.username = username;
      state.email = email;
      state.about = about;
      state.areaOfInterest = areaOfInterest;
      state.isBlocked = isBlocked;
      state.role = role;
      state.profileImage = profileImage;
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.username = "";
      state.email = "";
      state.about = "";
      state.areaOfInterest = [];
      state.isBlocked = false;
      state.role = "";
      state.profileImage = "";
      state.accessToken = "";
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export default userSlice.reducer;
export const { login, logout, setAccessToken } = userSlice.actions;
