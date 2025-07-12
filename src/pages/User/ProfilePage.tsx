import { ErrorText, ProfileImage, UserSidebar } from "@/components";
import { UserLayout } from "@/layouts";
import React, { ChangeEvent } from "react";
import { Input, Textarea, Button } from "@/components/ui";
import { Camera } from "lucide-react";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiAward,
  FiGlobe,
  FiGithub,
  FiLinkedin,
  FiTool,
  FiBook,
  FiCode,
} from "react-icons/fi";
import { z } from "zod";
import {
  UsernameValidationRule,
  PositionValidationRule,
  PlaceValidationRule,
  CompanyValidationRule,
  BioValidationRule,
} from "@/utils/validationRules";
import { useDispatch, useSelector } from "react-redux";
import { RootReducer } from "@/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosPatchRequest, axiosPutRequest } from "@/config/axios";
import { PROFILE_API } from "@/constants";
import { updateProfileData, updateProfileImage } from "@/features/Auth/slice/userSlice";
import { successPopup } from "@/utils/popup";

const iconClass = "text-xl text-blue-400";

const UserProfileSchema = z.object({
  username: UsernameValidationRule,
  position: PositionValidationRule,
  place: PlaceValidationRule,
  company: CompanyValidationRule,
  bio: BioValidationRule,
  yearsOfExperience: z.coerce.number().min(0),
  educationalQualification: z.string().min(2, "Qualification is required"),
  skills: z.string().min(2, "Skills are required"),
  website: z.string().url("Invalid website"),
  github: z.string().url("Invalid GitHub"),
  linkedin: z.string().url("Invalid LinkedIn"),
});

export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>;

const ProfilePage = () => {
  const {
    bio,
    email,
    company,
    place,
    position,
    username,
    profileImage,
    skills,
    github,
    linkedin,
    website,
    educationalQualification,
    yearsOfExperience,
  } = useSelector((state: RootReducer) => state.user);

  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserProfileSchemaType>({
    defaultValues: {
      username,
      position,
      place,
      company,
      bio,
      yearsOfExperience,
      educationalQualification,
      skills,
      website,
      github,
      linkedin,
    },
    resolver: zodResolver(UserProfileSchema),
    mode: "onChange",
  });

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

  const profileUpdateHandler = async (data: UserProfileSchemaType) => {
    console.log("hello");
    const res = await axiosPutRequest(PROFILE_API, data);
    if (!res) return;
    successPopup(res.message || "updated");

    dispatch(updateProfileData(res.data));
  };

  return (
    <UserLayout>
      <div className="relative flex min-h-screen bg-[#0a0d17] text-white">
        <UserSidebar />

        <form
          onSubmit={handleSubmit(profileUpdateHandler)}
          className="w-full md:ml-64 px-6 py-10 md:px-12"
        >
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="relative">
              <ProfileImage
                profileImage={profileImage}
                size={32}
                textSize="3xl"
              />
              <label className="absolute bottom-1 right-1 bg-[#1c1f2b] p-2 rounded-full cursor-pointer hover:bg-[#2c2f3b] transition">
                <Camera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={profileImageChangeHandler}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">
              Click camera to change photo
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <FiUser className={iconClass} /> Full Name
              </label>
              <Input
                {...register("username")}
                className="bg-[#1c1f2b] border border-[#2e3345] text-white"
              />
              {errors.username?.message && (
                <ErrorText error={errors.username.message} />
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <FiMail className={iconClass} /> Email
              </label>
              <Input
                value={email}
                disabled
                className="bg-[#1c1f2b] border border-[#2e3345] text-white cursor-not-allowed"
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <FiTool className={iconClass} /> Bio
              </label>
              <Textarea
                {...register("bio")}
                rows={4}
                className="bg-[#1c1f2b] border border-[#2e3345] text-white"
              />
              {errors.bio?.message && <ErrorText error={errors.bio.message} />}
            </div>

            {/* Company */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <FiBriefcase className={iconClass} /> Company
              </label>
              <Input
                {...register("company")}
                className="bg-[#1c1f2b] border border-[#2e3345] text-white"
              />
              {errors.company?.message && (
                <ErrorText error={errors.company.message} />
              )}
            </div>

            {/* Role */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <FiBriefcase className={iconClass} /> Role / Position
              </label>
              <Input
                {...register("position")}
                className="bg-[#1c1f2b] border border-[#2e3345] text-white"
              />
              {errors.position?.message && (
                <ErrorText error={errors.position.message} />
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <FiAward className={iconClass} /> Years of Experience
              </label>
              <Input
                type="number"
                {...register("yearsOfExperience")}
                placeholder="e.g. 3"
                className="bg-[#1c1f2b] border border-[#2e3345] text-white"
              />
              {errors.yearsOfExperience?.message && (
                <ErrorText error={errors.yearsOfExperience.message} />
              )}
            </div>

            {/* Education */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <FiBook className={iconClass} /> Educational Qualification
              </label>
              <Input
                {...register("educationalQualification")}
                className="bg-[#1c1f2b] border border-[#2e3345] text-white"
              />
              {errors.educationalQualification?.message && (
                <ErrorText error={errors.educationalQualification.message} />
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <FiCode className={iconClass} /> Skills
              </label>
              <Input
                {...register("skills")}
                className="bg-[#1c1f2b] border border-[#2e3345] text-white"
              />
              {errors.skills?.message && (
                <ErrorText error={errors.skills.message} />
              )}
            </div>

            {/* Website */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <FiGlobe className={iconClass} /> Website
              </label>
              <Input
                {...register("website")}
                className="bg-[#1c1f2b] border border-[#2e3345] text-white"
              />
              {errors.website?.message && (
                <ErrorText error={errors.website.message} />
              )}
            </div>

            {/* GitHub */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <FiGithub className={iconClass} /> GitHub
              </label>
              <Input
                {...register("github")}
                className="bg-[#1c1f2b] border border-[#2e3345] text-white"
              />
              {errors.github?.message && (
                <ErrorText error={errors.github.message} />
              )}
            </div>

            {/* LinkedIn */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                <FiLinkedin className={iconClass} /> LinkedIn
              </label>
              <Input
                {...register("linkedin")}
                className="bg-[#1c1f2b] border border-[#2e3345] text-white"
              />
              {errors.linkedin?.message && (
                <ErrorText error={errors.linkedin.message} />
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-12 flex justify-center">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-base px-10 py-3 rounded-lg shadow-md transition-all duration-200"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </UserLayout>
  );
};

export default ProfilePage;
