import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface IUser {
  username: string;
  email: string;
  profileImage: string;
  about: string;
  bio: string;
  place: string;
  position: string;
  company: string;
  socialLinks: {
    github: string;
    linkedin: string;
    website: string;
  };
  areaOfInterest: string[];
  isBlocked: boolean;
  role: "user" | "admin" | "trainer" | "premium" | "";
  accessToken: string;
  _id: string;
  stripeAccountId: string;
}

const initialState: IUser = {
  username: "",
  email: "",
  profileImage: "",
  position: "",
  areaOfInterest: [],
  about: "",
  bio: "",
  place: "",
  company: "",
  socialLinks: {
    github: "",
    linkedin: "",
    website: "",
  },
  role: "",
  isBlocked: false,
  accessToken: "",
  _id: "",
  stripeAccountId: "",
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
        bio,
        place,
        company,
        socialLinks,
        position,
        stripeAccountId,
      }: IUser = jwtDecode(action.payload);

      state.username = username;
      state.email = email;
      state.about = about;
      state.bio = bio;
      state.place = place;
      state.company = company;
      state.socialLinks = socialLinks;
      state.areaOfInterest = areaOfInterest;
      state.isBlocked = isBlocked;
      state.role = role;
      state.profileImage = profileImage;
      state._id = _id;
      state.accessToken = action.payload;
      state.position = position;
      state.stripeAccountId = stripeAccountId;
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
      state.bio = "";
      state.place = "";
      state.company = "";
      state.position = "";
      state.socialLinks = {
        github: "",
        linkedin: "",
        website: "",
      };
      state.stripeAccountId = "";
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    updateProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },

    updateProfileData: (state, action) => {
      state.about = action.payload.about;
      state.bio = action.payload.bio;
      state.company = action.payload.company;
      state.place = action.payload.place;
      state.socialLinks = action.payload.socialLinks;
      state.username = action.payload.username;
      state.areaOfInterest = action.payload.areaOfInterest;
      state.position = action.payload.position;
    },

    updateStripeAccountId: (state, action) => {
      state.stripeAccountId = action.payload;
    },
  },
});

export const {
  login,
  logout,
  setAccessToken,
  updateProfileData,
  updateProfileImage,
  updateStripeAccountId,
} = userSlice.actions;
export default userSlice.reducer;
