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
  skills: string;
  educationalQualification: string;
  yearsOfExperience: number;
  github: string;
  linkedin: string;
  website: string;
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
  about: "",
  bio: "",
  place: "",
  company: "",
  educationalQualification: "",
  yearsOfExperience: 0,
  skills: "",
  github: "",
  linkedin: "",
  website: "",

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
        isBlocked,
        profileImage,
        role,
        _id,
        bio,
        place,
        company,
        github,
        linkedin,
        website,
        yearsOfExperience,
        educationalQualification,
        skills,
        position,
        stripeAccountId,
      }: IUser = jwtDecode(action.payload);

      state.username = username;
      state.email = email;
      state.about = about;
      state.bio = bio;
      state.place = place;
      state.company = company;
      state.isBlocked = isBlocked;
      state.role = role;
      state.profileImage = profileImage;
      state._id = _id;
      state.accessToken = action.payload;
      state.position = position;
      state.stripeAccountId = stripeAccountId;
      state.github = github;
      state.linkedin = linkedin;
      state.website = website;
      state.yearsOfExperience = yearsOfExperience;
      state.educationalQualification = educationalQualification;
      state.skills = skills;
    },
    logout: (state) => {
      state.username = "";
      state.email = "";
      state.about = "";

      state.isBlocked = false;
      state.role = "";
      state.profileImage = "";
      state._id = "";
      state.accessToken = "";
      state.bio = "";
      state.place = "";
      state.company = "";
      state.position = "";
      state.github = "";
      state.linkedin = "";
      state.website = "";
      state.yearsOfExperience = 0;
      state.educationalQualification = "";
      state.skills = "";

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

      state.username = action.payload.username;

      state.position = action.payload.position;
      state.github = action.payload.github;
      state.linkedin = action.payload.linkedin;
      state.website = action.payload.website;
      state.yearsOfExperience = action.payload.yearsOfExperience;
      state.educationalQualification = action.payload.educationalQualification;
      state.skills = action.payload.skills;
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
