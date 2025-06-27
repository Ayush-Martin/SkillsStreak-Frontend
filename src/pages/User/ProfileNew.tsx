import { ErrorText, Profile, ProfileImage, UserSidebar } from "@/components";
import { Button, Input, Textarea } from "@/components/ui";
import { UserLayout } from "@/layouts";
import { IProfile } from "@/types/userType";
import { ChangeEvent, FC, useState } from "react";
import { MdClose } from "react-icons/md";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BioValidationRule,
  CompanyValidationRule,
  PlaceValidationRule,
  PositionValidationRule,
  SocialLinksValidationRule,
  UsernameValidationRule,
} from "@/utils/validationRules";
import { useDispatch } from "react-redux";
import { axiosPatchRequest, axiosPutRequest } from "@/config/axios";
import { PROFILE_API } from "@/constants";
import { successPopup } from "@/utils/popup";
import {
  updateProfileData,
  updateProfileImage,
} from "@/features/Auth/slice/userSlice";
import { AppDispatch, RootReducer } from "@/store";
import { useSelector } from "react-redux";

interface IEditProfileProps {
  data: Omit<IProfile, "email">;
  close: () => void;
}

const UserProfileSchema = z.object({
  username: UsernameValidationRule,
  position: PositionValidationRule,
  place: PlaceValidationRule,
  company: CompanyValidationRule,
  bio: BioValidationRule,
  socialLinks: SocialLinksValidationRule,
});

export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>;

interface IUserProfileProps extends UserProfileSchemaType {
  profileImage: string;
  email: string;
  close: () => void;
}

const EditProfile: FC<IEditProfileProps> = ({ data, close }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserProfileSchemaType>({
    defaultValues: {
      ...data,
    },
    resolver: zodResolver(UserProfileSchema),
    mode: "onChange",
  });

  const dispatch: AppDispatch = useDispatch();

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
    <div className="fixed inset-0 overflow-y-auto z-50 backdrop-blur-md backdrop-saturate-150 bg-black/30 flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="backdrop-blur-md backdrop-saturate-150 bg-[#111827]/10 w-full max-w-3xl rounded-2xl shadow-2xl p-8 relative border border-[#2a2f45] ">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-white hover:text-red-500 text-2xl"
        >
          <MdClose />
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Edit Profile</h1>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3 justify-center items-center">
            <ProfileImage
              profileImage={data.profileImage}
              size={32}
              textSize="5xl"
            />
            <div className="flex items-center justify-center">
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Change
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={profileImageChangeHandler}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400 font-medium">
                  Name
                </label>
                <Input
                  className="bg-transparent text-white border border-[#2e3a4a] focus:ring-app-accent"
                  placeholder="name"
                  {...register("username")}
                />
              </div>
              {errors.username?.message && (
                <ErrorText error={errors.username.message} />
              )}
            </div>

            <div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400 font-medium">
                  Position
                </label>
                <Input
                  className="bg-transparent text-white border border-[#2e3a4a] focus:ring-app-accent"
                  placeholder="position"
                  {...register("position")}
                />
              </div>
              {errors.position?.message && (
                <ErrorText error={errors.position.message} />
              )}
            </div>

            <div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400 font-medium">
                  Place
                </label>
                <Input
                  className="bg-transparent text-white border border-[#2e3a4a] focus:ring-app-accent"
                  placeholder="place"
                  {...register("place")}
                />
              </div>
              {errors.place?.message && (
                <ErrorText error={errors.place.message} />
              )}
            </div>

            <div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-400 font-medium">
                  Company
                </label>
                <Input
                  className="bg-transparent text-white border border-[#2e3a4a] focus:ring-app-accent"
                  placeholder="company"
                  {...register("company")}
                />
              </div>
              {errors.company?.message && (
                <ErrorText error={errors.company.message} />
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400 font-medium">Bio</label>
              <Textarea
                className="bg-transparent text-white border border-[#2e3a4a] focus:ring-app-accent"
                placeholder="Tell us about yourself..."
                {...register("bio")}
              />
            </div>
            {errors.bio?.message && <ErrorText error={errors.bio.message} />}
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-400 font-medium">Social Links</p>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400 font-medium">
                    GitHub
                  </label>
                  <Input
                    className="bg-transparent text-white border border-[#2e3a4a] focus:ring-app-accent"
                    placeholder="https://github.com/yourusername"
                    {...register("socialLinks.github")}
                  />
                </div>
                {errors.socialLinks?.github?.message && (
                  <ErrorText error={errors.socialLinks.github.message} />
                )}
              </div>

              <div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400 font-medium">
                    LinkedIn
                  </label>
                  <Input
                    className="bg-transparent text-white border border-[#2e3a4a] focus:ring-app-accent"
                    placeholder="https://linkedin.com/yourusername"
                    {...register("socialLinks.linkedin")}
                  />
                </div>
                {errors.socialLinks?.linkedin?.message && (
                  <ErrorText error={errors.socialLinks.linkedin.message} />
                )}
              </div>

              <div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-400 font-medium">
                    Website
                  </label>
                  <Input
                    className="bg-transparent text-white border border-[#2e3a4a] focus:ring-app-accent"
                    placeholder="https://website.com/yourusername"
                    {...register("socialLinks.website")}
                  />
                </div>
                {errors.socialLinks?.website?.message && (
                  <ErrorText error={errors.socialLinks.website.message} />
                )}
              </div>
            </div>
          </div>

          <Button
            className="mt-4 w-full bg-app-accent text-white py-3 text-lg rounded-md hover:bg-opacity-90 transition"
            onClick={handleSubmit(profileUpdateHandler)}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProfileNew = () => {
  const [open, setOpen] = useState(false);
  const { username, bio, company, place, socialLinks, profileImage, position } =
    useSelector((state: RootReducer) => state.user);

  const data: Omit<IProfile, "email"> = {
    username,
    bio,
    company,
    profileImage,
    place,
    position,
    socialLinks,
  };

  return (
    <UserLayout>
      <div className="relative flex">
        <UserSidebar />
        <div className="w-full mt-10 ml-0 text-white md:ml-64 md:mt-0 p-5 relative">
          <div className="flex justify-center mb-2">
            <Button onClick={() => setOpen((p) => !p)}>Edit Profile</Button>
          </div>
          {open && <EditProfile data={data} close={() => setOpen(false)} />}
          <Profile {...data} email="abc@gmail.com" />
        </div>
      </div>
    </UserLayout>
  );
};

export default ProfileNew;
