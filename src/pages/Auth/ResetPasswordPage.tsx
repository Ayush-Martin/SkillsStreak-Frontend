import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { FC, useEffect } from "react";
import { z } from "zod";

import AuthLayout from "@/layouts/AuthLayout";
import resetPasswordImage from "@/assets/images/resetPassword.jpg";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorText, Input, Button } from "@/components";
import { PasswordValidationRule } from "@/utils/validationRules";
import { resetPassword } from "@/api/auth.api";

const ResetPasswordSchema = z
  .object({
    password: PasswordValidationRule,
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password == confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate("/auth");
    }
  });

  const {
    register,
    formState: { isSubmitting, isValid, errors },
    trigger,
    handleSubmit,
  } = useForm<ResetPasswordSchemaType>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(ResetPasswordSchema),
  });

  const submit = async (data: ResetPasswordSchemaType) => {
    await resetPassword(email, data.password);
    navigate("/auth");
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
                placeholder="Password"
                type="password"
                className="bg-app-highlight"
                {...register("password")}
                onBlur={() => trigger("password")}
              />
              {errors.password && (
                <ErrorText error={errors.password.message!} />
              )}
              <Input
                placeholder="Confirm Password"
                type="password"
                className="bg-app-highlight"
                {...register("confirmPassword")}
                onBlur={() => trigger("confirmPassword")}
              />
              {errors.confirmPassword && (
                <ErrorText error={errors.confirmPassword.message!} />
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

export default ResetPassword;
