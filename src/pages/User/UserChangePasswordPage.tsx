import { useForm } from "react-hook-form";
import { FC } from "react";

import AuthLayout from "@/layouts/AuthLayout";
import resetPasswordImage from "@/assets/images/resetPassword.jpg";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorText, Input, Button } from "@/components";
import { useNavigate } from "react-router-dom";
import {
  ChangePasswordSchema,
  IChangePasswordSchema,
} from "@/validation/auth.validation";
import { changePassword } from "@/api";

const ChangePassword: FC = () => {
  const {
    register,
    formState: { isSubmitting, isValid, errors },
    trigger,
    handleSubmit,
  } = useForm<IChangePasswordSchema>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: zodResolver(ChangePasswordSchema),
  });

  const navigate = useNavigate();

  const submit = async (data: IChangePasswordSchema) => {
    const res = await changePassword(data);
    if (!res) return;
    navigate(-1);
  };

  return (
    <AuthLayout>
      <div className="sm:bg-app-border w-full sm:w-[500px] lg:w-[1100px] h-[600px] flex ">
        <div className="hidden w-1/2 h-full lg:block">
          <img
            src={resetPasswordImage}
            alt=""
            className="object-cover h-full"
          />
        </div>
        <div className="flex items-center justify-center w-full h-full lg:w-1/2">
          <div className="bg-app-primary w-[380px] py-2">
            <h1 className="py-4 text-3xl text-center text-app-secondary">
              Reset Password
            </h1>
            <form
              action=""
              className="flex flex-col gap-4 px-10 py-4"
              onSubmit={handleSubmit(submit)}
            >
              <Input
                placeholder="Current Password"
                type="currentPassword"
                className="bg-[#141926] border-white/10 text-white"
                {...register("currentPassword")}
                onBlur={() => trigger("currentPassword")}
              />
              {errors.currentPassword && (
                <ErrorText error={errors.currentPassword.message!} />
              )}
              <Input
                placeholder="New Password"
                type="newPassword"
                className="bg-[#141926] border-white/10 text-white"
                {...register("newPassword")}
                onBlur={() => trigger("newPassword")}
              />
              {errors.newPassword && (
                <ErrorText error={errors.newPassword.message!} />
              )}
              <Input
                placeholder="Confirm New Password"
                type="newPassword"
                className="bg-[#141926] border-white/10 text-white"
                {...register("confirmNewPassword")}
                onBlur={() => trigger("confirmNewPassword")}
              />
              {errors.confirmNewPassword && (
                <ErrorText error={errors.confirmNewPassword.message!} />
              )}
              <Button variant={"v1"} disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Loading ..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ChangePassword;
