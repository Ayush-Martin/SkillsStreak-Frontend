import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Input, Button } from "@/components/ui";
import { ErrorText,GoogleAuth } from "@/components";
import {
  EmailValidationRule,
  PasswordValidationRule,
  UsernameValidationRule,
} from "@/utils/validationRules";
import { axiosPostRequest } from "@/config/axios";
import { REGISTER_API } from "@/constants/API";
import { successPopup } from "@/utils/popup";

const RegisterSchema = z.object({
  email: EmailValidationRule,
  password: PasswordValidationRule,
  username: UsernameValidationRule,
});

type RegisterSchemaType = z.infer<typeof RegisterSchema>;

const Register: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
    trigger,
  } = useForm<RegisterSchemaType>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(RegisterSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterSchemaType) => {
    const res = await axiosPostRequest(REGISTER_API, data);
    if (!res) return;
    successPopup(res.data || "OTP sent");
    navigate("/auth/verifyOTP", {
      state: {
        email: data.email,
        forAction: "register",
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Input
          placeholder="username"
          className="bg-app-highlight"
          {...register("username")}
          onBlur={() => trigger("username")}
        />
        {errors.username && <ErrorText error={errors.username.message!} />}
      </div>
      <div>
        <Input
          placeholder="email"
          className="bg-app-highlight"
          {...register("email")}
          onBlur={() => trigger("email")}
        />
        {errors.email && <ErrorText error={errors.email.message!} />}
      </div>
      <div>
        <Input
          placeholder="password"
          className="bg-app-highlight"
          {...register("password")}
          onBlur={() => trigger("password")}
        />
        {errors.password && <ErrorText error={errors.password.message!} />}
      </div>
      <Button variant={"v1"} size={"full"} disabled={isSubmitting || !isValid}>
        {isSubmitting ? "Registering in..." : "Register"}
      </Button>
      <p className="text-center text-app-neutral">Or</p>

      <GoogleAuth />
    </form>
  );
};

export default Register;
