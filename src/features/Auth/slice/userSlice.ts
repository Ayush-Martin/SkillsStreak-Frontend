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
  _id: string;
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
  _id: "",
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
        _id,
      }: IUser = jwtDecode(action.payload);

      state.username = username;
      state.email = email;
      state.about = about;
      state.areaOfInterest = areaOfInterest;
      state.isBlocked = isBlocked;
      state.role = role;
      state.profileImage = profileImage;
      state._id = _id;
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
      state._id = "";
      state.accessToken = "";
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    updateProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },

    updateProfileData: (state, action) => {
      state.about = action.payload.about;
      state.username = action.payload.username;
      state.areaOfInterest = action.payload.areaOfInterest;
    },
  },
});

export const {
  login,
  logout,
  setAccessToken,
  updateProfileData,
  updateProfileImage,
} = userSlice.actions;
export default userSlice.reducer;
