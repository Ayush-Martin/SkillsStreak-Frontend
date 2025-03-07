import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import { ErrorText } from "@/components";
import { Button ,Input} from "@/components/ui";
import { EmailValidationRule } from "@/utils/validationRules";
import { axiosPostRequest } from "@/config/axios";
import { FORGET_PASSWORD_API } from "@/constants/API";
import { successPopup } from "@/utils/popup";

const ForgetPasswordSchema = z.object({
  email: EmailValidationRule,
});

type ForgetPasswordSchemaType = z.infer<typeof ForgetPasswordSchema>;

const ForgetPassword: FC = () => {
  const {
    register,
    formState: { isSubmitting, errors, isValid },
    trigger,
    handleSubmit,
  } = useForm<ForgetPasswordSchemaType>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(ForgetPasswordSchema),
  });

  const navigate = useNavigate();

  const submit = async (data: ForgetPasswordSchemaType) => {
    const res = await axiosPostRequest(FORGET_PASSWORD_API, data);
    if (!res) return;
    successPopup(res.message || "OTP sent to your email");
    navigate("/auth/verifyOTP", {
      state: {
        forAction: "resetPassword",
        email: data.email,
      },
    });
  };

  return (
    <AuthLayout>
      <div className=" w-[300px] py-5  text-center flex flex-col gap-5">
        <h1 className="text-3xl text-app-neutral">Forget Password</h1>
        <p className=" text-app-neutral">Enter your email to send OTP</p>

        <form
          action=""
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(submit)}
        >
          <div>
            <Input
              placeholder="Email"
              className="bg-app-highlight"
              {...register("email")}
              onBlur={() => trigger("email")}
            />

            {errors.email && <ErrorText error={errors.email.message!} />}
          </div>

          <Button variant={"v1"} disabled={isSubmitting || !isValid}>
            {isSubmitting ? "Sending OTP ..." : "Send OTP"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;
