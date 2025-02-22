import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { FaUserTie } from "react-icons/fa6";
import { z } from "zod";
import {
  AboutValidationRule,
  AreaOfInterestValidationRule,
  UsernameValidationRule,
} from "@/utils/validationRules";
import ErrorText from "./ErrorText";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  updateProfileApi,
  updateProfileImageApi,
} from "@/features/Auth/userApi";
import { ChangeEvent } from "react";

const UserProfileSchema = z.object({
  username: UsernameValidationRule,
  about: AboutValidationRule,
  areaOfInterest: AreaOfInterestValidationRule,
});

export type UserProfileSchemaType = z.infer<typeof UserProfileSchema>;

const UserProfile = ({
  username,
  email,
  profileImage,
  areaOfInterest,
  about,
}: UserProfileSchemaType & { profileImage: string; email: string }) => {
  const {
    register,
    formState: { errors },
    trigger,
    handleSubmit,
  } = useForm<UserProfileSchemaType>({
    defaultValues: {
      username,
      areaOfInterest,
      about,
    },
    resolver: zodResolver(UserProfileSchema),
  });

  const dispatch: AppDispatch = useDispatch();

  const profileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      dispatch(updateProfileImageApi(file));
    }
  };

  const profileUpdateHandler = (data: UserProfileSchemaType) => {
    dispatch(updateProfileApi(data));
  };

  return (
    <div className="rounded-md px-7 py-7 bg-app-border lg:w-[500px] xl:w-[600px]">
      <div className="flex items-center justify-center ">
        <div className="flex flex-col justify-center gap-2">
          <div className="bg-white rounded-full cursor-auto w-28 h-28 md:w-32 md:h-32">
            {profileImage ? (
              <img
                src={profileImage}
                alt=""
                className="object-cover rounded-full h-28 w-28 md:w-32 md:h-32"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-5xl rounded-full md:text-7xl text-app-primary ">
                <FaUserTie />
              </div>
            )}
          </div>
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
      </div>
      <form
        onSubmit={handleSubmit(profileUpdateHandler)}
        className="flex flex-col gap-2 px-3 mt-10 md:px-10 xl:px-20"
      >
        <div>
          <p className="flex items-start gap-2 ">
            <span className="w-16 font-bold">Name</span>
            <Input
              placeholder="name"
              className="bg-app-highlight"
              {...register("username")}
              onBlur={() => trigger("username")}
            />
          </p>
          {errors.username?.message && (
            <ErrorText error={errors.username?.message} />
          )}
        </div>
        <div>
          <p className="flex items-start gap-2 ">
            <span className="w-16 font-bold ">Email</span>
            <Input
              placeholder="email"
              className="bg-app-highlight"
              value={email}
            />
          </p>
        </div>
        <div>
          <p className="flex gap-2">
            <span className="w-16 font-bold ">About</span>
            <Textarea
              className="border-none resize-none bg-app-highlight text-app-neutral"
              {...register("about")}
              onBlur={() => trigger("about")}
            />
          </p>
          {errors.about?.message && <ErrorText error={errors.about?.message} />}
        </div>
        <div className="">
          <p className="font-bold">Area of Interest : </p>
          <div className="flex flex-wrap gap-3 mt-2">
            {areaOfInterest.map((x) => (
              <p className="flex px-2 py-1 border border-gray-400 rounded-sm">
                {x}
              </p>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            variant={"v2"}
            size={"lg"}
            type="submit"
            onClick={() => {
              console.log("hello");
              return;
            }}
          >
            Edit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
