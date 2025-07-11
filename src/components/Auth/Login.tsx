import { FC, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Input } from "@/components/ui";
import { ErrorText, GoogleAuth } from "@/components";

import {
  EmailValidationRule,
  PasswordValidationRule,
} from "@/utils/validationRules";
import { z } from "zod";
import { LoginRegisterContext } from "@/context";

const LoginSchema = z.object({
  email: EmailValidationRule,
  password: PasswordValidationRule,
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

const Login: FC = () => {
  const { handleLogin } = useContext(LoginRegisterContext)!;

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
    handleLogin(data.email, data.password);
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

      <GoogleAuth />
    </form>
  );
};

export default Login;
