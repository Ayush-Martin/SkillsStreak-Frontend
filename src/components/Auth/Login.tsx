import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { Button, Input } from "@/components/ui";
import { ErrorText, GoogleAuth } from "@/components";
import { AppDispatch } from "@/store";
import { login } from "@/features/Auth/slice/userSlice";

import {
  EmailValidationRule,
  PasswordValidationRule,
} from "@/utils/validationRules";
import { z } from "zod";
import { successPopup } from "@/utils/popup";
import { axiosPostRequest } from "@/config/axios";
import { LOGIN_API } from "@/constants/API";
import { connectSocket } from "@/config/socket";

const LoginSchema = z.object({
  email: EmailValidationRule,
  password: PasswordValidationRule,
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

const Login: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
    trigger,
  } = useForm<LoginSchemaType>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    const res = await axiosPostRequest(LOGIN_API, data);
    if (!res) return;
    successPopup(res.message || "user logged in");
    dispatch(login(res.data));
    navigate(from, { replace: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Input
          placeholder="Email"
          className="bg-app-highlight"
          {...register("email")}
          onBlur={() => trigger("email")}
        />

        {errors.email?.message && <ErrorText error={errors.email?.message} />}
      </div>

      <div>
        <Input
          placeholder="Password"
          type="password"
          className="bg-app-highlight"
          {...register("password")}
          onBlur={() => trigger("password")}
        />
        {errors.password?.message && (
          <ErrorText error={errors.password?.message} />
        )}
      </div>

      <Button variant={"v1"} size={"full"} disabled={isSubmitting || !isValid}>
        {isSubmitting ? "Logging in..." : "Login"}
      </Button>

      <p className="text-center text-app-neutral">Or</p>

      <GoogleAuth from={from} />
    </form>
  );
};

export default Login;
