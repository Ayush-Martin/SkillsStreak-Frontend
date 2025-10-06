import { FC, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ErrorText, GoogleAuth, Input, Button } from "@/components";

import { LoginRegisterContext } from "@/context";
import {
  RegisterSchemaType,
  RegisterSchema,
} from "@/validation/user.validation";

const Register: FC = () => {
  const { handleRegister } = useContext(LoginRegisterContext)!;

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

  const onSubmit = (data: RegisterSchemaType) => {
    handleRegister(data.username, data.email, data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Input
          placeholder="username"
          className="bg-[#141926] border-white/10 text-white"
          {...register("username")}
          onBlur={() => trigger("username")}
        />
        {errors.username && <ErrorText error={errors.username.message!} />}
      </div>
      <div>
        <Input
          placeholder="email"
          className="bg-[#141926] border-white/10 text-white"
          {...register("email")}
          onBlur={() => trigger("email")}
        />
        {errors.email && <ErrorText error={errors.email.message!} />}
      </div>
      <div>
        <Input
          placeholder="password"
          className="bg-[#141926] border-white/10 text-white"
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
