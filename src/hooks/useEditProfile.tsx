import {
  axiosGetRequest,
  axiosPatchRequest,
  axiosPutRequest,
} from "@/config/axios";
import { PROFILE_API } from "@/constants";
import { updateProfileImage } from "@/features/Auth/slice/userSlice";
import { AppDispatch } from "@/store";
import { successPopup } from "@/utils/popup";
import {
  UserProfileSchema,
  UserProfileSchemaType,
} from "@/validation/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const useEditProfile = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchProfileData = async () => {
      const res = await axiosGetRequest("/profile");
      if (!res) return;
      reset(res.data);
    };
    fetchProfileData();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    clearErrors,
    setError,
    formState: { errors },
    reset,
    trigger,
  } = useForm<UserProfileSchemaType>({
    resolver: zodResolver(UserProfileSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      bio: "",
      location: "",
      company: "",
      position: "",
      education: "",
      socialLinks: {
        github: "",
        linkedin: "",
        instagram: "",
        facebook: "",
        youtube: "",
        website: "",
      },
      experiences: [],
      skills: ["React", "TypeScript"],
    },
  });

  const editProfile = async (data: UserProfileSchemaType) => {
    const res = await axiosPutRequest("/profile", data);
    if (!res) return;
    successPopup(res.message || "Profile updated successfully");
  };

  const profileImageChangeHandler = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axiosPatchRequest(PROFILE_API, formData);
      if (!res) return;
      successPopup(res.message || "updated");

      dispatch(updateProfileImage(res.data.profileImage));
    }
  };

  return {
    register,
    editProfile: () => {
      return handleSubmit(editProfile);
    },
    watch,
    setValue,
    getValues,
    errors,
    trigger,
    control,
    setError,
    clearErrors,
    profileImageChangeHandler,
  };
};

export default useEditProfile;
